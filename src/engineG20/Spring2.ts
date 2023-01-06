import { Geometric2 } from "@geometryzen/multivectors";
import { RigidBody } from "../core/RigidBody";
import { Spring } from "../core/Spring";

/**
 * @deprecated Use Spring.
 * @hidden
 */
export class Spring2 extends Spring<Geometric2> {
    constructor(body1: RigidBody<Geometric2>, body2: RigidBody<Geometric2>) {
        super(body1, body2);
        // eslint-disable-next-line no-console
        console.warn("Spring2 is deprecated. Please use Spring instead.");
    }
}
