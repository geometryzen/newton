import { Unit } from "@geometryzen/multivectors";

/**
 * @hidden
 */
export interface DiffEqSolverSystem {
    /**
     * Gets the state vector, Y(t). This method will be the first method called by the solver.
     */
    getState(): number[];
    getUnits(): Unit[];

    /**
     * Computes the derivatives of the state variables based upon the specified state.
     * This will be the second method called by the solver.
     * @param state (input) The configuration estimated by the solver as a state vector, Y(t + Δt * uomTime).
     * @param stateUnits (input)
     * @param rateOfChange (output) The computed derivatives of the state variables.
     * @param rateOfChangeUnits (output) The units of measure of the derivatives of the state variables.
     * @param Δt (input) The displacement from the start of the step.
     * @param uomTime (input) The unit of measure for Δt. 
     */
    evaluate(state: number[], stateUnits: Unit[], rateOfChange: number[], rateOfChangeUnits: Unit[], Δt: number, uomTime?: Unit): void;

    /**
     * Sets the state vector, Y(t).
     * This method will be the third method called by the solver.
     */
    setState(state: number[]): void;
    setUnits(units: Unit[]): void;

    /**
     * Enables the solver to report errors in terms of the variable name.
     * @param idx 
     */
    getVariableName(idx: number): string;
}
