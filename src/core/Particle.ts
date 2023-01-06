import { Unit } from '@geometryzen/multivectors';
import { Metric } from './Metric';
import { RigidBody } from './RigidBody';

/**
 * An object with no internal structure.
 * @hidden
 */
export class Particle<T> extends RigidBody<T> {

    /**
     * @param M The mass of the particle. The mass is copied into the `M` property. Default is 1 (dimensionless).
     * @param Q The electric charge of the particle. The charge is copied into the `Q` property. Default is 1 (dimensionless).
     */
    constructor(M: T | undefined, Q: T | undefined, metric: Metric<T>) {
        super(metric);
        this.M = M ? M : metric.scalar(1);
        this.Q = Q ? Q : metric.scalar(1);
    }

    /**
     *
     */
    public updateAngularVelocity(): void {
        const metric = this.metric;
        if (Unit.isOne(metric.uom(this.L))) {
            if (!Unit.isOne(metric.uom(this.Ω))) {
                metric.setUom(this.Ω, Unit.ONE);
            }
        }
        else if (Unit.isCompatible(metric.uom(this.L), Unit.JOULE_SECOND)) {
            if (!Unit.isCompatible(metric.uom(this.Ω), Unit.INV_SECOND)) {
                metric.setUom(this.Ω, Unit.INV_SECOND);
            }
        }
        else {
            throw new Error(`updateAngularVelocity() body.L.uom=${metric.uom(this.L)}, body.Ω.uom=${metric.uom(this.Ω)}`);
        }
    }

    /**
     *
     */
    protected updateInertiaTensor(): void {
        const metric = this.metric;
        if (Unit.isOne(metric.uom(this.L))) {
            if (!Unit.isOne(this.Iinv.uom)) {
                this.Iinv.uom = Unit.ONE;
            }
        }
        else if (Unit.isCompatible(metric.uom(this.L), Unit.JOULE_SECOND)) {
            if (!Unit.isCompatible(this.Iinv.uom, Unit.div(Unit.ONE, Unit.KILOGRAM_METER_SQUARED))) {
                this.Iinv.uom = Unit.div(Unit.ONE, Unit.KILOGRAM_METER_SQUARED);
            }
        }
        else {
            throw new Error(`updateInertiaTensor() body.L.uom=${metric.uom(this.L)}, body.Ω.uom=${metric.uom(this.Ω)}`);
        }
    }
}
