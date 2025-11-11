import { Injectable, Logger } from '@nestjs/common';

enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

interface CircuitBreakerConfig {
  failureThreshold: number;
  timeout: number;
  resetTimeout: number;
}

@Injectable()
export class CircuitBreakerService {
  private readonly logger = new Logger(CircuitBreakerService.name);
  private circuits: Map<string, {
    state: CircuitState;
    failureCount: number;
    lastFailureTime: number;
    successCount: number;
  }> = new Map();

  private defaultConfig: CircuitBreakerConfig = {
    failureThreshold: 5,
    timeout: 60000, // 60 seconds
    resetTimeout: 30000, // 30 seconds
  };

  async execute<T>(
    operation: () => Promise<T>,
    circuitName: string,
    config?: Partial<CircuitBreakerConfig>,
  ): Promise<T> {
    const circuitConfig = { ...this.defaultConfig, ...config };
    const circuit = this.getOrCreateCircuit(circuitName);

    // Check if circuit should transition from OPEN to HALF_OPEN
    if (circuit.state === CircuitState.OPEN) {
      if (Date.now() - circuit.lastFailureTime > circuitConfig.resetTimeout) {
        circuit.state = CircuitState.HALF_OPEN;
        circuit.successCount = 0;
        this.logger.log(`Circuit ${circuitName} moved to HALF_OPEN state`);
      } else {
        throw new Error(`Circuit breaker ${circuitName} is OPEN. Service unavailable.`);
      }
    }

    try {
      const result = await operation();
      this.onSuccess(circuit, circuitName, circuitConfig);
      return result;
    } catch (error) {
      this.onFailure(circuit, circuitName, circuitConfig);
      throw error;
    }
  }

  private getOrCreateCircuit(circuitName: string) {
    if (!this.circuits.has(circuitName)) {
      this.circuits.set(circuitName, {
        state: CircuitState.CLOSED,
        failureCount: 0,
        lastFailureTime: 0,
        successCount: 0,
      });
    }
    return this.circuits.get(circuitName)!;
  }

  private onSuccess(
    circuit: { state: CircuitState; failureCount: number; successCount: number },
    circuitName: string,
    config: CircuitBreakerConfig,
  ) {
    circuit.failureCount = 0;

    if (circuit.state === CircuitState.HALF_OPEN) {
      circuit.successCount++;
      // If we have enough successes in HALF_OPEN, close the circuit
      if (circuit.successCount >= 2) {
        circuit.state = CircuitState.CLOSED;
        circuit.successCount = 0;
        this.logger.log(`Circuit ${circuitName} moved to CLOSED state`);
      }
    }
  }

  private onFailure(
    circuit: { state: CircuitState; failureCount: number; lastFailureTime: number },
    circuitName: string,
    config: CircuitBreakerConfig,
  ) {
    circuit.failureCount++;
    circuit.lastFailureTime = Date.now();

    if (circuit.state === CircuitState.HALF_OPEN) {
      // If we fail in HALF_OPEN, immediately open the circuit
      circuit.state = CircuitState.OPEN;
      this.logger.warn(`Circuit ${circuitName} moved to OPEN state (failed in HALF_OPEN)`);
    } else if (circuit.failureCount >= config.failureThreshold) {
      circuit.state = CircuitState.OPEN;
      this.logger.warn(
        `Circuit ${circuitName} moved to OPEN state after ${circuit.failureCount} failures`,
      );
    }
  }

  getCircuitState(circuitName: string): CircuitState | null {
    const circuit = this.circuits.get(circuitName);
    return circuit ? circuit.state : null;
  }

  resetCircuit(circuitName: string): void {
    const circuit = this.circuits.get(circuitName);
    if (circuit) {
      circuit.state = CircuitState.CLOSED;
      circuit.failureCount = 0;
      circuit.successCount = 0;
      circuit.lastFailureTime = 0;
      this.logger.log(`Circuit ${circuitName} has been reset`);
    }
  }
}

