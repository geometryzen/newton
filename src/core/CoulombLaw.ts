import { Unit } from '@geometryzen/multivectors';
import { WORLD } from '../model/CoordType';
import { AbstractSimObject } from '../objects/AbstractSimObject';
import { Charged } from './Charged';
import { Force } from './Force';
import { ForceLaw } from './ForceLaw';
import { LockableMeasure } from './LockableMeasure';
import { Metric } from './Metric';
import { mustBeDimensionlessOrCorrectUnits } from './mustBeDimensionlessOrCorrectUnits';

/**
 * The S.I. unit for 1 / (4 π ε0), i.e. N * m^2 / (C^2).
 */
const kUnitSI = Unit.NEWTON.mul(Unit.METER).mul(Unit.METER).div(Unit.COULOMB).div(Unit.COULOMB);

/**
 * The Electric Force (Coulomb's Law) 
 */
export class CoulombLaw<T> extends AbstractSimObject implements ForceLaw<T> {
    /**
     * The constant of proportionality.
     */
    private readonly $k: LockableMeasure<T>;

    private readonly F1: Force<T>;
    private readonly F2: Force<T>;
    private readonly $forces: Force<T>[];

    /**
     * Scratch variable for computing potential energy.
     */
    private readonly potentialEnergy_: T;
    private potentialEnergyLock_: number;
    private readonly metric: Metric<T>;

    /**
     * 
     */
    constructor(private readonly body1: Charged<T>, private readonly body2: Charged<T>, k?: T) {
        super();
        this.metric = body1.metric;
        const metric = this.metric;
        this.F1 = metric.createForce(this.body1);
        this.F1.locationCoordType = WORLD;
        this.F1.vectorCoordType = WORLD;

        this.F2 = metric.createForce(this.body2);
        this.F2.locationCoordType = WORLD;
        this.F2.vectorCoordType = WORLD;

        if (k) {
            this.$k = new LockableMeasure(metric, k);
        }
        else {
            this.$k = new LockableMeasure(metric, metric.scalar(1));
        }

        this.$forces = [this.F1, this.F2];
        this.potentialEnergy_ = metric.scalar(0);
        this.potentialEnergyLock_ = metric.lock(this.potentialEnergy_);
    }
    /**
     * The proportionality constant, Coulomb's constant.
     * The approximate value in SI units is 9 x 10<sup>9</sup> N·m<sup>2</sup>/C<sup>2</sup>.
     * The default value is one (1).
     */
    get k(): T {
        return this.$k.get();
    }
    set k(k: T) {
        mustBeDimensionlessOrCorrectUnits('k', k, kUnitSI, this.body1.metric);
        this.$k.set(k);
    }

    get forces(): Force<T>[] {
        return this.$forces;
    }

    /**
     * Computes the forces due to the Coulomb interaction.
     * F = k * q1 * q2 * direction(r2 - r1) / quadrance(r2 - r1)
     */
    updateForces(): Force<T>[] {
        // We can use the F1.location and F2.location as temporary variables
        // as long as we restore their contents.
        const numer = this.F1.location;
        const denom = this.F2.location;

        const metric = this.metric;

        // The direction of the force is computed such that like charges repel each other.
        metric.copyVector(this.body1.X, numer);
        metric.subVector(numer, this.body2.X);

        metric.copyVector(numer, denom);
        metric.squaredNorm(denom);

        metric.direction(numer);
        metric.mulByScalar(numer, metric.a(this.k), metric.uom(this.k));
        metric.mulByScalar(numer, metric.a(this.body1.Q), metric.uom(this.body1.Q));
        metric.mulByScalar(numer, metric.a(this.body2.Q), metric.uom(this.body2.Q));

        metric.copyVector(numer, this.F1.vector);
        metric.divByScalar(this.F1.vector, metric.a(denom), metric.uom(denom));

        metric.copyVector(this.F1.vector, this.F2.vector);
        metric.neg(this.F2.vector);

        // Restore the contents of the location variables.
        metric.copyVector(this.body1.X, this.F1.location);
        metric.copyVector(this.body2.X, this.F2.location);

        return this.$forces;
    }

    /**
     * 
     */
    disconnect(): void {
        // Does nothing
    }

    /**
     * Computes the potential energy of the gravitational interaction.
     * U = k q1 q2 / r, where
     * r is the center to center separation of m1 and m2.
     */
    potentialEnergy(): T {
        const metric = this.metric;
        // Unlock the variable that we will use for the result.
        metric.unlock(this.potentialEnergy_, this.potentialEnergyLock_);

        // We can use the F1.location and F2.location as temporary variables
        // as long as we restore their contents.
        const numer = this.F1.location;
        const denom = this.F2.location;
        // The numerator of the potential energy formula is k * Q1 * Q2.
        metric.copyScalar(metric.a(this.k), metric.uom(this.k), numer);
        metric.mulByScalar(numer, metric.a(this.body1.Q), metric.uom(this.body1.Q));
        metric.mulByScalar(numer, metric.a(this.body2.Q), metric.uom(this.body2.Q));
        // The denominator is |r1 - r2|.
        metric.copyVector(this.body1.X, denom);
        metric.subVector(denom, this.body2.X);
        metric.norm(denom);
        // Combine the numerator and denominator.
        metric.copyScalar(metric.a(numer), metric.uom(numer), this.potentialEnergy_);
        metric.divByScalar(this.potentialEnergy_, metric.a(denom), metric.uom(denom));

        // Restore the contents of the location variables.
        metric.copyVector(this.body1.X, this.F1.location);
        metric.copyVector(this.body2.X, this.F2.location);

        // We're done. Lock down the result.
        this.potentialEnergyLock_ = metric.lock(this.potentialEnergy_);
        return this.potentialEnergy_;
    }
}
