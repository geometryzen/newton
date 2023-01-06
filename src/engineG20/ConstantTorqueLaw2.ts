import { Geometric2 } from "@geometryzen/multivectors";
import { ConstantTorqueLaw } from "../core/ConstantTorqueLaw";
import { ForceBody } from "../core/ForceBody";
import { WORLD } from "../model/CoordType";

/**
 * @deprecated Use ConstantTorqueLaw.
 * @hidden
 */
export class ConstantTorqueLaw2 extends ConstantTorqueLaw<Geometric2> {
    constructor(body: ForceBody<Geometric2>, value: Geometric2) {
        super(body, value, WORLD);
    }
}
