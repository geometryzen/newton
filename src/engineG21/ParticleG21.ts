import { Spacetime2 } from "@geometryzen/multivectors";
import { Particle } from "../core/Particle";
import { MetricG21 } from "./MetricG21";

export class ParticleG21 extends Particle<Spacetime2> {
    /**
     * Constructs a particle in 2 Euclidean dimensions.
     * @param M The mass of the particle. Default is 1 (dimensionless).
     * @param Q The charge of the particle. Default is 1 (dimensionless).
     */
    constructor(M?: Spacetime2, Q?: Spacetime2) {
        super(M, Q, new MetricG21());
    }
}
