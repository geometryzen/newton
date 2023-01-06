import { Unit } from '@geometryzen/multivectors';
import { DiffEqSolverSystem } from './DiffEqSolverSystem';

/**
 * @hidden
 */
export interface Simulation extends DiffEqSolverSystem {

    /**
     * 
     */
    readonly time: number;

    /**
     * Handler for actions to be performed before getState and the evaluate calls.
     * A simulation may remove temporary simulation objects, such as forces, from
     * the list of simulation objects. This method will normally be called by the strategy.
     */
    prolog(stepSize: number, uomStep?: Unit): void;

    /**
     * Handler for actions to be performed after the evaluate calls and setState.
     * Computes the system energy, linear momentum and angular momentum.
     * This method will normally be called by the strategy.
     */
    epilog(stepSize: number, uomStep?: Unit): void;
}
