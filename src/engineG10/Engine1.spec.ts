import { Geometric1, Unit } from "@geometryzen/multivectors";
import { ConstantForceLaw } from "../core/ConstantForceLaw";
import { GravitationLaw } from "../core/GravitationLaw";
import { Spring } from "../core/Spring";
import { VarsList } from "../core/VarsList";
import { Block1 } from "./Block1";
import { Engine1 } from "./Engine1";
import { Particle1 } from "./Particle1";
import { SurfaceConstraint1 } from "./SurfaceConstraint1";

describe("Engine1", function () {
    describe("constructor", function () {
        it("should be defined.", function () {
            const engine = new Engine1();
            expect(engine).toBeDefined();
        });
    });
    describe("varsList property", function () {
        it("should be defined.", function () {
            const engine = new Engine1();
            const varsList = engine.varsList;
            expect(varsList).toBeDefined();
            expect(varsList instanceof VarsList).toBe(true);
        });
    });
    describe("updateFromBodies() method", function () {
        it("should be callable.", function () {
            const engine = new Engine1();
            engine.updateFromBodies();
            expect(true).toBe(true);
        });
    });
    describe("advance() method with an empty system", function () {
        it("should work.", function () {
            const engine = new Engine1();
            const Δt = Math.random();
            engine.advance(Δt);
            expect(true).toBe(true);
        });
    });
    describe("addBody() method", function () {
        it("should be callable.", function () {
            const engine = new Engine1();
            const M = new Geometric1();
            const Q = new Geometric1();
            const bead = new Particle1(M, Q);
            engine.addBody(bead);
            expect(true).toBe(true);
        });
    });
    describe("advance() method with a single particle", function () {
        it("should be callable.", function () {
            const engine = new Engine1();
            const M = new Geometric1();
            const Q = new Geometric1();
            const bead = new Particle1(M, Q);
            engine.addBody(bead);
            const Δt = Math.random();
            engine.advance(Δt);
            expect(true).toBe(true);
        });
    });
    describe("addForceLaw() method with a single particle", function () {
        it("should be callable.", function () {
            const engine = new Engine1();
            const M = new Geometric1();
            const Q = new Geometric1();
            const bead = new Particle1(M, Q);
            engine.addBody(bead);
            const F = new Geometric1();
            const forceLaw = new ConstantForceLaw(bead, F);
            engine.addForceLaw(forceLaw);
            expect(true).toBe(true);
        });
    });
    describe("addForceLaw() method with a single particle and simulation", function () {
        it("should be callable.", function () {
            const engine = new Engine1();
            const M = new Geometric1();
            const Q = new Geometric1();
            const bead = new Particle1(M, Q);
            engine.addBody(bead);
            const F = new Geometric1();
            const forceLaw = new ConstantForceLaw(bead, F);
            engine.addForceLaw(forceLaw);
            const Δt = Math.random();
            engine.advance(Δt);
            expect(true).toBe(true);
        });
    });
    describe("addConstraintLaw() method with a single particle and simulation", function () {
        it("should be callable.", function () {
            const engine = new Engine1();
            const M = new Geometric1();
            const Q = new Geometric1();
            const bead = new Particle1(M, Q);
            engine.addBody(bead);
            const F = new Geometric1();
            const forceLaw = new ConstantForceLaw(bead, F);
            engine.addForceLaw(forceLaw);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const radiusFn = function (x: Geometric1, radius: Geometric1) {
                // Do nothing yet.
            };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const rotationFn = function (x: Geometric1, plane: Geometric1) {
                // Do nothing yet.
            };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const tangentFn = function (x: Geometric1, tangent: Geometric1) {
                // Do nothing yet.
            };
            const constraintLaw = new SurfaceConstraint1(bead, radiusFn, rotationFn, tangentFn);
            engine.addConstraint(constraintLaw);
            const Δt = Math.random();
            engine.advance(Δt);
            expect(true).toBe(true);
        });
    });
    describe("Spring", function () {
        it("should be callable.", function () {
            const engine = new Engine1();
            const M = new Geometric1();
            const Q = new Geometric1();
            const bead = new Particle1(M, Q);
            const wall = new Particle1(M, Q);
            engine.addBody(bead);
            engine.addBody(wall);
            const forceLaw = new Spring(bead, wall);
            engine.addForceLaw(forceLaw);
            const Δt = Math.random();
            engine.advance(Δt);
            expect(true).toBe(true);
        });
    });
    describe("GravitationLaw", function () {
        it("should be callable.", function () {
            const engine = new Engine1();
            const M = new Geometric1();
            const Q = new Geometric1();
            const bead = new Particle1(M, Q);
            const wall = new Particle1(M, Q);
            engine.addBody(bead);
            engine.addBody(wall);
            const forceLaw = new GravitationLaw(bead, wall);
            engine.addForceLaw(forceLaw);
            const Δt = Math.random();
            engine.advance(Δt);
            expect(true).toBe(true);
        });
    });
    describe("Spring with a Block", function () {
        it("should be callable.", function () {
            const engine = new Engine1();
            const width = new Geometric1();
            const M = new Geometric1();
            const Q = new Geometric1();
            const block = new Block1(width);
            const wall = new Particle1(M, Q);
            engine.addBody(block);
            engine.addBody(wall);
            const forceLaw = new Spring(block, wall);
            engine.addForceLaw(forceLaw);
            const Δt = Math.random();
            engine.advance(Δt);
            expect(true).toBe(true);
        });
    });
    describe("totalEnergy() with a Spring", function () {
        it("should be callable.", function () {
            const engine = new Engine1();
            const width = new Geometric1();
            const M = new Geometric1();
            const Q = new Geometric1();
            const block = new Block1(width);
            const wall = new Particle1(M, Q);
            engine.addBody(block);
            engine.addBody(wall);
            const forceLaw = new Spring(block, wall);
            engine.addForceLaw(forceLaw);
            const Δt = Math.random();
            engine.advance(Δt);
            const E = engine.totalEnergy();
            expect(E).toBeDefined();
            expect(E instanceof Geometric1).toBe(true);
        });
    });
    describe("examples", function () {
        describe("Newton's First Law of Motion", function () {
            it("dimensionless", function () {
                const engine = new Engine1();
                const M0 = new Geometric1([Math.random(), 0], Unit.ONE);
                M0.lock();
                const Q0 = new Geometric1([0, 0], Unit.ONE);
                Q0.lock();
                const bead = new Particle1(M0, Q0);

                // TODO: There should be checks in RigidBody for scalar, vector, bivector, spinor...
                const X0 = new Geometric1([0, Math.random()], Unit.ONE);
                X0.lock();

                const P0 = new Geometric1([0, Math.random()], Unit.ONE);
                P0.lock();

                bead.M = M0;
                bead.X = X0;
                // block.R should ne 1.
                bead.P = P0;
                // block.L should be zero.

                engine.addBody(bead);

                expect(bead.M.a).toBe(M0.a);
                expect(bead.M.x).toBe(M0.x);
                expect(bead.M.uom).toBe(Unit.ONE);

                expect(bead.X.a).toBe(X0.a);
                expect(bead.X.x).toBe(X0.x);
                expect(bead.X.uom).toBe(Unit.ONE);

                expect(bead.P.a).toBe(P0.a);
                expect(bead.P.x).toBe(P0.x);
                expect(bead.P.uom).toBe(Unit.ONE);

                engine.advance(1, Unit.ONE);

                expect(bead.X.a).toBe(0);
                expect(bead.X.x).toBeCloseTo(X0.x + P0.x / M0.a, 12);
                expect(bead.X.uom).toBe(Unit.ONE);

                expect(bead.P.a).toBe(P0.a);
                expect(bead.P.x).toBe(P0.x);
                expect(Unit.isOne(bead.P.uom)).toBe(true);
            });
            it("units", function () {
                const engine = new Engine1();
                const M0 = new Geometric1([Math.random(), 0], Unit.KILOGRAM);
                M0.lock();
                const Q0 = new Geometric1([0, 0], Unit.COULOMB);
                Q0.lock();
                const bead = new Particle1(M0, Q0);

                // TODO: There should be checks in RigidBody for scalar, vector, bivector, spinor...
                const X0 = new Geometric1([0, Math.random()], Unit.METER);
                X0.lock();

                const P0 = new Geometric1([0, Math.random()], Unit.KILOGRAM_METER_PER_SECOND);
                P0.lock();

                bead.M = M0;
                bead.X = X0;
                // block.R should ne 1.
                bead.P = P0;
                // block.L should be zero.

                engine.addBody(bead);

                expect(bead.M.a).toBe(M0.a);
                expect(bead.M.x).toBe(M0.x);
                expect(bead.M.uom).toBe(Unit.KILOGRAM);

                expect(bead.X.a).toBe(X0.a);
                expect(bead.X.x).toBe(X0.x);
                expect(bead.X.uom).toBe(Unit.METER);

                expect(bead.P.a).toBe(P0.a);
                expect(bead.P.x).toBe(P0.x);
                expect(bead.P.uom).toBe(Unit.KILOGRAM_METER_PER_SECOND);

                engine.advance(1, Unit.SECOND);

                expect(bead.X.a).toBe(0);
                expect(bead.X.x).toBeCloseTo(X0.x + P0.x / M0.a, 12);
                expect(bead.X.uom).toBe(Unit.METER);

                expect(bead.P.a).toBe(P0.a);
                expect(bead.P.x).toBe(P0.x);
                expect(bead.P.uom).toBe(Unit.KILOGRAM_METER_PER_SECOND);
            });
        });
    });
});
