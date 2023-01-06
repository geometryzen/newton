import { Unit } from '@geometryzen/multivectors';

/**
 * <p>
 * The solver integrates the derivatives of the kinematic variables (usually X, R, P, and J).
 * The solver can ask the simulation for derivatives at one or more system configurations
 * between the current configuration, Y(t), and the configuration Y(t + stepSize * uomStep), where
 * Y(t) is the state "vector" for the system at time t.
 * </p>
 * <p>
 * Different solvers may manage the Local Truncation Error (LTE) in different ways.
 * </p>
 * @hidden
 */
export interface DiffEqSolver {
    step(stepSize: number, uomStep: Unit): void;
}
