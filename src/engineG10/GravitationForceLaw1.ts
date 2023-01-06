import { Geometric1 } from "@geometryzen/multivectors";
import { GravitationLaw } from "../core/GravitationLaw";
import { Massive } from "../core/Massive";

/**
 * @deprecated Use GravitationLaw.
 * @hidden
 */
export class GravitationForceLaw1 extends GravitationLaw<Geometric1> {
    constructor(body1: Massive<Geometric1>, body2: Massive<Geometric1>) {
        super(body1, body2);
        // eslint-disable-next-line no-console
        console.warn("GravitationForceLaw1 is deprecated. Please use GravitationLaw instead.");
    }
}
