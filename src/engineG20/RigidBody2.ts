import { Geometric2 } from "@geometryzen/multivectors";
import { RigidBody } from "../core/RigidBody";
import { Euclidean2 } from "./Euclidean2";

/**
 * @hidden
 */
const L = new Geometric2();

/**
 *
 */
export class RigidBody2 extends RigidBody<Geometric2> {
    constructor() {
        super(new Euclidean2());
    }
    /**
     * 
     */
    updateAngularVelocity(): void {
        // If the angular momentum is mutable then we don't want to accidentally change it.
        // If the angular momentum is immutable then we will need a scratch variable to avoid creating temporary objects. 
        L.copyBivector(this.L);
        // We know that (in 2D) the moment of inertia is a scalar.
        // The angular velocity property performs copy on assignment.
        this.Ω = L.mulByScalar(this.Iinv.getElement(0, 0), this.Iinv.uom);
    }
}
