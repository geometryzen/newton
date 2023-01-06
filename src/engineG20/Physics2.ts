import { Geometric2 } from "@geometryzen/multivectors";
import { EnergySystem } from "../core/EnergySystem";
import { Physics } from "../core/Physics";
import { Euclidean2 } from "./Euclidean2";
import { KinematicsG20 } from "./KinematicsG20";

/**
 * @hidden
 */
export class Physics2 extends Physics<Geometric2> implements EnergySystem<Geometric2> {
    constructor() {
        super(new Euclidean2(), new KinematicsG20());
    }
}
