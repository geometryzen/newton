import { Unit } from '@geometryzen/multivectors';
import { WORLD } from '../model/CoordType';
import { AbstractSimObject } from "../objects/AbstractSimObject";
import { Force } from "./Force";
import { ForceBody } from "./ForceBody";
import { ForceLaw } from "./ForceLaw";
import { LockableMeasure } from './LockableMeasure';
import { mustBeDimensionlessOrCorrectUnits } from './mustBeDimensionlessOrCorrectUnits';

/**
 *
 */
export class LinearDamper<T> extends AbstractSimObject implements ForceLaw<T> {
    /**
     * Friction Coefficient.
     */
    private $frictionCoefficient: LockableMeasure<T>;
    /**
     * The force information on body1 due to body2.
     */
    private readonly F1: Force<T>;
    /**
     * The force information on body2 due to body1.
     */
    private readonly F2: Force<T>;
    /**
     * 
     */
    private readonly $forces: Force<T>[] = [];
    /**
     * 
     * @param body1 
     * @param body2 
     */
    constructor(private readonly body1: ForceBody<T>, private readonly body2: ForceBody<T>) {
        super();
        const metric = body1.metric;

        this.$frictionCoefficient = new LockableMeasure(metric, metric.scalar(1));

        this.F1 = metric.createForce(this.body1);
        this.F1.locationCoordType = WORLD;
        this.F1.vectorCoordType = WORLD;

        this.F2 = metric.createForce(this.body2);
        this.F2.locationCoordType = WORLD;
        this.F2.vectorCoordType = WORLD;

        this.$forces = [this.F1, this.F2];
    }

    get forces(): Force<T>[] {
        return this.$forces;
    }

    get b(): T {
        return this.$frictionCoefficient.get();
    }
    set b(b: T) {
        mustBeDimensionlessOrCorrectUnits('b', b, Unit.FRICTION_COEFFICIENT, this.body1.metric);
        this.$frictionCoefficient.set(b);
    }

    get frictionCoefficient(): T {
        return this.$frictionCoefficient.get();
    }
    set frictionCoefficient(frictionCoefficient: T) {
        mustBeDimensionlessOrCorrectUnits('frictionCoefficient', frictionCoefficient, Unit.FRICTION_COEFFICIENT, this.body1.metric);
        this.$frictionCoefficient.set(frictionCoefficient);
    }

    updateForces(): Force<T>[] {
        const metric = this.body1.metric;
        const b = this.$frictionCoefficient.get();
        const x1 = this.body1.X;
        const x2 = this.body2.X;
        const e = metric.scalar(0);
        metric.addVector(e, x1);
        metric.subVector(e, x2);
        metric.direction(e);

        const v1 = metric.scalar(0);
        metric.copyVector(this.body1.P, v1);
        metric.divByScalar(v1, metric.a(this.body1.M), metric.uom(this.body1.M));
        const v2 = metric.scalar(0);
        metric.copyVector(this.body2.P, v2);
        metric.divByScalar(v2, metric.a(this.body2.M), metric.uom(this.body2.M));
        const v = metric.scalar(0);
        metric.copyVector(v1, v);
        metric.subVector(v, v2);

        const f1 = this.F1.vector;
        metric.copyVector(v, f1);                           // f1 = v
        metric.scp(f1, e);                                  // f1 = v | e
        metric.mulByScalar(f1, metric.a(b), metric.uom(b)); // f1 = b * (v | e)
        metric.neg(f1);                                     // f1 = - b * (v | e)
        metric.mulByVector(f1, e);                          // f1 = - b * (v | e) e

        const f2 = this.F2.vector;
        metric.copyVector(f1, f2);                          // f2 = f1
        metric.neg(f2);                                     // f2 = - f1

        metric.copyVector(x1, this.F1.location);
        metric.copyVector(x2, this.F2.location);

        return this.$forces;
    }
    disconnect(): void {
        // Do nothing yet.
        // TODO: zero the forces?
    }
    potentialEnergy(): T {
        const metric = this.body1.metric;
        return metric.scalar(0);
    }
}
