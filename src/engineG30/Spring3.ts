import { Geometric3 } from "@geometryzen/multivectors";
import { RigidBody } from "../core/RigidBody";
import { Spring } from "../core/Spring";

/**
 * @deprecated Use Spring.
 * @hidden
 */
export class Spring3 extends Spring<Geometric3> {
    constructor(body1: RigidBody<Geometric3>, body2: RigidBody<Geometric3>) {
        super(body1, body2);
        // eslint-disable-next-line no-console
        console.warn("Spring3 is deprecated. Please use Spring instead.");
    }
}
