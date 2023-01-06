import { Geometric1 } from "@geometryzen/multivectors";
import { ForceBody } from "../core/ForceBody";
import { Torque } from "../core/Torque";

/**
 *
 */
export class Torque1 extends Torque<Geometric1> {
    constructor(body: ForceBody<Geometric1>) {
        super(body);
    }
}
