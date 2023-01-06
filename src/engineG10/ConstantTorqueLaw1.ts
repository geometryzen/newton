import { Geometric1 } from "@geometryzen/multivectors";
import { ConstantTorqueLaw } from "../core/ConstantTorqueLaw";
import { ForceBody } from "../core/ForceBody";
import { WORLD } from "../model/CoordType";

/**
 * @deprecated Use ConstantTorqueLaw.
 * @hidden
 */
export class ConstantTorqueLaw1 extends ConstantTorqueLaw<Geometric1> {
    constructor(body: ForceBody<Geometric1>, value: Geometric1) {
        super(body, value, WORLD);
    }
}
