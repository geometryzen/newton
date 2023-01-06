import { Geometric2, Unit } from "@geometryzen/multivectors";
import { Polygon2 } from "./Polygon2";

/**
 * @hidden
 */
const zero = Geometric2.zero;
/**
 * @hidden
 */
const e1 = Geometric2.e1;
/**
 * @hidden
 */
const e2 = Geometric2.e2;
/**
 * @hidden
 */
const kilogram = Geometric2.kilogram;
/**
 * @hidden
 */
const meter = Geometric2.meter;

/**
 * @hidden
 */
const unitSquare: Geometric2[] = [zero, e1, e1.add(e2), e2];

describe("Polygon2", function () {
    describe("constructor", function () {
        it("constructor", function () {
            const body = new Polygon2(unitSquare);
            expect(body).toBeDefined();
        });
        it("Less than 3 points should throw an Error.", function () {
            expect(function () {
                const body = new Polygon2([]);
                body.updateInertiaTensor();
            }).toThrowError("must be at least 3 points.");
        });
    });
    describe("Inertia Tensor", function () {
        it("should have the expected value.", function () {
            const body = new Polygon2(unitSquare);
            expect(body.I).toBeDefined();
            expect(body.I.dimensions).toBe(1);
            // I = (1/12) * M * (h * h + w * w)
            expect(body.I.getElement(0, 0)).toBeCloseTo(1 / 6, 8);
        });
        it("should depend on mass.", function () {
            const body = new Polygon2(unitSquare);
            body.M = body.M.mulByNumber(2);
            expect(body.I).toBeDefined();
            expect(body.I.dimensions).toBe(1);
            // I = (1/12) * M * (h * h + w * w)
            expect(body.I.getElement(0, 0)).toBeCloseTo(2 / 6, 7);
        });
        it("should depend on width.", function () {
            const body = new Polygon2([zero, e1.mulByNumber(2), e1.mulByNumber(2).add(e2), e2]);
            expect(body.I).toBeDefined();
            expect(body.I.dimensions).toBe(1);
            // I = (1/12) * M * (h * h + w * w)
            expect(body.I.getElement(0, 0)).toBeCloseTo(5 / 12, 7);
        });
        it("should depend on height.", function () {
            const body = new Polygon2([zero, e1, e1.add(e2.mulByNumber(2)), e2.mulByNumber(2)]);
            expect(body.I).toBeDefined();
            expect(body.I.dimensions).toBe(1);
            // I = (1/12) * M * (h * h + w * w)
            expect(body.I.getElement(0, 0)).toBeCloseTo(5 / 12, 7);
        });
        it("should have correct units.", function () {
            const point0 = zero.mul(meter);
            const point1 = e1.mul(meter);
            const point2 = e1.add(e2.mulByNumber(2)).mul(meter);
            const point3 = e2.mulByNumber(2).mul(meter);
            const points = [point0, point1, point2, point3];
            expect(points.every(function (point) {
                return Unit.isOne(point.uom);
            })).toBe(false);
            expect(points.some(function (point) {
                return Unit.isOne(point.uom);
            })).toBe(false);
            const body = new Polygon2(points);
            // Polygon2 should auto-detect that we are using units of measure.
            expect(body.M.uom).toBe(Unit.KILOGRAM);
            expect(body.X.uom).toBe(Unit.METER);
            expect(body.R.uom).toBe(Unit.ONE);
            expect(body.P.uom).toBe(Unit.KILOGRAM_METER_PER_SECOND);
            expect(body.L.uom).toBe(Unit.JOULE_SECOND);
            body.M = kilogram;
            expect(body.I).toBeDefined();
            expect(body.I.dimensions).toBe(1);
            // I = (1/12) * M * (h * h + w * w)
            expect(body.I.getElement(0, 0)).toBeCloseTo(5 / 12, 7);
            expect(body.Iinv.uom).toBe(Unit.div(Unit.ONE, Unit.KILOGRAM_METER_SQUARED));
            // expect(body.I.uom).toBe(Unit.KILOGRAM_METER_SQUARED);
            // expect(`${body.I.uom}`).toBe(`${Unit.KILOGRAM_METER_SQUARED}`);
            // expect(body.I.uom.dimensions.equals(Dimensions.MOMENT_OF_INERTIA)).toBe(true);
        });
    });
    it("Angular Momentum, L, should be initialized to 0", function () {
        const body = new Polygon2(unitSquare);
        expect(body.L).toBeDefined();
        expect(body.L.isZero()).toBe(true);
        expect(body.L.uom).toBeUndefined();
    });
    it("Mass, M, should be initialized to 1", function () {
        const body = new Polygon2(unitSquare);
        expect(body.M).toBeDefined();
        expect(body.M.isOne()).toBe(true);
        expect(body.L.uom).toBeUndefined();
    });
    it("Linear Momentum, P, should be initialized to 0", function () {
        const body = new Polygon2(unitSquare);
        expect(body.P).toBeDefined();
        expect(body.P.isZero()).toBe(true);
        expect(body.P.uom).toBeUndefined();
    });
    it("Electric Charge, Q should be initialized to 0", function () {
        const body = new Polygon2(unitSquare);
        expect(body.Q).toBeDefined();
        expect(body.Q.isZero()).toBe(true);
        expect(Unit.isOne(body.Q.uom)).toBe(true);
    });
    it("Attitude, R should be initialized to 1", function () {
        const body = new Polygon2(unitSquare);
        expect(body.R).toBeDefined();
        expect(body.R.isOne()).toBe(true);
        expect(body.R.uom).toBeUndefined();
    });
    it("updateInertiaTensor", function () {
        const body = new Polygon2(unitSquare);
        body.updateInertiaTensor();
        expect(body).toBeDefined();
    });
});
