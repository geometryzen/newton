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

import { Geometric2, Unit } from '@geometryzen/multivectors';
import { Matrix1 } from '../math/Matrix1';
import { RigidBody2 } from './RigidBody2';

/**
 * A rectangular block of constant surface density.
 */
export class Block2 extends RigidBody2 {
    /**
     * The dimension corresponding to the width.
     */
    private readonly width_: Geometric2;
    private widthLock_: number;

    /**
     * The dimension corresponding to the height.
     */
    private readonly height_: Geometric2;
    private heightLock_: number;

    /**
     * 
     */
    constructor(width = Geometric2.one, height = Geometric2.one) {
        super();

        if (!(width instanceof Geometric2)) {
            throw new Error("width must be a Geometric2.");
        }

        if (!(height instanceof Geometric2)) {
            throw new Error("height must be a Geometric2.");
        }

        this.width_ = Geometric2.copy(width);
        this.widthLock_ = this.width_.lock();

        this.height_ = Geometric2.copy(height);
        this.heightLock_ = this.height_.lock();

        if (Unit.isOne(width.uom) && Unit.isOne(height.uom)) {
            // dimensionless
        }
        else {
            this.M = Geometric2.scalar(this.M.a, Unit.KILOGRAM);
            this.Iinv.uom = Unit.div(Unit.ONE, Unit.KILOGRAM_METER_SQUARED);
            this.X.uom = Unit.METER;
            this.R.uom = Unit.ONE;
            this.P.uom = Unit.KILOGRAM_METER_PER_SECOND;
            this.L.uom = Unit.JOULE_SECOND;
        }

        this.updateInertiaTensor();
    }

    get width(): Geometric2 {
        return this.width_;
    }
    set width(width: Geometric2) {
        this.width_.unlock(this.widthLock_);
        this.width_.copy(width);
        this.widthLock_ = this.width_.lock();
        this.updateInertiaTensor();
    }

    get height(): Geometric2 {
        return this.height_;
    }
    set height(height: Geometric2) {
        this.height_.unlock(this.heightLock_);
        this.height_.copy(height);
        this.heightLock_ = this.height_.lock();
        this.updateInertiaTensor();
    }

    /**
     * The angular velocity is updated from the angular momentum.
     * Ω = 12 * L * (1/M) * 1 / (h^2+w^2)
     */
    public updateAngularVelocity(): void {
        // TODO: If we have already computer the inertia tensor, why do we compute it again?
        // RigidBody2 provides an optimized implementation.
        const w = this.width_;
        const h = this.height_;
        const ww = w.a * w.a;
        const hh = h.a * h.a;
        const k = 12 / this.M.a;
        this.Ω.xy = k * this.L.xy / (ww + hh);  // Ω = 12 * L * (1/M) * 1/(h^2+w^2)
        this.Ω.uom = Unit.div(Unit.div(this.L.uom, this.M.uom), Unit.mul(w.uom, w.uom));    // (L / M) * (1/w^2)
    }

    /**
     * Whenever the mass or the dimensions change, we must update the inertia tensor.
     * L = J(Ω) = (1/12) * M * (h^2 + w^2) * Ω
     */
    protected updateInertiaTensor(): void {
        const w = this.width_;
        const h = this.height_;
        const ww = w.a * w.a;
        const hh = h.a * h.a;
        const I = this.M.a * (hh + ww) / 12;
        const Iuom = Unit.mul(this.M.uom, Unit.mul(w.uom, w.uom));
        this.Iinv = new Matrix1(new Float32Array([1 / I]), Unit.div(Unit.ONE, Iuom));
    }
}
