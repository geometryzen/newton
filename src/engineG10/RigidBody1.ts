import { Geometric1 } from "@geometryzen/multivectors";
import { RigidBody } from "../core/RigidBody";
import { MetricG10 } from "./MetricG10";

export class RigidBody1 extends RigidBody<Geometric1> {
    constructor() {
        super(new MetricG10());
    }
}
