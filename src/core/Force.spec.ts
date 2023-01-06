import { Geometric3, Unit } from "@geometryzen/multivectors";
import { MetricG30 } from "../engineG30/MetricG30";
import { Force } from "./Force";
import { Particle } from "./Particle";

describe("Force", function () {
    describe("constructor", function () {
        it("should work.", function () {
            const metric = new MetricG30();
            const bead = new Particle(Geometric3.scalar(1), Geometric3.scalar(1), metric);
            const force = new Force(bead);
            expect(force).toBeDefined();
        });
        it("locationCoordType should default to LOCAL (the force acts on a point in the body).", function () {
            const metric = new MetricG30();
            const bead = new Particle(Geometric3.scalar(1), Geometric3.scalar(1), metric);
            const force = new Force(bead);
            expect(force.locationCoordType === 0).toBe(true);
        });
        it("vectorCoordType should default to WORLD (the force is usually external).", function () {
            const metric = new MetricG30();
            const bead = new Particle(Geometric3.scalar(1), Geometric3.scalar(1), metric);
            const force = new Force(bead);
            expect(force.vectorCoordType === 1).toBe(true);
        });
    });
    describe("locationCoordType", function () {
        it("may be set to LOCAL or WORLD only.", function () {
            const metric = new MetricG30();
            const bead = new Particle(Geometric3.scalar(1), Geometric3.scalar(1), metric);
            const force = new Force(bead);
            force.locationCoordType = 0;
            expect(force.locationCoordType === 0).toBe(true);
            force.locationCoordType = 1;
            expect(force.locationCoordType === 1).toBe(true);
            expect(function () {
                force.locationCoordType = 2 as unknown as 0;
            }).toThrowError("locationCoordType must be LOCAL (0) or WORLD (1).");
        });
    });
    describe("vectorCoordType", function () {
        it("may be set to LOCAL or WORLD only.", function () {
            const metric = new MetricG30();
            const bead = new Particle(Geometric3.scalar(1), Geometric3.scalar(1), metric);
            const force = new Force(bead);
            force.vectorCoordType = 0;
            expect(force.vectorCoordType === 0).toBe(true);
            force.vectorCoordType = 1;
            expect(force.vectorCoordType === 1).toBe(true);
            expect(function () {
                force.vectorCoordType = 2 as unknown as 0;
            }).toThrowError("vectorCoordType must be LOCAL (0) or WORLD (1).");
        });
    });
    describe("computePosition", function () {
        describe("when vectorCoordType is LOCAL", function () {
            it("should depend on body.X and body.R", function () {
                const metric = new MetricG30();
                const bead = new Particle(Geometric3.scalar(1), Geometric3.scalar(1), metric);
                const x = Math.random();
                const y = Math.random();
                const z = Math.random();
                bead.X.zero().addVector({ x, y, z, uom: Unit.METER });
                bead.R.rotorFromDirections(Geometric3.e1, Geometric3.e2);
                const force = new Force(bead);
                force.vectorCoordType = 0;
                const Lx = Math.random();
                const Ly = Math.random();
                const Lz = Math.random();
                force.location.x = Lx;
                force.location.y = Ly;
                force.location.z = Lz;
                force.location.uom = Unit.METER;
                const X = Geometric3.scalar(0);
                force.computePosition(X);
                expect(X.x).toBeCloseTo(-Ly + x, 10);
                expect(X.y).toBeCloseTo(Lx + y, 10);
                expect(X.z).toBeCloseTo(Lz + z, 10);
            });
        });
        describe("when vectorCoordType is WORLD", function () {
            it("should be the same as the location property.", function () {
                const metric = new MetricG30();
                const bead = new Particle(Geometric3.scalar(1), Geometric3.scalar(1), metric);
                const force = new Force(bead);
                force.vectorCoordType = 1;
                const Lx = Math.random();
                const Ly = Math.random();
                const Lz = Math.random();
                force.location.x = Lx;
                force.location.y = Ly;
                force.location.z = Lz;
                force.location.uom = Unit.METER;
                const X = Geometric3.scalar(0);
                force.computePosition(X);
                expect(X.x).toBe(Lx);
                expect(X.y).toBe(Ly);
                expect(X.z).toBe(Lz);
                expect(X.uom).toBe(Unit.METER);
            });
        });
    });
    describe("computeForce", function () {
        describe("vectorCoordType is LOCAL", function () {
            it("should depend on body.R", function () {
                const metric = new MetricG30();
                const bead = new Particle(Geometric3.scalar(1), Geometric3.scalar(1), metric);
                const x = Math.random();
                const y = Math.random();
                const z = Math.random();
                bead.X.zero().addVector({ x, y, z, uom: Unit.METER });
                bead.R.rotorFromDirections(Geometric3.e1, Geometric3.e2);
                const force = new Force(bead);
                force.vectorCoordType = 0;
                const Fx = Math.random();
                const Fy = Math.random();
                const Fz = Math.random();
                force.vector.x = Fx;
                force.vector.y = Fy;
                force.vector.z = Fz;
                force.vector.uom = Unit.NEWTON;
                const F = Geometric3.scalar(0);
                force.computeForce(F);
                expect(F.x).toBeCloseTo(-Fy, 10);
                expect(F.y).toBeCloseTo(Fx, 10);
                expect(F.z).toBeCloseTo(Fz, 10);
                expect(F.uom).toBe(Unit.NEWTON);
            });
        });
        describe("vectorCoordType is WORLD", function () {
            it("should be the same as the vector property.", function () {
                const metric = new MetricG30();
                const bead = new Particle(Geometric3.scalar(1), Geometric3.scalar(1), metric);
                const force = new Force(bead);
                force.vectorCoordType = 1;
                const Fx = Math.random();
                const Fy = Math.random();
                const Fz = Math.random();
                force.vector.x = Fx;
                force.vector.y = Fy;
                force.vector.z = Fz;
                force.vector.uom = Unit.NEWTON;
                const F = Geometric3.scalar(0);
                force.computeForce(F);
                expect(F.x).toBe(Fx);
                expect(F.y).toBe(Fy);
                expect(F.z).toBe(Fz);
                expect(F.uom).toBe(Unit.NEWTON);
            });
        });
    });
    describe("F", function () {
        it("", function () {
            const metric = new MetricG30();
            const bead = new Particle(Geometric3.scalar(1), Geometric3.scalar(1), metric);
            const force = new Force(bead);
            const F = force.F;
            expect(F.x).toBe(0);
            expect(F.y).toBe(0);
            expect(F.z).toBe(0);
        });
    });
    describe("X", function () {
        it("", function () {
            const metric = new MetricG30();
            const bead = new Particle(Geometric3.scalar(1), Geometric3.scalar(1), metric);
            const force = new Force(bead);
            const X = force.x;
            expect(X.x).toBe(0);
            expect(X.y).toBe(0);
            expect(X.z).toBe(0);
        });
    });
});
