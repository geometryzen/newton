import { Spacetime1 } from "@geometryzen/multivectors";
import { Particle } from "../core/Particle";
import { MetricG11 } from "./MetricG11";

export class ParticleG11 extends Particle<Spacetime1> {
    /**
     * Constructs a particle in 2 Euclidean dimensions.
     * @param M The mass of the particle. Default is 1 (dimensionless).
     * @param Q The charge of the particle. Default is 1 (dimensionless).
     */
    constructor(M?: Spacetime1, Q?: Spacetime1) {
        super(M, Q, new MetricG11());
    }
}
