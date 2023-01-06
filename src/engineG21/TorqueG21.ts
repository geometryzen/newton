import { Spacetime2 } from "@geometryzen/multivectors";
import { ForceBody } from "../core/ForceBody";
import { Torque } from "../core/Torque";

/**
 *
 */
export class TorqueG21 extends Torque<Spacetime2> {
    constructor(body: ForceBody<Spacetime2>) {
        super(body);
    }
}
