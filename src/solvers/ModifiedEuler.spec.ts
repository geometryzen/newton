import { Unit } from "@geometryzen/multivectors";
import { DiffEqSolverSystem } from "../core/DiffEqSolverSystem";
import { ModifiedEuler } from "./ModifiedEuler";

/**
 * @hiddenI
 */
class MockSystem implements DiffEqSolverSystem {
    constructor(private readonly state: number[], private readonly units: Unit[], private readonly rateOfChange: number[], private readonly rateOfChangeUnits: Unit[], public readonly stateEnd: number[], public readonly unitsEnd: Unit[]) {

    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getVariableName(idx: number): string {
        throw new Error("Method not implemented.");
    }
    /**
     * This is the first method of the Simulation that is called by the solver.
     */
    getState(): number[] {
        return this.state;
    }
    getUnits(): Unit[] {
        return this.units;
    }
    /**
     * This is the second method of the simulation that is called by the solver.
     * @param state 
     * @param rateOfChange 
     * @param Δt 
     * @param uomTime 
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    evaluate(state: number[], stateUoms: Unit[], rateOfChange: number[], rateOfChangeUnits: Unit[], Δt: number, uomTime?: Unit): void {
        const N = this.rateOfChange.length;
        for (let i = 0; i < N; i++) {
            rateOfChange[i] = this.rateOfChange[i];
            rateOfChangeUnits[i] = this.rateOfChangeUnits[i];
        }
    }
    /**
     * This is the third method of the simulation that is called by the solver.
     * @param state 
     */
    setState(state: number[]): void {
        const N = state.length;
        for (let i = 0; i < N; i++) {
            this.stateEnd.push(state[i]);
        }
    }
    setUnits(units: Unit[]): void {
        const N = units.length;
        for (let i = 0; i < N; i++) {
            this.unitsEnd.push(units[i]);
        }
    }
}

describe("ModifiedEuler", function () {
    it("constructor", function () {
        const x = Math.random();
        const ΔxOverΔt = Math.random();
        const state = [x];
        const units = [Unit.METER];
        const rateOfChange = [ΔxOverΔt];
        const rateOfChangeUnits = [Unit.div(Unit.METER, Unit.SECOND)];
        const stateEnd: number[] = [];
        const unitsEnd: Unit[] = [];
        const system = new MockSystem(state, units, rateOfChange, rateOfChangeUnits, stateEnd, unitsEnd);
        const method = new ModifiedEuler(system);
        expect(method).toBeDefined();
    });
    it("step", function () {
        const x = Math.random();
        const ΔxOverΔt = Math.random();
        const Δt = Math.random();
        const state = [x];
        const units = [Unit.METER];
        const rateOfChange = [ΔxOverΔt];
        const rateOfChangeUnits = [Unit.div(Unit.METER, Unit.SECOND)];
        const stateEnd: number[] = [];
        const unitsEnd: Unit[] = [];
        const system = new MockSystem(state, units, rateOfChange, rateOfChangeUnits, stateEnd, unitsEnd);
        const method = new ModifiedEuler(system);
        method.step(Δt, Unit.SECOND);
        expect(system.stateEnd.length).toBe(1);
        expect(system.stateEnd[0]).toBe(x + ΔxOverΔt * Δt);
        expect(system.unitsEnd.length).toBe(1);
        expect(system.unitsEnd[0]).toBe(Unit.METER);
    });
});
