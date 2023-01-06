import { Geometric2 } from "@geometryzen/multivectors";
import { Force } from "../core/Force";
import { ForceBody } from "../core/ForceBody";

/**
 *
 */
export class Force2 extends Force<Geometric2> {
    constructor(body: ForceBody<Geometric2>) {
        super(body);
    }
}
