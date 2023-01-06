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
import { Block3 } from './Block3';

const KILOGRAM = Unit.KILOGRAM;
const METER = Unit.METER;
// const SECOND = Unit.SECOND;
// const MOTION = KILOGRAM.mul(METER).div(SECOND);

describe("Block3", function () {
    describe("updateAngularVelocity", function () {
        it("should accurately update Ω", function () {
            const body = new Block3(Geometric3.scalar(2), Geometric3.scalar(3), Geometric3.scalar(5));
            const w = body.width;
            const h = body.height;
            const d = body.depth;
            const ww = w.a * w.a;
            const hh = h.a * h.a;
            const dd = d.a * d.a;
            body.M = Geometric3.scalar(Math.random());
            body.L.yz = 0;
            body.L.zx = 0;
            body.L.xy = 1;
            body.updateAngularVelocity();
            expect(body.Ω.yz).toBe((12 / body.M.a) * body.L.yz / (hh + dd));
            expect(body.Ω.zx).toBe((12 / body.M.a) * body.L.zx / (ww + dd));
            expect(body.Ω.xy).toBe((12 / body.M.a) * body.L.xy / (ww + hh));
        });
    });
    describe("moment of inertia tensor", function () {
        // Set random block dimensions in the constructor but override later.
        const body = new Block3(Geometric3.scalar(Math.random(), METER));

        body.width = Geometric3.scalar(4, METER);
        body.height = Geometric3.scalar(3, METER);
        body.depth = Geometric3.scalar(5, METER);
        body.M = Geometric3.scalar(12, KILOGRAM);

        it("should be a scaled identity matrix", function () {
            const w = body.width.a;
            const h = body.height.a;
            const d = body.depth.a;
            expect(body.I.getElement(0, 0)).toBe(h * h + d * d);
            expect(body.I.getElement(0, 1)).toBe(0);
            expect(body.I.getElement(0, 2)).toBe(0);
            expect(body.I.getElement(1, 0)).toBe(0);
            expect(body.I.getElement(1, 1)).toBe(w * w + d * d);
            expect(body.I.getElement(1, 2)).toBe(0);
            expect(body.I.getElement(2, 0)).toBe(0);
            expect(body.I.getElement(2, 1)).toBe(0);
            expect(body.I.getElement(2, 2)).toBe(w * w + h * h);
        });
        it("M", function () {
            expect(body.I.uom.dimensions.M.numer).toBe(1);
            expect(body.I.uom.dimensions.M.denom).toBe(1);
        });
        it("L", function () {
            expect(body.I.uom.dimensions.L.numer).toBe(2);
            expect(body.I.uom.dimensions.L.denom).toBe(1);
        });
        it("T", function () {
            expect(body.I.uom.dimensions.T.numer).toBe(0);
            expect(body.I.uom.dimensions.T.denom).toBe(1);
        });
        it("Q", function () {
            expect(body.I.uom.dimensions.Q.numer).toBe(0);
            expect(body.I.uom.dimensions.Q.denom).toBe(1);
        });
    });
});
