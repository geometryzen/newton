import { CoordType, LOCAL, WORLD } from '../model/CoordType';
import { AbstractSimObject } from "../objects/AbstractSimObject";
import { ForceBody } from "./ForceBody";

/**
 * @hidden
 */
export abstract class Torque<T> extends AbstractSimObject {
    public readonly bivector: T;
    /**
     * 
     */
    public bivectorCoordType: CoordType;
    private readonly $temp1: T;

    constructor(private readonly body: ForceBody<T>) {
        super();
        const metric = body.metric;
        this.bivector = metric.scalar(0);
        this.$temp1 = metric.scalar(0);
    }

    /**
     * 
     */
    getBody(): ForceBody<T> {
        return this.body;
    }

    /**
     * 
     * @param torque 
     */
    computeTorque(torque: T): void {
        const metric = this.body.metric;
        switch (this.bivectorCoordType) {
            case LOCAL: {
                metric.copyBivector(this.bivector, this.$temp1);
                metric.rotate(this.$temp1, this.body.R);
                metric.writeBivector(this.$temp1, torque);
                break;
            }
            case WORLD: {
                metric.copyBivector(this.bivector, this.$temp1);
                metric.writeBivector(this.$temp1, torque);
                break;
            }
        }
    }
}
