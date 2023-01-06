import { Geometric3 } from "@geometryzen/multivectors";
import { LinearDamper } from "../core/LinearDamper";
import { RigidBody } from "../core/RigidBody";

/**
 * @deprecated Use LinearDamper.
 * @hidden
 */
export class LinearDamper3 extends LinearDamper<Geometric3> {
    constructor(body1: RigidBody<Geometric3>, body2: RigidBody<Geometric3>) {
        super(body1, body2);
        // eslint-disable-next-line no-console
        console.warn("LinearDamper3 is deprecated. Please use LinearDamper instead.");
    }
}
