import { Geometric3 } from "@geometryzen/multivectors";
import { GravitationLaw } from "../core/GravitationLaw";
import { Massive } from "../core/Massive";

/**
 * @deprecated Use GravitationLaw.
 * @hidden
 */
export class GravitationForceLaw3 extends GravitationLaw<Geometric3> {
    constructor(body1: Massive<Geometric3>, body2: Massive<Geometric3>) {
        super(body1, body2);
        // eslint-disable-next-line no-console
        console.warn("GravitationForceLaw3 is deprecated. Please use GravitationLaw instead.");
    }
}
