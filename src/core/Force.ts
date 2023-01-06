import { CoordType, LOCAL, WORLD } from '../model/CoordType';
import { AbstractSimObject } from '../objects/AbstractSimObject';
import { ForceBody } from './ForceBody';

/**
 * @hidden
 */
export class Force<T> extends AbstractSimObject {
    /**
     * The point of application of the force.
     */
    public readonly location: T;
    /**
     * 
     */
    private $locationCoordType: CoordType;
    /**
     * The force vector, may be in local or world coordinates.
     */
    public readonly vector: T;
    /**
     * 
     */
    private $vectorCoordType: CoordType;

    private readonly $temp1: T;
    private readonly $temp2: T;

    /**
     * 
     */
    constructor(private readonly body: ForceBody<T>) {
        super();
        const metric = body.metric;

        this.location = metric.scalar(0);
        this.$locationCoordType = LOCAL;

        this.vector = metric.scalar(0);
        this.$vectorCoordType = WORLD;

        this.$temp1 = metric.scalar(0);
        this.$temp2 = metric.scalar(0);
    }

    /**
     * 
     */
    get locationCoordType(): CoordType {
        return this.$locationCoordType;
    }
    set locationCoordType(locationCoordType: CoordType) {
        if (locationCoordType !== LOCAL && locationCoordType !== WORLD) {
            throw new Error("locationCoordType must be LOCAL (0) or WORLD (1).");
        }
        this.$locationCoordType = locationCoordType;
    }

    /**
     * 
     */
    get vectorCoordType(): CoordType {
        return this.$vectorCoordType;
    }
    set vectorCoordType(vectorCoordType: CoordType) {
        if (vectorCoordType !== LOCAL && vectorCoordType !== WORLD) {
            throw new Error("vectorCoordType must be LOCAL (0) or WORLD (1).");
        }
        this.$vectorCoordType = vectorCoordType;
    }

    /**
     * 
     */
    getBody(): ForceBody<T> {
        return this.body;
    }

    /**
     * Computes the point of application of the force in world coordinates.
     * 
     * @param position (output)
     */
    computePosition(position: T): void {
        const metric = this.body.metric;
        switch (this.$locationCoordType) {
            case LOCAL: {
                metric.copyVector(this.location, position);
                // We could subtract the body center-of-mass in body coordinates here.
                // Instead we assume that it is always zero.
                if (!metric.isOne(this.body.R)) {
                    metric.rotate(position, this.body.R);
                }
                metric.addVector(position, this.body.X);
                break;
            }
            case WORLD: {
                metric.copyVector(this.location, position);
                break;
            }
        }
    }

    /**
     * Computes the force being applied (vector) in WORLD coordinates.
     * 
     * @param force (output)
     */
    computeForce(force: T): void {
        const metric = this.body.metric;
        switch (this.$vectorCoordType) {
            case LOCAL: {
                metric.copyVector(this.vector, force);
                metric.rotate(force, this.body.R);
                break;
            }
            case WORLD: {
                metric.copyVector(this.vector, force);
                break;
            }
        }
    }

    /**
     * Computes the torque, i.e. moment of the force about the center of mass (bivector).
     * Torque = (x - X) ^ F, so the torque is being computed with center of mass as origin.
     * Torque = r ^ F because r = x - X
     * 
     * @param torque (output)
     */
    computeTorque(torque: T): void {
        const metric = this.body.metric;
        this.computePosition(torque);          // torque = x
        this.computeForce(this.$temp2);        // temp2 = F
        metric.subVector(torque, this.body.X); // torque = x - X
        metric.ext(torque, this.$temp2);       // torque = (x - X) ^ F
    }

    get F(): T {
        this.computeForce(this.$temp2);
        return this.$temp2;
    }

    get x(): T {
        this.computePosition(this.$temp1);
        return this.$temp1;
    }
}
