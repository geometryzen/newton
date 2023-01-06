import { Geometric1, Unit } from '@geometryzen/multivectors';
import { Force } from '../core/Force';
import { ForceBody } from '../core/ForceBody';
import { Metric } from '../core/Metric';
import { Torque } from '../core/Torque';
import { Matrix0 } from '../math/Matrix0';
import { MatrixLike } from '../math/MatrixLike';
import { Force1 } from './Force1';
import { Torque1 } from './Torque1';

/**
 * @hidden 
 */
function copy(mv: Geometric1): Geometric1 {
    return new Geometric1([mv.a, mv.x], mv.uom);
}

/**
 * @hidden 
 */
function lock(mv: Geometric1): Geometric1 {
    mv.lock();
    return mv;
}

/**
 * @hidden
 */
export class MetricG10 implements Metric<Geometric1> {
    get e0(): Geometric1 {
        return void 0;
    }
    a(mv: Geometric1): number {
        return mv.a;
    }
    add(lhs: Geometric1, rhs: Geometric1): Geometric1 {
        if (lhs.isMutable()) {
            lhs.a = lhs.a + rhs.a;
            lhs.x = lhs.x + rhs.x;
            lhs.uom = Unit.compatible(lhs.uom, rhs.uom);
            return lhs;
        }
        else {
            const a = lhs.a + rhs.a;
            const x = lhs.x + rhs.x;
            const uom = Unit.compatible(lhs.uom, rhs.uom);
            return new Geometric1([a, x], uom);
        }
    }
    addScalar(lhs: Geometric1, a: number, uom?: Unit): Geometric1 {
        return lhs.addScalar(a, uom);
    }
    addVector(lhs: Geometric1, rhs: Geometric1): Geometric1 {
        if (lhs.isMutable()) {
            lhs.x = lhs.x + rhs.x;
            lhs.uom = Unit.compatible(lhs.uom, rhs.uom);
            return lhs;
        }
        else {
            const a = lhs.a;
            const x = lhs.x + rhs.x;
            const uom = Unit.compatible(lhs.uom, rhs.uom);
            return new Geometric1([a, x], uom);
        }
    }
    applyMatrix(mv: Geometric1, matrix: MatrixLike): Geometric1 {
        if (mv.isMutable()) {
            if (mv.isZero()) {
                if (Unit.isOne(matrix.uom)) {
                    return mv;
                }
                else {
                    mv.uom = Unit.mul(matrix.uom, mv.uom);
                    return mv;
                }
            }
            else {
                throw new Error(`applyMatrix(mv=Geometric1([${mv.a}, ${mv.x}], mv.uom), matrix=dimensions=${matrix.dimensions} Method not implemented.`);
            }
        }
        else {
            throw new Error("mv must be defined in Metric.applyMatrix(mv, matrix)");
        }
    }
    clone(source: Geometric1): Geometric1 {
        return source.clone();
    }
    copy(source: Geometric1, target: Geometric1): Geometric1 {
        target.a = source.a;
        target.x = source.x;
        target.uom = source.uom;
        return target;
    }
    copyBivector(source: Geometric1, target: Geometric1): Geometric1 {
        target.a = 0;
        target.x = 0;
        target.uom = source.uom;
        return target;
    }
    copyMatrix(m: MatrixLike): MatrixLike {
        if (m.dimensions !== 0) {
            throw new Error("matrix dimensions must be 0.");
        }
        return new Matrix0(new Float32Array([]), m.uom);
    }
    copyScalar(a: number, uom: Unit, target: Geometric1): Geometric1 {
        target.a = a;
        target.x = 0;
        target.uom = uom;
        return target;
    }
    copyVector(source: Geometric1, target: Geometric1): Geometric1 {
        target.a = 0;
        target.x = source.x;
        target.uom = source.uom;
        return target;
    }
    createForce(body: ForceBody<Geometric1>): Force<Geometric1> {
        return new Force1(body);
    }
    createTorque(body: ForceBody<Geometric1>): Torque<Geometric1> {
        return new Torque1(body);
    }
    direction(mv: Geometric1): Geometric1 {
        if (mv.isMutable()) {
            const a = mv.a;
            const x = mv.x;
            const s = mv.magnitudeNoUnits();
            mv.a = a / s;
            mv.x = x / s;
            mv.uom = Unit.ONE;
            return mv;
        }
        else {
            return this.direction(copy(mv));
        }
    }
    divByScalar(lhs: Geometric1, a: number, uom?: Unit): Geometric1 {
        if (lhs.isMutable()) {
            lhs.a = lhs.a / a;
            lhs.x = lhs.x / a;
            lhs.uom = Unit.div(lhs.uom, uom);
            return lhs;
        }
        else {
            return lock(this.divByScalar(copy(lhs), a, uom));
        }
    }
    ext(lhs: Geometric1, rhs: Geometric1): Geometric1 {
        if (lhs.isMutable()) {
            const La = lhs.a;
            const Lx = lhs.x;
            const Ra = rhs.a;
            const Rx = rhs.x;
            lhs.a = La * Ra;
            lhs.x = La * Rx + Lx * Ra;
            lhs.uom = Unit.mul(lhs.uom, rhs.uom);
            return lhs;
        }
        else {
            return lock(this.ext(copy(lhs), rhs));
        }
    }
    identityMatrix(): MatrixLike {
        return new Matrix0(new Float32Array([]));
    }
    invertMatrix(m: MatrixLike): MatrixLike {
        return new Matrix0(new Float32Array([]), Unit.div(Unit.ONE, m.uom));
    }
    isBivector(mv: Geometric1): boolean {
        return mv.isBivector();
    }
    isOne(mv: Geometric1): boolean {
        return mv.isOne();
    }
    isScalar(mv: Geometric1): boolean {
        return mv.isScalar();
    }
    isSpinor(mv: Geometric1): boolean {
        return mv.isSpinor();
    }
    isVector(mv: Geometric1): boolean {
        return mv.isVector();
    }
    isZero(mv: Geometric1): boolean {
        return mv.isZero();
    }
    lco(lhs: Geometric1, rhs: Geometric1): Geometric1 {
        return lhs.lco(rhs);
    }
    lock(mv: Geometric1): number {
        return mv.lock();
    }
    norm(mv: Geometric1): Geometric1 {
        return mv.magnitude();
    }
    mul(lhs: Geometric1, rhs: Geometric1): Geometric1 {
        if (lhs.isMutable()) {
            const La = lhs.a;
            const Lx = lhs.x;
            const Ra = rhs.a;
            const Rx = rhs.x;
            const a = La * Ra + Lx * Rx;    // scp only does this, ext gives La * Ra.
            const x = La * Rx + Lx * Ra;    // ext does this.
            lhs.a = a;
            lhs.x = x;
            lhs.uom = Unit.mul(lhs.uom, rhs.uom);
            return lhs;
        }
        else {
            return lock(this.mul(copy(lhs), rhs));
        }
    }
    mulByNumber(lhs: Geometric1, alpha: number): Geometric1 {
        if (lhs.isMutable()) {
            const La = lhs.a;
            const Lx = lhs.x;
            const a = La * alpha;
            const x = Lx * alpha;
            lhs.a = a;
            lhs.x = x;
            return lhs;
        }
        else {
            return lock(this.mulByNumber(copy(lhs), alpha));
        }
    }
    mulByScalar(lhs: Geometric1, a: number, uom?: Unit): Geometric1 {
        if (lhs.isMutable()) {
            lhs.a = lhs.a * a;
            lhs.x = lhs.x * a;
            lhs.uom = Unit.mul(lhs.uom, uom);
            return lhs;
        }
        else {
            return lock(this.mulByScalar(copy(lhs), a, uom));
        }
    }
    mulByVector(lhs: Geometric1, rhs: Geometric1): Geometric1 {
        if (lhs.isMutable()) {
            const a = lhs.x * rhs.x;
            const x = lhs.a * rhs.x;
            lhs.a = a;
            lhs.x = x;
            lhs.uom = Unit.mul(lhs.uom, rhs.uom);
            return lhs;
        }
        else {
            return lock(this.mulByVector(copy(lhs), rhs));
        }
    }
    neg(mv: Geometric1): Geometric1 {
        if (mv.isMutable()) {
            mv.a = -mv.a;
            mv.x = -mv.x;
            return mv;
        }
        else {
            throw new Error('Method not implemented.');
        }
    }
    squaredNorm(mv: Geometric1): Geometric1 {
        return mv.squaredNorm();
    }
    rco(lhs: Geometric1, rhs: Geometric1): Geometric1 {
        return lhs.rco(rhs);
    }
    rev(mv: Geometric1): Geometric1 {
        if (mv.isMutable()) {
            return mv;
        }
        else {
            return lock(this.rev(copy(mv)));
        }
    }
    rotate(mv: Geometric1, spinor: Geometric1): Geometric1 {
        if (mv.isMutable()) {
            // TODO: Assert that the spinor is 1.
            return mv;
        }
        else {
            return lock(this.rotate(copy(mv), spinor));
        }
    }
    scalar(a: number, uom?: Unit): Geometric1 {
        return new Geometric1([a, 0], uom);
    }
    scp(lhs: Geometric1, rhs: Geometric1): Geometric1 {
        if (lhs.isMutable()) {
            const La = lhs.a;
            const Lx = lhs.x;
            const Ra = rhs.a;
            const Rx = rhs.x;
            lhs.a = La * Ra + Lx * Rx;
            lhs.x = 0;
            lhs.uom = Unit.mul(lhs.uom, rhs.uom);
            return lhs;
        }
        else {
            return lock(this.scp(copy(lhs), rhs));
        }
    }
    setUom(mv: Geometric1, uom: Unit): void {
        mv.uom = uom;
    }
    sub(lhs: Geometric1, rhs: Geometric1): Geometric1 {
        if (lhs.isMutable()) {
            lhs.a = lhs.a - rhs.a;
            lhs.x = lhs.x - rhs.x;
            lhs.uom = Unit.compatible(lhs.uom, rhs.uom);
            return lhs;
        }
        else {
            return lock(this.sub(copy(lhs), rhs));
        }
    }
    subScalar(lhs: Geometric1, a: number, uom?: Unit): Geometric1 {
        if (lhs.isMutable()) {
            lhs.a = lhs.a - a;
            lhs.uom = Unit.compatible(lhs.uom, uom);
            return lhs;
        }
        else {
            return lock(this.subScalar(copy(lhs), a, uom));
        }
    }
    subVector(lhs: Geometric1, rhs: Geometric1): Geometric1 {
        if (lhs.isMutable()) {
            lhs.x = lhs.x - rhs.x;
            lhs.uom = Unit.compatible(lhs.uom, rhs.uom);
            return lhs;
        }
        else {
            return lock(this.subVector(copy(lhs), rhs));
        }
    }
    unlock(mv: Geometric1, token: number): void {
        mv.unlock(token);
    }
    uom(mv: Geometric1): Unit {
        return mv.uom;
    }
    write(source: Geometric1, target: Geometric1): void {
        target.a = source.a;
        target.x = source.x;
        target.uom = source.uom;
    }
    writeVector(source: Geometric1, target: Geometric1): void {
        target.a = 0;
        target.x = source.x;
        target.uom = source.uom;
    }
    /**
     * This doesn't happen in 1D because there are no bivectors.
     */
    writeBivector(source: Geometric1, target: Geometric1): void {
        target.a = 0;
        target.x = 0;
        target.uom = source.uom;
    }
}
