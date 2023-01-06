import { Geometric3 as G3 } from '@geometryzen/multivectors';
import { DiffEqSolver } from '../core/DiffEqSolver';
import { Spring } from '../core/Spring';
// import { EulerMethod } from '../solvers/EulerMethod';
// import { ModifiedEuler } from '../solvers/ModifiedEuler';
// import { ConstantEnergySolver } from '../solvers/ConstantEnergySolver';
import { RungeKutta } from '../solvers/RungeKutta';
import { DefaultAdvanceStrategy } from '../strategy/DefaultAdvanceStrategy';
import { Block3 } from './Block3';
import { Physics3 } from './Physics3';

describe("Physics3", function () {
    it("should be backwards compatible.", function () {
        const e1 = G3.e1;
        // const e2 = G3.e2;
        const e3 = G3.e3;
        /**
         * kilogram
         */
        const kg = G3.kilogram;
        /**
         * meter
         */
        const m = G3.meter;
        /**
         * second
         */
        const s = G3.second;
        const N = G3.newton;

        const state = new Physics3();
        const rk4: DiffEqSolver = new RungeKutta(state);
        const solver = rk4;
        // const solver = new ConstantEnergySolver(state, state, rk4);
        // solver.tolerance = 1E-5;
        // solver.stepLowerBound = 1E-7;
        const strategy = new DefaultAdvanceStrategy(state, solver);
        const Δt = G3.scalar(0.01).mul(s);

        const width = G3.scalar(0.5).mul(m);
        const height = G3.scalar(0.1).mul(m);
        const depth = G3.scalar(0.5).mul(m);
        const block1 = new Block3(width, height, depth);
        const block2 = new Block3(width, height, depth);

        block1.M = G3.scalar(1).mul(kg);
        block2.M = G3.scalar(1).mul(kg);
        block1.X = G3.scalar(-1.0).mul(e1).mul(m);
        block2.X = G3.scalar(+1.0).mul(e1).mul(m);
        // Why is this needed?
        block1.P = G3.scalar(0).mul(kg).mul(m).div(s);
        block2.P = G3.scalar(0).mul(kg).mul(m).div(s);
        // And this?
        block1.L = G3.scalar(0).mul(m).mul(kg).mul(m).div(s);
        block2.L = G3.scalar(0).mul(m).mul(kg).mul(m).div(s);

        state.addBody(block1);
        state.addBody(block2);
        state.showForces = true;

        const spring = new Spring(block1, block2);
        spring.restLength = G3.scalar(1).mul(m);
        spring.stiffness = G3.scalar(1).mul(N).divByScalar(m.a, m.uom);
        // state.addForceLaw(spring);
        spring.attach1 = G3.scalar(1).mul(block1.width).mul(e1).add(G3.scalar(1).mul(block1.depth).mul(e3)).divByNumber(2);

        const forces = spring.updateForces();
        expect(forces.length).toBe(2);
        expect(forces[0].F.toString()).toBe("0.7600505063388335*e1-0.1085786437626905*e3 N");
        expect(forces[1].F.toString()).toBe("-0.7600505063388335*e1+0.1085786437626905*e3 N");

        // Advance one step so that the forces are computed and visible.
        strategy.advance(Δt.a, Δt.uom);

        // Can't actually execute this code because of the DOM dependency.
        // const graph = new EnergyTimeGraph('graph', state.varsList);

        // graph.axes.hAxisScale = s.uom;
        // graph.axes.vAxisScale = state.totalEnergy().uom;
        expect(true).toBe(true);
    });
});
