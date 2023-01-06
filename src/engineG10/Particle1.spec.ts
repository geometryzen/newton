import { Geometric1, Unit } from "@geometryzen/multivectors";
import { Particle1 } from "./Particle1";

describe("Particle1", function () {
    describe("constructor", function () {
        it("should be defined.", function () {
            const M = new Geometric1();
            const Q = new Geometric1();
            const particle = new Particle1(M, Q);
            expect(particle).toBeDefined();
        });
        it("mass and charge should be optional.", function () {
            const particle = new Particle1();
            expect(particle).toBeDefined();

            expect(particle.M.a).toBe(1);
            expect(particle.M.x).toBe(0);
            expect(Unit.isOne(particle.M.uom)).toBe(true);

            expect(particle.Q.a).toBe(1);
            expect(particle.Q.x).toBe(0);
            expect(Unit.isOne(particle.Q.uom)).toBe(true);
        });
    });
});
