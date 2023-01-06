import { Geometric2 } from "@geometryzen/multivectors";
import { Force2 } from "./Force2";
import { Particle2 } from "./Particle2";

describe("Force2", function () {
    describe("constructor", function () {
        it("should work.", function () {
            const bead = new Particle2(Geometric2.scalar(1), Geometric2.scalar(1));
            const force = new Force2(bead);
            expect(force).toBeDefined();
        });
        it("locationCoordType should be LOCAL (the force acts on a point in the body).", function () {
            const bead = new Particle2(Geometric2.scalar(1), Geometric2.scalar(1));
            const force = new Force2(bead);
            expect(force).toBeDefined();
            expect(force.locationCoordType === 0).toBe(true);
        });
        it("vectorCoordType should be WORLD (the force is usually external).", function () {
            const bead = new Particle2(Geometric2.scalar(1), Geometric2.scalar(1));
            const force = new Force2(bead);
            expect(force).toBeDefined();
            expect(force.vectorCoordType === 1).toBe(true);
        });
    });
});
