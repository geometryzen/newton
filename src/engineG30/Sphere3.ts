// Copyright 2017-2021 David Holmes.  All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Geometric3, Matrix3, Unit } from '@geometryzen/multivectors';
import { RigidBody } from '../core/RigidBody';
import { MetricG30 } from './MetricG30';

/**
 * A solid sphere of constant density.
 */
export class Sphere3 extends RigidBody<Geometric3> {

    /**
     * The dimension corresponding to the width.
     */
    private readonly radius_: Geometric3;
    private radiusLock_: number;

    /**
     * 
     */
    constructor(radius = Geometric3.one) {
        super(new MetricG30());
        this.radius_ = Geometric3.fromScalar(radius);
        this.radiusLock_ = this.radius_.lock();

        if (Unit.isOne(radius.uom)) {
            // dimensionless
        }
        else {
            this.M = Geometric3.scalar(this.M.a, Unit.KILOGRAM);
            this.Iinv.uom = Unit.div(Unit.ONE, Unit.KILOGRAM_METER_SQUARED);
            this.X.uom = Unit.METER;
            this.R.uom = Unit.ONE;
            this.P.uom = Unit.KILOGRAM_METER_PER_SECOND;
            this.L.uom = Unit.JOULE_SECOND;
        }

        this.updateInertiaTensor();
    }

    get radius(): Geometric3 {
        return this.radius_;
    }
    set radius(radius: Geometric3) {
        this.radius_.unlock(this.radiusLock_);
        this.radius_.copyScalar(radius.a, radius.uom);
        this.radiusLock_ = this.radius_.lock();
        this.updateInertiaTensor();
    }

    /**
     * L(Ω) = (2 M r r / 5) Ω => Ω = (5 / 2 M r r) L(Ω)
     */
    public updateAngularVelocity(): void {
        this.Ω.copyScalar(this.radius_.a, this.radius_.uom);    // Ω = r (scalar)    
        this.Ω.quaditude();                                          // Ω = r * r (scalar)
        this.Ω.mulByScalar(this.M.a, this.M.uom);               // Ω = r * r * M = M * r * r (scalar)
        this.Ω.mulByNumber(2 / 5);                              // Ω = 2 * M * r * r / 5 (scalar)
        this.Ω.inv();                                           // Ω = 5 / (2 * M * r * r) (scalar)
        this.Ω.mulByBivector(this.L);                           // Ω = 5 * L / (2 * M * r * r) (bivector)
    }

    /**
     * Whenever the mass or the dimensions change, we must update the inertia tensor.
     */
    protected updateInertiaTensor(): void {
        const r = this.radius_;
        const s = 2 * this.M.a * r.a * r.a / 5;
        const Iinv = Matrix3.zero();
        Iinv.setElement(0, 0, 1 / s);
        Iinv.setElement(1, 1, 1 / s);
        Iinv.setElement(2, 2, 1 / s);
        Iinv.uom = Unit.div(Unit.ONE, Unit.mul(this.M.uom, Unit.mul(r.uom, r.uom)));
        this.Iinv = Iinv;
    }
}
