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
 * A solid cylinder of uniform density.
 */
export class Cylinder3 extends RigidBody<Geometric3> {

    /**
     * The dimension corresponding to the radius.
     */
    private readonly radius_: Geometric3;
    private radiusLock_: number;

    /**
     * The dimension corresponding to the height.
     */
    private readonly height_: Geometric3;
    private heightLock_: number;

    /**
     * 
     */
    constructor(radius = Geometric3.one, height = Geometric3.one) {
        super(new MetricG30());

        this.radius_ = Geometric3.copy(radius);
        this.radiusLock_ = this.radius_.lock();

        this.height_ = Geometric3.copy(height);
        this.heightLock_ = this.height_.lock();

        if (Unit.isOne(radius.uom) && Unit.isOne(height.uom)) {
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
        this.radius_.copy(radius);
        this.radiusLock_ = this.radius_.lock();
        this.updateInertiaTensor();
    }

    get height(): Geometric3 {
        return this.height_;
    }
    set height(height: Geometric3) {
        this.height.unlock(this.heightLock_);
        this.height_.copy(height);
        this.heightLock_ = this.height_.lock();
        this.updateInertiaTensor();
    }

    /**
     * Whenever the mass or the dimensions change, we must update the inertia tensor.
     */
    protected updateInertiaTensor(): void {
        const r = this.radius_;
        const h = this.height_;
        const rr = r.a * r.a;
        const hh = h.a * h.a;
        const Irr = this.M.a * (3 * rr + hh) / 12;
        const Ihh = this.M.a * rr / 2;
        const Iinv = Matrix3.zero();
        Iinv.setElement(0, 0, 1 / Irr);
        Iinv.setElement(1, 1, 1 / Ihh);
        Iinv.setElement(2, 2, 1 / Irr);
        Iinv.uom = Unit.div(Unit.ONE, Unit.mul(this.M.uom, Unit.mul(r.uom, h.uom)));
        this.Iinv = Iinv;
    }
}
