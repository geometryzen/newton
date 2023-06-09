import { SimObject } from "./SimObject";
import { Torque } from "./Torque";

/**
 *
 */
export interface TorqueLaw<T> extends SimObject {
    /**
     *
     */
    readonly torques: Torque<T>[];
    /**
     *
     */
    updateTorques(): Torque<T>[];
    /**
     *
     */
    disconnect(): void;
    /**
     * 
     */
    potentialEnergy(): T;
}
