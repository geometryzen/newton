/* eslint-disable @typescript-eslint/no-unused-vars */
import { Spacetime1 } from "@geometryzen/multivectors";
import { Force, Torque, Unit } from "..";
import { ForceBody } from "../core/ForceBody";
import { Metric } from "../core/Metric";
import { Matrix0 } from "../math/Matrix0";
import { MatrixLike } from "../math/MatrixLike";
import { ForceG11 } from "./ForceG11";

export class MetricG11 implements Metric<Spacetime1> {
    get e0(): Spacetime1 {
        return Spacetime1.e0;
    }
    a(mv: Spacetime1): number {
        return mv.a;
    }
    add(lhs: Spacetime1, rhs: Spacetime1): Spacetime1 {
        throw new Error("Method not implemented.");
    }
    addScalar(lhs: Spacetime1, a: number, uom?: Unit): Spacetime1 {
        return lhs.addScalar(a, uom);
    }
    addVector(lhs: Spacetime1, rhs: Spacetime1): Spacetime1 {
        return lhs.addVector(rhs);
    }
    applyMatrix(mv: Spacetime1, matrix: MatrixLike): Spacetime1 {
        throw new Error("Method not implemented.");
    }
    clone(source: Spacetime1): Spacetime1 {
        throw new Error("Method not implemented.");
    }
    copy(source: Spacetime1, target: Spacetime1): Spacetime1 {
        target.a = source.a;
        target.t = source.t;
        target.x = source.x;
        target.b = source.b;
        target.uom = source.uom;
        return target;
    }
    copyBivector(source: Spacetime1, target: Spacetime1): Spacetime1 {
        throw new Error("Method not implemented.");
    }
    copyMatrix(m: MatrixLike): MatrixLike {
        throw new Error("Method not implemented.");
    }
    copyScalar(a: number, uom: Unit, target: Spacetime1): Spacetime1 {
        throw new Error("Method not implemented.");
    }
    copyVector(source: Spacetime1, target: Spacetime1): Spacetime1 {
        target.a = source.a;
        target.t = source.t;
        target.x = source.x;
        target.b = source.b;
        target.uom = source.uom;
        return target;
    }
    createForce(body: ForceBody<Spacetime1>): Force<Spacetime1> {
        return new ForceG11(body);
    }
    createTorque(body: ForceBody<Spacetime1>): Torque<Spacetime1> {
        throw new Error("Method not implemented.");
    }
    direction(mv: Spacetime1): Spacetime1 {
        throw new Error("Method not implemented.");
    }
    divByScalar(lhs: Spacetime1, a: number, uom?: Unit): Spacetime1 {
        return lhs.divByScalar(a, uom);
    }
    ext(lhs: Spacetime1, rhs: Spacetime1): Spacetime1 {
        return lhs.ext(rhs);
    }
    identityMatrix(): MatrixLike {
        return new Matrix0(new Float32Array([]));
    }
    invertMatrix(matrix: MatrixLike): MatrixLike {
        throw new Error("Method not implemented.");
    }
    isBivector(mv: Spacetime1): boolean {
        return mv.isBivector();
    }
    isOne(mv: Spacetime1): boolean {
        return mv.isOne();
    }
    isScalar(mv: Spacetime1): boolean {
        return mv.isScalar();
    }
    isSpinor(mv: Spacetime1): boolean {
        return mv.isSpinor();
    }
    isVector(mv: Spacetime1): boolean {
        return mv.isVector();
    }
    isZero(mv: Spacetime1): boolean {
        return mv.isZero();
    }
    lco(lhs: Spacetime1, rhs: Spacetime1): Spacetime1 {
        return lhs.lco(rhs);
    }
    lock(mv: Spacetime1): number {
        return mv.lock();
    }
    norm(mv: Spacetime1): Spacetime1 {
        throw new Error("Method not implemented.");
    }
    mul(lhs: Spacetime1, rhs: Spacetime1): Spacetime1 {
        throw new Error("Method not implemented.");
    }
    mulByNumber(lhs: Spacetime1, alpha: number): Spacetime1 {
        throw new Error("Method not implemented.");
    }
    mulByScalar(lhs: Spacetime1, a: number, uom?: Unit): Spacetime1 {
        return lhs.mulByScalar(a, uom);
    }
    mulByVector(lhs: Spacetime1, rhs: Spacetime1): Spacetime1 {
        throw new Error("Method not implemented.");
    }
    neg(mv: Spacetime1): Spacetime1 {
        return mv.neg();
    }
    rco(lhs: Spacetime1, rhs: Spacetime1): Spacetime1 {
        return lhs.rco(rhs);
    }
    rev(mv: Spacetime1): Spacetime1 {
        throw new Error("Method not implemented.");
    }
    rotate(mv: Spacetime1, spinor: Spacetime1): Spacetime1 {
        throw new Error("Method not implemented.");
    }
    scalar(a: number, uom?: Unit): Spacetime1 {
        return Spacetime1.scalar(a, uom);
    }
    scp(lhs: Spacetime1, rhs: Spacetime1): Spacetime1 {
        throw new Error("Method not implemented.");
    }
    setUom(mv: Spacetime1, uom: Unit): void {
        mv.uom = uom;
    }
    squaredNorm(mv: Spacetime1): Spacetime1 {
        return mv.squaredNorm();
    }
    sub(lhs: Spacetime1, rhs: Spacetime1): Spacetime1 {
        throw new Error("Method not implemented.");
    }
    subScalar(lhs: Spacetime1, a: number, uom?: Unit): Spacetime1 {
        // return lhs.subScalar(rhs.a,rhs.uom);
        throw new Error("Method not implemented.");
    }
    subVector(lhs: Spacetime1, rhs: Spacetime1): Spacetime1 {
        return lhs.subVector(rhs);
    }
    unlock(mv: Spacetime1, token: number): void {
        mv.unlock(token);
    }
    uom(mv: Spacetime1): Unit {
        return mv.uom;
    }
    write(source: Spacetime1, target: Spacetime1): void {
        throw new Error("Method not implemented.");
    }
    writeVector(source: Spacetime1, target: Spacetime1): void {
        throw new Error("Method not implemented.");
    }
    writeBivector(source: Spacetime1, target: Spacetime1): void {
        throw new Error("Method not implemented.");
    }
}
