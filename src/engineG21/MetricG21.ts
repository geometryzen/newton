/* eslint-disable @typescript-eslint/no-unused-vars */
import { Spacetime2 } from "@geometryzen/multivectors";
import { Force, Torque, Unit } from "..";
import { ForceBody } from "../core/ForceBody";
import { Metric } from "../core/Metric";
import { MatrixLike } from "../math/MatrixLike";
import { ForceG21 } from "./ForceG21";
import { TorqueG21 } from "./TorqueG21";

/**
 * @hidden
 */
export class MetricG21 implements Metric<Spacetime2> {
    get e0(): Spacetime2 {
        return Spacetime2.e0;
    }
    a(mv: Spacetime2): number {
        return mv.a;
    }
    add(lhs: Spacetime2, rhs: Spacetime2): Spacetime2 {
        return lhs.add(rhs);
    }
    addScalar(lhs: Spacetime2, a: number, uom?: Unit): Spacetime2 {
        return lhs.addScalar(a, uom);
    }
    addVector(lhs: Spacetime2, rhs: Spacetime2): Spacetime2 {
        // lhs.addVector(rhs);
        throw new Error("Method not implemented.");
    }
    applyMatrix(mv: Spacetime2, matrix: MatrixLike): Spacetime2 {
        // mv.applyMatrix(matrix);
        throw new Error("Method not implemented.");
    }
    clone(source: Spacetime2): Spacetime2 {
        return source.clone();
    }
    copy(source: Spacetime2, target: Spacetime2): Spacetime2 {
        // target.copy(source);
        throw new Error("Method not implemented.");
    }
    copyBivector(source: Spacetime2, target: Spacetime2): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    copyMatrix(m: MatrixLike): MatrixLike {
        throw new Error("Method not implemented.");
    }
    copyScalar(a: number, uom: Unit, target: Spacetime2): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    copyVector(source: Spacetime2, target: Spacetime2): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    createForce(body: ForceBody<Spacetime2>): Force<Spacetime2> {
        return new ForceG21(body);
    }
    createTorque(body: ForceBody<Spacetime2>): Torque<Spacetime2> {
        return new TorqueG21(body);
    }
    direction(mv: Spacetime2): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    divByScalar(lhs: Spacetime2, a: number, uom?: Unit): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    ext(lhs: Spacetime2, rhs: Spacetime2): Spacetime2 {
        return lhs.ext(rhs);
    }
    identityMatrix(): MatrixLike {
        throw new Error("Method not implemented.");
    }
    invertMatrix(matrix: MatrixLike): MatrixLike {
        throw new Error("Method not implemented.");
    }
    isBivector(mv: Spacetime2): boolean {
        return mv.isBivector();
    }
    isOne(mv: Spacetime2): boolean {
        return mv.isOne();
    }
    isScalar(mv: Spacetime2): boolean {
        return mv.isScalar();
    }
    isSpinor(mv: Spacetime2): boolean {
        return mv.isSpinor();
    }
    isVector(mv: Spacetime2): boolean {
        return mv.isVector();
    }
    isZero(mv: Spacetime2): boolean {
        return mv.isZero();
    }
    lco(lhs: Spacetime2, rhs: Spacetime2): Spacetime2 {
        return lhs.lco(rhs);
    }
    lock(mv: Spacetime2): number {
        return mv.lock();
    }
    norm(mv: Spacetime2): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    mul(lhs: Spacetime2, rhs: Spacetime2): Spacetime2 {
        return lhs.mul(rhs);
    }
    mulByNumber(lhs: Spacetime2, alpha: number): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    mulByScalar(lhs: Spacetime2, a: number, uom: Unit): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    mulByVector(lhs: Spacetime2, rhs: Spacetime2): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    neg(mv: Spacetime2): Spacetime2 {
        return mv.neg();
    }
    squaredNorm(mv: Spacetime2): Spacetime2 {
        return mv.squaredNorm();
    }
    rco(lhs: Spacetime2, rhs: Spacetime2): Spacetime2 {
        return lhs.rco(rhs);
    }
    rev(mv: Spacetime2): Spacetime2 {
        return mv.rev();
    }
    rotate(mv: Spacetime2, spinor: Spacetime2): Spacetime2 {
        return mv.rotate(spinor);
    }
    scalar(a: number, uom?: Unit): Spacetime2 {
        return Spacetime2.scalar(a, uom);
    }
    scp(lhs: Spacetime2, rhs: Spacetime2): Spacetime2 {
        return lhs.scp(rhs);
    }
    setUom(mv: Spacetime2, uom: Unit): void {
        mv.uom = uom;
    }
    sub(lhs: Spacetime2, rhs: Spacetime2): Spacetime2 {
        return lhs.sub(rhs);
    }
    subScalar(lhs: Spacetime2, a: number, uom?: Unit): Spacetime2 {
        return lhs.subScalar(a, uom);
    }
    subVector(lhs: Spacetime2, rhs: Spacetime2): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    unlock(mv: Spacetime2, token: number): void {
        mv.unlock(token);
    }
    uom(mv: Spacetime2): Unit {
        return mv.uom;
    }
    write(source: Spacetime2, target: Spacetime2): void {
        throw new Error("Method not implemented.");
    }
    writeVector(source: Spacetime2, target: Spacetime2): void {
        throw new Error("Method not implemented.");
    }
    writeBivector(source: Spacetime2, target: Spacetime2): void {
        throw new Error("Method not implemented.");
    }
}
