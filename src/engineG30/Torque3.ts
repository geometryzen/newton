import { Geometric3 } from "@geometryzen/multivectors";
import { ForceBody } from "../core/ForceBody";
import { Torque } from "../core/Torque";

/**
 *
 */
export class Torque3 extends Torque<Geometric3> {
    constructor(body: ForceBody<Geometric3>) {
        super(body);
    }
}
