import { Geometric2, Unit } from "@geometryzen/multivectors";
import { Euclidean2 } from "../engineG20/Euclidean2";
import { LinearDamper } from "./LinearDamper";
import { Particle } from "./Particle";

describe("LinearDamper", function () {
    it("constructor", function () {
        const metric = new Euclidean2();

        const Alice = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
        Alice.X = Geometric2.vector(-0.5, 0);
        const Bob = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
        Bob.X = Geometric2.vector(0.5, 0);
        const damper = new LinearDamper(Alice, Bob);
        expect(damper).toBeDefined();
        expect(damper.potentialEnergy().a).toBe(0);

    });
    describe("frictionCoefficient and b", function () {
        it("should be initialized to one, dimensionless.", function () {
            const metric = new Euclidean2();

            const Alice = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
            Alice.X = Geometric2.vector(-0.5, 0);
            const Bob = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
            Bob.X = Geometric2.vector(0.5, 0);
            const damper = new LinearDamper(Alice, Bob);
            expect(damper.b.a).toBe(1);
            expect(Unit.isOne(damper.b.uom)).toBe(true);
            expect(damper.frictionCoefficient.a).toBe(1);
            expect(Unit.isOne(damper.frictionCoefficient.uom)).toBe(true);
        });
        it("b should be assignable.", function () {
            const metric = new Euclidean2();

            const Alice = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
            Alice.X = Geometric2.vector(-0.5, 0);
            const Bob = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
            Bob.X = Geometric2.vector(0.5, 0);
            const damper = new LinearDamper(Alice, Bob);

            damper.b = Geometric2.scalar(2, Unit.FRICTION_COEFFICIENT);
            expect(damper.b.a).toBe(2);
            expect(damper.b.uom).toBe(Unit.FRICTION_COEFFICIENT);
            expect(damper.frictionCoefficient.a).toBe(2);
            expect(damper.frictionCoefficient.uom).toBe(Unit.FRICTION_COEFFICIENT);

            damper.b = Geometric2.scalar(2, Unit.ONE);
            expect(damper.b.a).toBe(2);
            expect(damper.b.uom).toBe(Unit.ONE);
            expect(damper.frictionCoefficient.a).toBe(2);
            expect(damper.frictionCoefficient.uom).toBe(Unit.ONE);
        });
        it("frictionCoefficient should be assignable.", function () {
            const metric = new Euclidean2();

            const Alice = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
            Alice.X = Geometric2.vector(-0.5, 0);
            const Bob = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
            Bob.X = Geometric2.vector(0.5, 0);
            const damper = new LinearDamper(Alice, Bob);

            damper.frictionCoefficient = Geometric2.scalar(2, Unit.FRICTION_COEFFICIENT);
            expect(damper.b.a).toBe(2);
            expect(damper.b.uom).toBe(Unit.FRICTION_COEFFICIENT);
            expect(damper.frictionCoefficient.a).toBe(2);
            expect(damper.frictionCoefficient.uom).toBe(Unit.FRICTION_COEFFICIENT);
        });
    });
    describe("forces", function () {
        it("should be zero when Alice and Bob are stationary.", function () {
            const metric = new Euclidean2();

            const Alice = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
            Alice.X = Geometric2.vector(-1, 0);

            const Bob = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
            Bob.X = Geometric2.vector(1, 0);

            const damper = new LinearDamper(Alice, Bob);
            const forces = damper.updateForces();
            expect(forces.length).toBe(2);
            const app1 = forces[0];
            const f1 = app1.vector;
            const x1 = app1.location;
            const app2 = forces[1];
            const f2 = app2.vector;
            const x2 = app2.location;
            expect(f1.isZero()).toBe(true);
            expect(f2.isZero()).toBe(true);
            expect(x1.equals(Alice.X)).toBe(true);
            expect(x2.equals(Bob.X)).toBe(true);
        });
        it("Alice and Bob moving away from each other.", function () {
            const metric = new Euclidean2();
            const eR = Geometric2.e1;
            const eL = eR.neg();

            const Alice = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
            Alice.X = eL;
            Alice.P = eL.mulByNumber(0.5);

            const Bob = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
            Bob.X = eR;
            Bob.P = eR.mulByNumber(0.5);

            const damper = new LinearDamper(Alice, Bob);
            const forces = damper.updateForces();
            expect(forces.length).toBe(2);
            const appA = forces[0];
            const forceOnA = appA.vector;
            const x1 = appA.location;
            const appB = forces[1];
            const forceOnB = appB.vector;
            const x2 = appB.location;
            expect(forceOnA.equals(eR)).toBe(true);
            expect(forceOnB.equals(eL)).toBe(true);
            expect(x1.equals(Alice.X)).toBe(true);
            expect(x2.equals(Bob.X)).toBe(true);
        });
        it("Alice and Bob moving towards each other.", function () {
            const metric = new Euclidean2();
            const eR = Geometric2.e1;
            const eL = eR.neg();

            const Alice = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
            Alice.X = eL;
            Alice.P = eR.mulByNumber(0.5);

            const Bob = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
            Bob.X = eR;
            Bob.P = eL.mulByNumber(0.5);

            const damper = new LinearDamper(Alice, Bob);
            const forces = damper.updateForces();
            expect(forces.length).toBe(2);
            const appA = forces[0];
            const forceOnA = appA.vector;
            const x1 = appA.location;
            const appB = forces[1];
            const forceOnB = appB.vector;
            const x2 = appB.location;
            expect(forceOnA.equals(eL)).toBe(true);
            expect(forceOnB.equals(eR)).toBe(true);
            expect(x1.equals(Alice.X)).toBe(true);
            expect(x2.equals(Bob.X)).toBe(true);
        });
        it("Alice and Bob moving perpendicular to line joining them.", function () {
            const metric = new Euclidean2();
            const right = Geometric2.e1;
            const left = right.neg();
            const up = Geometric2.e2;
            const down = up.neg();
            const zero = Geometric2.zero;

            const Alice = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
            Alice.X = left;
            Alice.P = down;

            const Bob = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
            Bob.X = right;
            Bob.P = up;

            const damper = new LinearDamper(Alice, Bob);
            const forces = damper.updateForces();
            expect(forces.length).toBe(2);
            const appA = forces[0];
            const forceOnA = appA.vector;
            const x1 = appA.location;
            const appB = forces[1];
            const forceOnB = appB.vector;
            const x2 = appB.location;
            expect(forceOnA.equals(zero)).toBe(true);
            expect(forceOnB.equals(zero)).toBe(true);
            expect(x1.equals(Alice.X)).toBe(true);
            expect(x2.equals(Bob.X)).toBe(true);
        });
        it("Alice stationary and Bob moving right.", function () {
            const metric = new Euclidean2();
            const right = Geometric2.e1;
            const left = right.neg();
            // const up = Geometric2.e2;
            // const down = up.neg();
            const zero = Geometric2.zero;

            const Alice = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
            Alice.X = left;
            Alice.P = zero;

            const Bob = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
            Bob.X = right;
            Bob.P = right;

            const damper = new LinearDamper(Alice, Bob);
            const forces = damper.updateForces();
            expect(forces.length).toBe(2);
            const appA = forces[0];
            const forceOnA = appA.vector;
            const x1 = appA.location;
            const appB = forces[1];
            const forceOnB = appB.vector;
            const x2 = appB.location;
            expect(forceOnA.equals(right)).toBe(true);
            expect(forceOnB.equals(left)).toBe(true);
            expect(x1.equals(Alice.X)).toBe(true);
            expect(x2.equals(Bob.X)).toBe(true);
        });
    });
});
