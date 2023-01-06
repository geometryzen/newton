import { Geometric2 } from "@geometryzen/multivectors";
import { Particle } from "../core/Particle";
import { Euclidean2 } from "./Euclidean2";

export class Particle2 extends Particle<Geometric2> {
    /**
     * Constructs a particle in 2 Euclidean dimensions.
     * @param M The mass of the particle. Default is 1 (dimensionless).
     * @param Q The charge of the particle. Default is 1 (dimensionless).
     */
    constructor(M?: Geometric2, Q?: Geometric2) {
        super(M, Q, new Euclidean2());
    }
}
