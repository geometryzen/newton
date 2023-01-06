import { Geometric2 } from "@geometryzen/multivectors";
import { Block2 } from "./Block2";

describe("Block2", function () {
    it("TODO", function () {
        const block = new Block2(Geometric2.scalar(1), Geometric2.scalar(1));
        expect(block.M.a).toBe(1);
        expect(block.width.a).toBe(1);
        expect(block.height.a).toBe(1);
        expect(block.centerOfMassLocal.x).toBe(0);
        expect(block.centerOfMassLocal.y).toBe(0);
        block.L = Geometric2.bivector(1);
        block.updateAngularVelocity();
        expect(block.Ω.b).toBe(6);
        block.width = Geometric2.scalar(2);
        block.updateAngularVelocity();
        expect(block.Ω.b).toBe(2.4);
    });
});
