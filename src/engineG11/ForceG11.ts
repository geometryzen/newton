import { Spacetime1 } from "@geometryzen/multivectors";
import { Force } from "../core/Force";
import { ForceBody } from "../core/ForceBody";

/**
 *
 */
export class ForceG11 extends Force<Spacetime1> {
    constructor(body: ForceBody<Spacetime1>) {
        super(body);
    }
}
