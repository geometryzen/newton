import { Geometric1 } from "@geometryzen/multivectors";
import { Force } from "../core/Force";
import { ForceBody } from "../core/ForceBody";

/**
 *
 */
export class Force1 extends Force<Geometric1> {
    constructor(body: ForceBody<Geometric1>) {
        super(body);
    }
}
