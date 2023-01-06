import { Geometric2 } from "@geometryzen/multivectors";
import { LinearDamper } from "../core/LinearDamper";
import { RigidBody } from "../core/RigidBody";

/**
 * @deprecated Use LinearDamper.
 * @hidden
 */
export class LinearDamper2 extends LinearDamper<Geometric2> {
    constructor(body1: RigidBody<Geometric2>, body2: RigidBody<Geometric2>) {
        super(body1, body2);
        // eslint-disable-next-line no-console
        console.warn("LinearDamper2 is deprecated. Please use LinearDamper instead.");
    }
}
