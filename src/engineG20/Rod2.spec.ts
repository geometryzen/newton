import { Geometric2 } from "@geometryzen/multivectors";
import { Rod2 } from "./Rod2";

describe("Rod2", function () {
    describe("constructor", function () {
        it("should work", function () {
            const a = Geometric2.vector(1, 0);
            const rod = new Rod2(a);
            expect(rod).toBeDefined();
            expect(rod.a.a).toBe(0);
            expect(rod.a.x).toBe(1);
            expect(rod.a.y).toBe(0);
            expect(rod.a.b).toBe(0);
        });
        it("should throw Error for undefined a", function () {
            expect(function () {
                new Rod2(void 0).rotationalEnergy();
            }).toThrowError("a must be a non-null `object` in Rod2.constructor(a: Geometric2): Rod2.");
        });
    });
});
