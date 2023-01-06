import { SimObject } from './SimObject';
import { Metric } from './Metric';

/**
 *
 */
export interface ForceBody<T> extends SimObject {
    /**
     * The metric must be known in order to compute the energies and angular velocity.
     */
    metric: Metric<T>;
    /**
     * A placeholder for applications to define a unique identifier.
     */
    uuid: string;
    /**
     * mass (scalar). In the case of relativistic systems, this is the rest mass.
     */
    M: T;
    /**
     * position (vector)
     */
    X: T;
    /**
     * attitude (spinor)
     */
    R: T;
    /**
     * momentum (vector)
     */
    P: T;
    /**
     * angular momentum (bivector)
     */
    L: T;
    /**
     * angular velocity (bivector)
     */
    Ω: T;
    /**
     * offset into state array
     */
    varsIndex: number;
    /**
     * computes the rotational kinetic energy.
     */
    rotationalEnergy(): T;
    /**
     * computes the translational kinetic energy.
     */
    translationalEnergy(): T;
    /**
     * updates the angular velocity from the angular momentum.
     */
    updateAngularVelocity(): void;
}
