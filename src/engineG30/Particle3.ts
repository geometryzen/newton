import { Geometric3 } from "@geometryzen/multivectors";
import { Particle } from "../core/Particle";
import { MetricG30 } from "./MetricG30";

export class Particle3 extends Particle<Geometric3> {
    /**
     * Constructs a particle in 2 Euclidean dimensions.
     * @param M The mass of the particle. Default is 1 (dimensionless).
     * @param Q The charge of the particle. Default is 1 (dimensionless).
     */
    constructor(M: Geometric3, Q: Geometric3) {
        super(M, Q, new MetricG30());
    }
}
