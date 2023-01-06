import { Spacetime2 } from "@geometryzen/multivectors";
import { Force } from "../core/Force";
import { ForceBody } from "../core/ForceBody";

/**
 *
 */
export class ForceG21 extends Force<Spacetime2> {
    constructor(body: ForceBody<Spacetime2>) {
        super(body);
    }
}
