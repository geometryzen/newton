import { Geometric2 } from "@geometryzen/multivectors";
import { ForceBody } from "../core/ForceBody";
import { Torque } from "../core/Torque";

/**
 *
 */
export class Torque2 extends Torque<Geometric2> {
    constructor(body: ForceBody<Geometric2>) {
        super(body);
    }
}
