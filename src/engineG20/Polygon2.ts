import { Geometric2, Unit } from "@geometryzen/multivectors";
import { Matrix1 } from "../math/Matrix1";
import { RigidBody2 } from "./RigidBody2";

/**
 * @hidden
 */
const fromVector = Geometric2.fromVector;

export class Polygon2 extends RigidBody2 {
    /**
     * The position of the polygon point relative to the center of mass.
     * 
     * r = x - X, where x is the world position, X is the center of mass.
     */
    public readonly rs: Geometric2[] = [];
    constructor(points: Geometric2[]) {
        super();

        mustBeAtLeastThreePoints(points);

        const X = centerOfMass(points);
        for (const point of points) {
            const r = fromVector(point).sub(X);
            r.lock();
            this.rs.push(r);
        }
        this.X = X;

        if (points.every(function (point) {
            return Unit.isOne(point.uom);
        })) {
            // dimensionless
            this.updateInertiaTensor();
        }
        else {
            // Changing the mass will trigger an update of the inertia tensor.
            this.M = Geometric2.scalar(this.M.a, Unit.KILOGRAM);
            this.Iinv.uom = Unit.div(Unit.ONE, Unit.KILOGRAM_METER_SQUARED);
            this.X.uom = Unit.METER;
            this.R.uom = Unit.ONE;
            this.P.uom = Unit.KILOGRAM_METER_PER_SECOND;
            this.L.uom = Unit.JOULE_SECOND;
        }
    }

    /**
     * The inertia tensor matrix must be updated any time the geometry changes.
     * The geometry is defined by the total mass, M, and the positions of the vertices. 
     */
    updateInertiaTensor(): void {
        const rs = this.rs;
        const N = rs.length;
        const numer = new Geometric2();
        const denom = new Geometric2();
        for (let i = 0; i < N; i++) {
            const ith = rs[i];
            const nxt = rs[(i + 1) % N];
            const A = nxt.ext(ith);
            const s = ith.scp(ith).add(ith.scp(nxt)).add(nxt.scp(nxt));
            numer.add(A.mul(s));
            denom.add(A);
        }
        const I = this.M.mul(numer).divByNumber(6).divByPseudo(denom.b, denom.uom);
        const matrixInv = Matrix1.one();
        matrixInv.setElement(0, 0, 1 / I.a);
        matrixInv.uom = Unit.div(Unit.ONE, I.uom);
        this.Iinv = matrixInv;
    }
}

/**
 * @hidden
 * @param xs 
 * @returns 
 */
function polygonArea(xs: Geometric2[]) {
    const N = xs.length;
    const A = new Geometric2();
    const ΔA = new Geometric2();
    for (let i = 0; i < N; i++) {
        ΔA.copy(xs[i]).ext(xs[(i + 1) % N]).mulByNumber(0.5);
        A.add(ΔA);
    }
    return A;
}

/**
 * @hidden
 * @param xs 
 * @returns 
 */
function centerOfMass(xs: Geometric2[]) {
    const N = xs.length;
    const X = new Geometric2();
    for (let i = 0; i < N; i++) {
        const a = xs[i];
        const b = xs[(i + 1) % N];
        const w = fromVector(a).ext(b);
        const v = fromVector(a).add(b);
        const vw = fromVector(v).mul(w);
        X.add(vw);
    }
    const A = polygonArea(xs);
    X.divByPseudo(A.b, A.uom);
    X.divByNumber(6);
    return X;
}

/**
 * @hidden
 * @param xs 
 */
function mustBeAtLeastThreePoints(xs: Geometric2[]): void {
    const N = xs.length;
    if (N >= 3) {
        // Test for non-collinear?
    }
    else {
        throw new Error("must be at least 3 points.");
    }
}
