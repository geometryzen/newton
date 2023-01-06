import { Geometric1, Unit } from "@geometryzen/multivectors";
import { Block1 } from "./Block1";
import { Torque1 } from "./Torque1";

describe("Torque1", function () {
    it("constructor", function () {
        const width = new Geometric1([1, 0], Unit.METER);
        const body = new Block1(width);
        const torque = new Torque1(body);
        expect(torque).toBeDefined();
    });
    it("computeTorque", function () {
        const width = new Geometric1([1, 0], Unit.METER);
        const body = new Block1(width);
        const torque = new Torque1(body);
        // torque.bivector = new Geometric1([1, 0], Unit.METER);
        const B = torque.bivector;
        expect(B.a).toBe(0);
        expect(B.x).toBe(0);
        expect(Unit.isOne(B.uom)).toBe(true);
        const T = new Geometric1();
        torque.computeTorque(T);
        expect(T.a).toBe(0);
        expect(T.x).toBe(0);
        expect(Unit.isOne(T.uom)).toBe(true);
    });
});
