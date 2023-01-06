import { Spacetime1 } from "@geometryzen/multivectors";
import { Engine, EngineOptions } from "../core/Engine";
import { KinematicsG11 } from "./KinematicsG11";
import { MetricG11 } from "./MetricG11";

/**
 * The Physics Engine specialized to 1+1 dimensions with a Spacetime metric.
 */
export class EngineG11 extends Engine<Spacetime1> {
    constructor(options?: EngineOptions) {
        super(new MetricG11(), new KinematicsG11(), options);
    }
}
