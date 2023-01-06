import { Geometric1, Geometric2 } from '@geometryzen/multivectors';
import { MetricG10 } from '../engineG10/MetricG10';
import { Euclidean2 } from '../engineG20/Euclidean2';
import { Particle } from './Particle';
import { Spring } from './Spring';
describe("Spring", function () {
    describe("Potential Energy (Euclidean1)", function () {
        it("should be zero at the rest length separation.", function () {
            const metric = new MetricG10();

            const Alice = new Particle(Geometric1.scalar(1), Geometric1.scalar(0), metric);
            Alice.X = Geometric1.vector(-0.5);
            const Bob = new Particle(Geometric1.scalar(1), Geometric1.scalar(0), metric);
            Bob.X = Geometric1.vector(0.5);
            const spring = new Spring(Alice, Bob);
            expect(spring.potentialEnergy().a).toBe(0);
        });
        it("should be increase when stretched.", function () {
            const metric = new MetricG10();

            const Alice = new Particle(Geometric1.scalar(1), Geometric1.scalar(0), metric);
            Alice.X = Geometric1.vector(-1);
            const Bob = new Particle(Geometric1.scalar(1), Geometric1.scalar(0), metric);
            Bob.X = Geometric1.vector(1);
            const spring = new Spring(Alice, Bob);
            expect(spring.potentialEnergy().a).toBe(0.5);
        });
        it("should be increase when compressed.", function () {
            const metric = new MetricG10();

            const Alice = new Particle(Geometric1.scalar(1), Geometric1.scalar(0), metric);
            Alice.X = Geometric1.vector(-0.25);
            const Bob = new Particle(Geometric1.scalar(1), Geometric1.scalar(0), metric);
            Bob.X = Geometric1.vector(0.25);
            const spring = new Spring(Alice, Bob);
            expect(spring.potentialEnergy().a).toBe(0.125);
        });
    });
    describe("Potential Energy (Euclidean2)", function () {
        it("should be zero at the rest length separation.", function () {
            const metric = new Euclidean2();

            const Alice = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
            Alice.X = Geometric2.vector(-0.5, 0);
            const Bob = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
            Bob.X = Geometric2.vector(0.5, 0);
            const spring = new Spring(Alice, Bob);
            expect(spring.potentialEnergy().a).toBe(0);
        });
        it("should be increase when stretched.", function () {
            const metric = new Euclidean2();

            const Alice = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
            Alice.X = Geometric2.vector(-1, 0);
            const Bob = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
            Bob.X = Geometric2.vector(1, 0);
            const spring = new Spring(Alice, Bob);
            expect(spring.potentialEnergy().a).toBe(0.5);
        });
        it("should be increase when compressed.", function () {
            const metric = new Euclidean2();

            const Alice = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
            Alice.X = Geometric2.vector(-0.25, 0);
            const Bob = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
            Bob.X = Geometric2.vector(0.25, 0);
            const spring = new Spring(Alice, Bob);
            expect(spring.potentialEnergy().a).toBe(0.125);
        });
    });
    describe("Force", function () {
        it("should be zero at the rest length separation.", function () {
            const metric = new Euclidean2();

            const Alice = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
            Alice.X = Geometric2.vector(-0.5, 0);
            const Bob = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
            Bob.X = Geometric2.vector(0.5, 0);
            const spring = new Spring(Alice, Bob);
            const forces = spring.updateForces();
            expect(forces.length).toBe(2);
            expect(forces[0].F.x).toBe(0);
            expect(forces[0].F.y).toBe(0);
            expect(forces[1].F.x).toBe(0);
            expect(forces[1].F.y).toBe(0);
            expect(spring.potentialEnergy().a).toBe(0);
        });
    });
    it("should be inward when extended.", function () {
        const metric = new Euclidean2();

        const Alice = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
        Alice.X = Geometric2.vector(-1, 0);
        const Bob = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
        Bob.X = Geometric2.vector(1, 0);
        const spring = new Spring(Alice, Bob);
        const forces = spring.updateForces();
        expect(forces.length).toBe(2);
        expect(forces[0].F.x).toBe(1);
        expect(forces[0].F.y).toBe(0);
        expect(forces[1].F.x).toBe(-1);
        expect(forces[1].F.y).toBe(0);
        expect(spring.potentialEnergy().a).toBe(0.5);
    });
    it("should be outward when compressed.", function () {
        const metric = new Euclidean2();

        const Alice = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
        Alice.X = Geometric2.vector(-0.25, 0);
        const Bob = new Particle(Geometric2.scalar(1), Geometric2.scalar(0), metric);
        Bob.X = Geometric2.vector(0.25, 0);
        const spring = new Spring(Alice, Bob);
        const forces = spring.updateForces();
        expect(forces.length).toBe(2);
        expect(forces[0].F.x).toBe(-0.5);
        expect(forces[0].F.y).toBe(0);
        expect(forces[1].F.x).toBe(0.5);
        expect(forces[1].F.y).toBe(0);
        expect(spring.potentialEnergy().a).toBe(0.125);
    });
});
