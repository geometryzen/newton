import { Geometric1 } from "@geometryzen/multivectors";
import { ConstantForceLaw } from "../core/ConstantForceLaw";
import { ForceBody } from "../core/ForceBody";
import { CoordType, WORLD } from "../model/CoordType";

/**
 * @deprecated Use ConstantForceLaw.
 * @hidden
 */
export class ConstantForceLaw1 extends ConstantForceLaw<Geometric1> {
    constructor(body: ForceBody<Geometric1>, vector: Geometric1, vectorCoordType: CoordType = WORLD) {
        super(body, vector, vectorCoordType);
    }
}
