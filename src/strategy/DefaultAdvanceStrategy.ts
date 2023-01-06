import { Unit } from '@geometryzen/multivectors';
import { mustBeNonNullObject } from '../checks/mustBeNonNullObject';
import { mustBeNumber } from '../checks/mustBeNumber';
import { DiffEqSolver } from '../core/DiffEqSolver';
import { Simulation } from '../core/Simulation';
import { AdvanceStrategy } from '../runner/AdvanceStrategy';

/**
 * @hidden
 */
export class DefaultAdvanceStrategy implements AdvanceStrategy {
    /**
     * 
     */
    constructor(private readonly simulation: Simulation, private readonly solver: DiffEqSolver) {
        mustBeNonNullObject('simulation', simulation);
        mustBeNonNullObject('solver', solver);
    }

    /**
     * 1. Update the state vector from bodies.
     * 2. The solver integrates the derivatives from the simulation.
     * 3. Compute system variables such as energies, linear momentum, and angular momentum.
     */
    advance(stepSize: number, uomStep?: Unit): void {
        mustBeNumber("stepSize", stepSize);
        this.simulation.prolog(stepSize, uomStep);
        this.solver.step(stepSize, uomStep);
        this.simulation.epilog(stepSize, uomStep);
    }
}
