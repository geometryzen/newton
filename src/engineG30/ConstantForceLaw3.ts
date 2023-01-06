import { Geometric3 } from "@geometryzen/multivectors";
import { ConstantForceLaw } from "../core/ConstantForceLaw";
import { ForceBody } from "../core/ForceBody";
import { CoordType, WORLD } from "../model/CoordType";

/**
 * @deprecated Use ConstantForceLaw.
 * @hidden
 */
export class ConstantForceLaw3 extends ConstantForceLaw<Geometric3> {
    constructor(body: ForceBody<Geometric3>, vector: Geometric3, vectorCoordType: CoordType = WORLD) {
        super(body, vector, vectorCoordType);
    }
}
