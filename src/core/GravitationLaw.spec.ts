import { Geometric3, Unit } from '@geometryzen/multivectors';
import { Sphere3 } from '../engineG30/Sphere3';
import { GravitationLaw } from './GravitationLaw';

/**
 * @hidden
 */
const kg = Unit.KILOGRAM;
/**
 * @hidden
 */
const m = Unit.METER;
/**
 * @hidden
 */
const s = Unit.SECOND;
/**
 * @hidden
 */
const MOTION = kg.mul(m).div(s);
/**
 * @hidden
 */
const N = MOTION.div(s);
/**
 * @hidden
 */
const G = Geometric3.scalar(6.7E-11, N.mul(m).mul(m).div(kg).div(kg));

describe("GravitationLaw", function () {
    const body1 = new Sphere3();
    const body2 = new Sphere3();

    body1.M = Geometric3.scalar(3, kg);
    body2.M = Geometric3.scalar(5, kg);

    body1.X = Geometric3.vector(-1, 0, 0, m);
    body2.X = Geometric3.vector(+1, 0, 0, m);

    const gravitationLaw = new GravitationLaw(body1, body2);
    gravitationLaw.G = G;
    const m1 = body1.M.a;
    const m2 = body2.M.a;
    const r = Math.abs(body1.X.x - body2.X.x);
    it("potentialEnergy", function () {
        const pe = gravitationLaw.potentialEnergy();
        expect(pe.a).toBe(-G.a * m1 * m2 / r);
        expect(pe.uom.multiplier).toBe(1);
        expect(pe.uom.multiplier).toBe(1);
        expect(pe.uom.dimensions.M.numer).toBe(1);
        expect(pe.uom.dimensions.L.numer).toBe(2);
        expect(pe.uom.dimensions.T.numer).toBe(-2);
        expect(pe.uom.dimensions.Q.numer).toBe(0);
    });
    it("updateForces", function () {
        const forces = gravitationLaw.updateForces();
        const force1 = forces[0];
        const force2 = forces[1];
        expect(force1.F.x).toBe(+G.a * m1 * m2 / (r * r));
        expect(force1.F.y).toBe(0);
        expect(force1.F.z).toBe(0);
        expect(force1.F.uom.multiplier).toBe(1);
        expect(force1.F.uom.dimensions.M.numer).toBe(1);
        expect(force1.F.uom.dimensions.L.numer).toBe(1);
        expect(force1.F.uom.dimensions.T.numer).toBe(-2);
        expect(force1.F.uom.dimensions.Q.numer).toBe(0);

        expect(force2.F.x).toBe(-G.a * m1 * m2 / (r * r));
        expect(force2.F.y).toBe(0);
        expect(force2.F.z).toBe(0);
        expect(force2.F.uom.multiplier).toBe(1);
        expect(force2.F.uom.dimensions.M.numer).toBe(1);
        expect(force2.F.uom.dimensions.L.numer).toBe(1);
        expect(force2.F.uom.dimensions.T.numer).toBe(-2);
        expect(force2.F.uom.dimensions.Q.numer).toBe(0);
    });
});
