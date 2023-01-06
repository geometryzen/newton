import { Geometric3 } from "@geometryzen/multivectors";
import { ConstantTorqueLaw } from "../core/ConstantTorqueLaw";
import { ForceBody } from "../core/ForceBody";
import { CoordType } from "../model/CoordType";

/**
 * @deprecated Use ConstantTorqueLaw.
 * @hidden
 */
export class ConstantTorqueLaw3 extends ConstantTorqueLaw<Geometric3> {
    constructor(body: ForceBody<Geometric3>, value: Geometric3, valueCoordType: CoordType) {
        super(body, value, valueCoordType);
    }
}
