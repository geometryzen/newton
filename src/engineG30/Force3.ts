import { Geometric3 } from "@geometryzen/multivectors";
import { Force } from "../core/Force";
import { ForceBody } from "../core/ForceBody";

/**
 *
 */
export class Force3 extends Force<Geometric3> {
    constructor(body: ForceBody<Geometric3>) {
        super(body);
    }
}
