import { Geometric2 } from "@geometryzen/multivectors";
import { GravitationLaw } from "../core/GravitationLaw";
import { Massive } from "../core/Massive";

/**
 * @deprecated Use GravitationLaw.
 * @hidden
 */
export class GravitationForceLaw2 extends GravitationLaw<Geometric2> {
    constructor(body1: Massive<Geometric2>, body2: Massive<Geometric2>) {
        super(body1, body2);
        // eslint-disable-next-line no-console
        console.warn("GravitationForceLaw2 is deprecated. Please use GravitationLaw instead.");
    }
}
