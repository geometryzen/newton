import { Geometric3 } from "@geometryzen/multivectors";
import { RigidBody } from "../core/RigidBody";
import { MetricG30 } from "./MetricG30";

/**
 *
 */
export class RigidBody3 extends RigidBody<Geometric3> {
    constructor() {
        super(new MetricG30());
    }
}
