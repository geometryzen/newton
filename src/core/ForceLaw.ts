import { SimObject } from './SimObject';
import { Force } from './Force';

/**
 * A force law computes the forces on one or more bodies in the system.
 */
export interface ForceLaw<T> extends SimObject {
    /**
     * The forces that were computed the last time that the  `updateForces()` method was called.
     */
    readonly forces: Force<T>[];
    /**
     * Updates the forces based upon the current state of the bodies. 
     */
    updateForces(): Force<T>[];
    /**
     * TODO: This does not do anything in the existing implementations of ForceLaw.
     */
    disconnect(): void;
    /**
     * Computes the potential energy associated with the interaction of the bodies.
     */
    potentialEnergy(): T;
}

