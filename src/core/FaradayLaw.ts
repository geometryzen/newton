import { AbstractSimObject } from "../objects/AbstractSimObject";
import { Force } from "./Force";
import { ForceLaw } from "./ForceLaw";
import { WORLD } from '../model/CoordType';
import { Charged } from "./Charged";

export class FaradayLaw<T> extends AbstractSimObject implements ForceLaw<T> {
    private readonly force: Force<T>;
    private readonly $forces: [Force<T>];

    /**
     * force = Q * (v << F), where Q is the body charge, v is the ordinary spacetime velocity, F is the Faraday field at the body location.
     * @param body the body upon which the field acts.
     * @param field the Faraday field. This field that has a bivector value. 
     */
    constructor(private body: Charged<T>, private field: (position: T) => T) {
        super();
        const metric = body.metric;
        this.force = metric.createForce(body);
        this.force.locationCoordType = WORLD;
        this.force.vectorCoordType = WORLD;
        this.$forces = [this.force];
    }
    get forces(): Force<T>[] {
        return this.$forces;
    }
    updateForces(): Force<T>[] {
        // The forces are ordinary, dp/dt, as opposed to proper (Minkowski) dp/dτ.
        // This means that we must use the ordinary velocity to calculate the force.
        // Force = Q * (v << F), where Q is electric charge, v is ordinary velocity.
        const body = this.body;
        const metric = body.metric;
        const m = metric.a(body.M);
        const e0 = metric.e0;
        const X = body.X;
        const Q = body.Q;
        const F = this.field(X);
        metric.copy(body.P, this.force.vector);                             // vector => P
        metric.ext(this.force.vector, e0);                                  // vector => P ^ e0
        metric.rco(this.force.vector, e0);                                  // vector => (P ^ e0) >> e0
        metric.squaredNorm(this.force.vector);                              // vector => |(P ^ e0) >> e0|**2
        metric.neg(this.force.vector);                                      // vector => -|(P ^ e0) >> e0|**2
        metric.addScalar(this.force.vector, 1);                             // vector => 1 - |(P ^ e0) >> e0|**2
        metric.addScalar(this.force.vector, m * m);
        const mass = Math.sqrt(metric.a(this.force.vector));
        metric.copy(body.P, this.force.vector);                             // vector => P
        metric.divByScalar(this.force.vector, mass);                        // vector => v
        metric.lco(this.force.vector, F);                                   // vector => v << F
        metric.mulByScalar(this.force.vector, metric.a(Q), metric.uom(Q));  // vector => Q * (v << F)
        return this.$forces;
    }
    disconnect(): void {
        throw new Error("Method not implemented.");
    }
    potentialEnergy(): T {
        throw new Error("Method not implemented.");
    }
}
