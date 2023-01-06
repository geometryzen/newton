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

import { Geometric3, Unit } from '@geometryzen/multivectors';
import { RigidBody } from '../core/RigidBody';
import { Matrix3 } from '../math/Matrix3';
import { MetricG30 } from './MetricG30';

/**
 * A rectangular block of constant density.
 */
export class Block3 extends RigidBody<Geometric3> {
    /**
     * The dimension corresponding to the width.
     */
    private readonly width_: Geometric3;
    private widthLock_: number;

    /**
     * The dimension corresponding to the height.
     */
    private readonly height_: Geometric3;
    private heightLock_: number;

    /**
     * The dimension corresponding to the depth.
     */
    private readonly depth_: Geometric3;
    private depthLock_: number;

    /**
     * 
     */
    constructor(width = Geometric3.one, height = Geometric3.one, depth = Geometric3.one) {
        super(new MetricG30());

        if (!(width instanceof Geometric3)) {
            throw new Error("width must be a Geometric3.");
        }

        if (!(height instanceof Geometric3)) {
            throw new Error("height must be a Geometric3.");
        }

        if (!(depth instanceof Geometric3)) {
            throw new Error("depth must be a Geometric3.");
        }

        this.width_ = Geometric3.copy(width);
        this.widthLock_ = this.width_.lock();

        this.height_ = Geometric3.copy(height);
        this.heightLock_ = this.height_.lock();

        this.depth_ = Geometric3.copy(depth);
        this.depthLock_ = this.depth_.lock();

        if (Unit.isOne(width.uom) && Unit.isOne(height.uom) && Unit.isOne(depth.uom)) {
            // dimensionless
        }
        else {
            this.M = Geometric3.scalar(this.M.a, Unit.KILOGRAM);
            // this.Iinv.uom = Unit.div(Unit.ONE, Unit.KILOGRAM_METER_SQUARED);
            this.X.uom = Unit.METER;
            this.R.uom = Unit.ONE;
            this.P.uom = Unit.KILOGRAM_METER_PER_SECOND;
            this.L.uom = Unit.JOULE_SECOND;
        }

        this.updateInertiaTensor();
    }

    get width(): Geometric3 {
        return this.width_;
    }
    set width(width: Geometric3) {
        this.width_.unlock(this.widthLock_);
        this.width_.copy(width);
        this.widthLock_ = this.width_.lock();
        this.updateInertiaTensor();
    }

    get height(): Geometric3 {
        return this.height_;
    }
    set height(height: Geometric3) {
        this.height_.unlock(this.heightLock_);
        this.height_.copy(height);
        this.heightLock_ = this.height_.lock();
        this.updateInertiaTensor();
    }

    get depth(): Geometric3 {
        return this.depth_;
    }
    set depth(depth: Geometric3) {
        this.depth_.unlock(this.depthLock_);
        this.depth_.copy(depth);
        this.depthLock_ = this.depth_.lock();
        this.updateInertiaTensor();
    }

    /**
     * The angular velocity is updated from the angular momentum.
     */
    public updateAngularVelocity(): void {
        const w = this.width_;
        const h = this.height_;
        const d = this.depth_;
        const ww = w.a * w.a;
        const hh = h.a * h.a;
        const dd = d.a * d.a;
        const k = 12 / this.M.a;
        this.Ω.yz = k * this.L.yz / (hh + dd);
        this.Ω.zx = k * this.L.zx / (ww + dd);
        this.Ω.xy = k * this.L.xy / (ww + hh);
        this.Ω.uom = Unit.div(Unit.div(this.L.uom, this.M.uom), Unit.mul(w.uom, w.uom));
    }

    /**
     * Whenever the mass or the dimensions change, we must update the inertia tensor.
     */
    protected updateInertiaTensor(): void {
        const w = this.width_;
        const h = this.height_;
        const d = this.depth_;
        const ww = w.a * w.a;
        const hh = h.a * h.a;
        const dd = d.a * d.a;
        const s = this.M.a / 12;
        const Iinv = Matrix3.zero();
        Iinv.setElement(0, 0, 1 / (s * (hh + dd)));
        Iinv.setElement(1, 1, 1 / (s * (dd + ww)));
        Iinv.setElement(2, 2, 1 / (s * (ww + hh)));
        Iinv.uom = Unit.div(Unit.ONE, Unit.mul(this.M.uom, Unit.mul(w.uom, w.uom)));
        this.Iinv = Iinv;
    }
}
