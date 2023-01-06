import { Unit } from '@geometryzen/multivectors';
import { DiffEqSolver } from '../core/DiffEqSolver';
import { EnergySystem } from '../core/EnergySystem';
import { Simulation } from '../core/Simulation';

/**
 * An adaptive step solver that adjusts the step size in order to
 * ensure that the energy change be less than a tolerance amount.
 * @hidden
 */
export class ConstantEnergySolver<T> implements DiffEqSolver {
    private energySystem_: EnergySystem<T>;
    private solverMethod_: DiffEqSolver;
    // private totSteps_: number;
    private savedVals: number[];
    private savedUoms: Unit[];
    public stepUpperBound = 1;
    /**
     * The smallest time step that will executed.
     * Setting a reasonable lower bound prevents the solver from taking too long to give up.
     */
    public stepLowerBound = 1E-5;
    /**
     *
     */
    private tolerance_ = 1E-6;
    /**
     * Constructs an adaptive step solver that adjusts the step size in order to
     * ensure that the energy change be less than a tolerance amount.
     */
    constructor(private readonly simulation: Simulation, energySystem: EnergySystem<T>, solverMethod: DiffEqSolver) {
        this.energySystem_ = energySystem;
        this.solverMethod_ = solverMethod;
        // this.totSteps_ = 0;
    }
    step(Δt: number, uomTime?: Unit): void {
        // save the vars in case we need to back up and start again
        this.savedVals = this.simulation.getState();
        this.savedUoms = this.simulation.getUnits();
        const startTime = this.simulation.time;
        /**
         * The adapted step size.
         */
        let adaptedStepSize = Δt; // adaptedStepSize = our smaller step size
        /**
         * number of diffEqSolver steps taken during this step
         */
        // let steps = 0;
        this.simulation.epilog(Δt, uomTime); // to ensure getEnergyInfo gives correct value
        const metric = this.energySystem_.metric;
        const startEnergy: number = metric.a(this.energySystem_.totalEnergy());
        // let lastEnergyDiff = Number.POSITIVE_INFINITY;
        /**
         * the value we are trying to reduce to zero
         */
        let value = Number.POSITIVE_INFINITY;
        let firstTime = true;
        if (Δt < this.stepLowerBound) {
            return;
        }
        do {
            let t = startTime;  // t = current time
            if (!firstTime) {
                // restore state and solve again with smaller step size
                this.simulation.setState(this.savedVals);
                this.simulation.setUnits(this.savedUoms);
                this.simulation.epilog(Δt, uomTime);
                // goog.asserts.assert(Math.abs(this.simulation_.time - startTime) < 1E-12);
                // const e = this.energySystem_.totalEnergy();
                // goog.asserts.assert(Math.abs(e - startEnergy) < 1E-10);
                adaptedStepSize = adaptedStepSize / 5;  // reduce step size
                if (adaptedStepSize < this.stepLowerBound) {
                    throw new Error(`Unable to achieve tolerance ${this.tolerance} with stepLowerBound ${this.stepLowerBound}`);
                }
            }
            // steps = 0;  // only count steps of the last iteration
            // take multiple steps of size adaptedStepSize to equal the entire requested stepSize
            while (t < startTime + Δt) {
                let h = adaptedStepSize;
                // if this step takes us past the end of the overall step, then shorten it
                if (t + h > startTime + Δt - 1E-10) {
                    h = startTime + Δt - t;
                }
                // steps++;
                this.solverMethod_.step(h, uomTime);
                this.simulation.epilog(Δt, uomTime);
                t += h;
            }
            const finishEnergy: number = metric.a(this.energySystem_.totalEnergy());
            const energyDiff = Math.abs(startEnergy - finishEnergy);
            // reduce time step until change in energy goes to zero.
            value = energyDiff;
            // lastEnergyDiff = energyDiff;
            firstTime = false;
        } while (value > this.tolerance_);
        // this.totSteps_ += steps;
    }

    /**
     * Returns the tolerance used to decide if sufficient accuracy has been achieved.
     * Default is 1E-6.
     */
    get tolerance(): number {
        return this.tolerance_;
    }

    /**
     * Sets the tolerance used to decide if sufficient accuracy has been achieved.
     * Default is 1E-6.
     * @param value the tolerance value for deciding if sufficient accuracy
     * has been achieved
     */
    set tolerance(value: number) {
        this.tolerance_ = value;
    }
}
