import { Geometric2 } from "@geometryzen/multivectors";
import { ConstantForceLaw } from "../core/ConstantForceLaw";
import { ForceBody } from "../core/ForceBody";
import { CoordType, WORLD } from "../model/CoordType";

/**
 * @deprecated Use ConstantForceLaw.
 * @hidden
 */
export class ConstantForceLaw2 extends ConstantForceLaw<Geometric2> {
    constructor(body: ForceBody<Geometric2>, vector: Geometric2, vectorCoordType: CoordType = WORLD) {
        super(body, vector, vectorCoordType);
    }
}
