import { Geometric1 } from "@geometryzen/multivectors";
import { Engine, EngineOptions } from "../core/Engine";
import { KinematicsG10 } from "./KinematicsG10";
import { MetricG10 } from "./MetricG10";

/**
 * The Physics Engine specialized to 1 dimension with a Euclidean metric.
 */
export class Engine1 extends Engine<Geometric1> {
    constructor(options?: EngineOptions) {
        super(new MetricG10(), new KinematicsG10(), options);
    }
}
