import { Force } from "../core/Force";
import { ForceBody } from "../core/ForceBody";
import { Metric } from "../core/Metric";
import { Torque } from "../core/Torque";
import { Geometric2 } from "@geometryzen/multivectors";
import { Mat1 } from "../math/Mat1";
import { Matrix1 } from "../math/Matrix1";
import { MatrixLike } from "../math/MatrixLike";
import { Unit } from "@geometryzen/multivectors";
import { Force2 } from "./Force2";
import { Torque2 } from "./Torque2";

/**
 * @hidden
 */
export class Euclidean2 implements Metric<Geometric2> {
    get e0(): Geometric2 {
        return void 0;
    }
    a(mv: Geometric2): number {
        return mv.a;
    }
    add(lhs: Geometric2, rhs: Geometric2): Geometric2 {
        return lhs.add(rhs);
    }
    addScalar(lhs: Geometric2, a: number, uom?: Unit): Geometric2 {
        return lhs.addScalar(a, uom);
    }
    addVector(lhs: Geometric2, rhs: Geometric2): Geometric2 {
        return lhs.addVector(rhs);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    applyMatrix(mv: Geometric2, matrix: MatrixLike): Geometric2 {
        throw new Error("applyMatrix(mv, matrix) method not implemented.");
    }
    clone(source: Geometric2): Geometric2 {
        return source.clone();
    }
    copy(source: Geometric2, target: Geometric2): Geometric2 {
        return target.copy(source);
    }
    copyBivector(source: Geometric2, target: Geometric2): Geometric2 {
        return target.copyBivector(source);
    }
    copyMatrix(m: MatrixLike): MatrixLike {
        if (m.dimensions !== 1) {
            throw new Error("matrix dimensions must be 1.");
        }
        const value = m.getElement(0, 0);
        return new Matrix1(new Float32Array([value]), m.uom);
    }
    copyVector(source: Geometric2, target: Geometric2): Geometric2 {
        return target.copyVector(source);
    }
    copyScalar(a: number, uom: Unit, target: Geometric2): Geometric2 {
        return target.copyScalar(a, uom);
    }
    createForce(body: ForceBody<Geometric2>): Force<Geometric2> {
        return new Force2(body);
    }
    createTorque(body: ForceBody<Geometric2>): Torque<Geometric2> {
        return new Torque2(body);
    }
    direction(mv: Geometric2): Geometric2 {
        return mv.direction();
    }
    divByScalar(lhs: Geometric2, a: number, uom?: Unit): Geometric2 {
        return lhs.divByScalar(a, uom);
    }
    identityMatrix(): MatrixLike {
        return new Mat1(1);
    }
    invertMatrix(m: MatrixLike): MatrixLike {
        if (m.dimensions !== 1) {
            throw new Error("matrix dimensions must be 1.");
        }
        return new Matrix1(new Float32Array([1 / m.getElement(0, 0)]), Unit.div(Unit.ONE, m.uom));
    }
    isBivector(mv: Geometric2): boolean {
        return mv.isBivector();
    }
    isOne(mv: Geometric2): boolean {
        return mv.isOne();
    }
    isScalar(mv: Geometric2): boolean {
        return mv.isScalar();
    }
    isSpinor(mv: Geometric2): boolean {
        return mv.isSpinor();
    }
    isVector(mv: Geometric2): boolean {
        return mv.isVector();
    }
    isZero(mv: Geometric2): boolean {
        return mv.isZero();
    }
    lco(lhs: Geometric2, rhs: Geometric2): Geometric2 {
        return lhs.lco(rhs);
    }
    lock(mv: Geometric2): number {
        return mv.lock();
    }
    norm(mv: Geometric2): Geometric2 {
        return mv.magnitude();
    }
    mul(lhs: Geometric2, rhs: Geometric2): Geometric2 {
        return lhs.mul(rhs);
    }
    mulByNumber(lhs: Geometric2, alpha: number): Geometric2 {
        return lhs.mulByNumber(alpha);
    }
    mulByScalar(lhs: Geometric2, a: number, uom: Unit): Geometric2 {
        return lhs.mulByScalar(a, uom);
    }
    mulByVector(lhs: Geometric2, rhs: Geometric2): Geometric2 {
        return lhs.mulByVector(rhs);
    }
    neg(mv: Geometric2): Geometric2 {
        return mv.neg();
    }
    squaredNorm(mv: Geometric2): Geometric2 {
        return mv.squaredNorm();
    }
    rco(lhs: Geometric2, rhs: Geometric2): Geometric2 {
        return lhs.rco(rhs);
    }
    rev(mv: Geometric2): Geometric2 {
        return mv.rev();
    }
    rotate(mv: Geometric2, spinor: Geometric2): Geometric2 {
        return mv.rotate(spinor);
    }
    scalar(a: number, uom?: Unit): Geometric2 {
        return Geometric2.scalar(a, uom);
    }
    scp(lhs: Geometric2, rhs: Geometric2): Geometric2 {
        return lhs.scp(rhs);
    }
    setUom(mv: Geometric2, uom: Unit): void {
        mv.uom = uom;
    }
    sub(lhs: Geometric2, rhs: Geometric2): Geometric2 {
        // TODO: Could generalize to subtracting a fraction...
        return lhs.sub(rhs, 1);
    }
    subScalar(lhs: Geometric2, a: number, uom?: Unit): Geometric2 {
        return lhs.subScalar(a, uom);
    }
    subVector(lhs: Geometric2, rhs: Geometric2): Geometric2 {
        // TODO: Could generalize to subtracting a fraction...
        return lhs.subVector(rhs);
    }
    unlock(mv: Geometric2, token: number): void {
        mv.unlock(token);
    }
    uom(mv: Geometric2): Unit {
        return mv.uom;
    }
    ext(lhs: Geometric2, rhs: Geometric2): Geometric2 {
        return lhs.ext(rhs);
    }
    write(source: Geometric2, target: Geometric2): void {
        source.write(target);
    }
    writeVector(source: Geometric2, target: Geometric2): void {
        source.writeVector(target);
    }
    writeBivector(source: Geometric2, target: Geometric2): void {
        source.writeBivector(target);
    }
}
