import { Geometric2, Unit } from "@geometryzen/multivectors";
import { mustBeNonNullObject } from "../checks/mustBeNonNullObject";
import { Matrix1 } from "../math/Matrix1";
import { RigidBody2 } from "./RigidBody2";

export class Rod2 extends RigidBody2 {
    readonly a: Geometric2;
    constructor(a: Geometric2) {
        super();
        const contextBuilder = () => "Rod2.constructor(a: Geometric2): Rod2";
        mustBeNonNullObject('a', a, contextBuilder);
        this.a = a;
        this.updateInertiaTensor();
    }
    updateInertiaTensor(): void {
        // L(Ω) = (m / 3) a ^ (a << Ω)
        // In 2D, this simplifies to...
        // L(Ω) = (m / 3) |a||a| Ω
        const I = this.M.divByNumber(3).mulByVector(this.a).mulByVector(this.a);
        this.Iinv = new Matrix1(new Float32Array([1 / I.a]), Unit.div(Unit.ONE, I.uom));
    }
}
