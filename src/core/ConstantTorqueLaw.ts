import { CoordType } from "../model/CoordType";
import { AbstractSimObject } from "../objects/AbstractSimObject";
import { ForceBody } from "./ForceBody";
import { Torque } from "./Torque";
import { TorqueLaw } from "./TorqueLaw";

/**
 *
 */
export class ConstantTorqueLaw<T> extends AbstractSimObject implements TorqueLaw<T> {
    private readonly $torque: Torque<T>;
    private readonly $torques: Torque<T>[];
    constructor(private $body: ForceBody<T>, value: T, valueCoordType: CoordType) {
        super();
        const metric = this.$body.metric;
        this.$torque = metric.createTorque(this.$body);
        metric.copyBivector(value, this.$torque.bivector);
        this.$torque.bivectorCoordType = valueCoordType;
        this.$torques = [this.$torque];
    }
    get torques(): Torque<T>[] {
        return this.$torques;
    }
    updateTorques(): Torque<T>[] {
        return this.$torques;
    }
    disconnect(): void {
        // Do nothing yet.
    }
    potentialEnergy(): T {
        const metric = this.$body.metric;
        // We don't really want to return a mutable quantity.
        return metric.scalar(0);
    }
}
