import { Unit } from "@geometryzen/multivectors";
import { Block1 } from "./Block1";
import { MetricG10 } from "./MetricG10";

describe("Block1", function () {
    describe("constructor", function () {
        it("dimensionless", function () {
            const metric = new MetricG10();
            const width = metric.scalar(1);
            const block = new Block1(width);
            expect(block).toBeDefined();
            expect(Unit.isOne(metric.uom(block.M))).toBe(true);
        });
        it("METER", function () {
            const metric = new MetricG10();
            const width = metric.scalar(1, Unit.METER);
            expect(width.a).toBe(1);
            expect(width.uom).toBe(Unit.METER);
            const block = new Block1(width);
            expect(block).toBeDefined();
            expect((metric.uom(block.M))).toBe(Unit.KILOGRAM);
        });
    });
    describe("width", function () {
        it("get", function () {
            const metric = new MetricG10();
            const block = new Block1(metric.scalar(1, Unit.METER));
            const width = block.width;
            expect(width.a).toBe(1);
            expect(width.uom).toBe(Unit.METER);
        });
        it("set", function () {
            const metric = new MetricG10();
            const block = new Block1(metric.scalar(1, Unit.METER));
            block.width = metric.scalar(2, Unit.ONE);
            const width = block.width;
            expect(width.a).toBe(2);
            expect(width.uom).toBe(Unit.ONE);
        });
    });
    describe("updateAngularVelocity", function () {
        it("get", function () {
            const metric = new MetricG10();
            const block = new Block1(metric.scalar(1, Unit.METER));
            // We are in one dimensional space so there are no bivectors.
            expect(block.Iinv.dimensions).toBe(0);
            expect(block.Iinv.uom).toBe(Unit.div(Unit.ONE, Unit.KILOGRAM_METER_SQUARED));
            // The inertia tensor matrix has zero dimensions.
            expect(block.I.dimensions).toBe(0);
            // The inertia tensor still has the correct units.
            expect(block.I.uom).toBe(Unit.KILOGRAM_METER_SQUARED);
            // The algular momentum must be zero because there are no bivectors.
            expect(block.L.a).toBe(0);
            expect(block.L.x).toBe(0);
            // The angular momentum still has the correct units.
            expect(block.L.uom).toBe(Unit.JOULE_SECOND);
            block.updateAngularVelocity();
            // The angular velocity will be zero but still with correct units.
            expect(block.Ω.a).toBe(0);
            expect(block.Ω.x).toBe(0);
            expect(block.Ω.uom).toBe(Unit.INV_SECOND);
        });
    });
});
