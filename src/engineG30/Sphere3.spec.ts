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
import { Sphere3 } from './Sphere3';

/**
 * @hidden
 */
const KILOGRAM = Unit.KILOGRAM;
/**
 * @hidden
 */
const METER = Unit.METER;
/**
 * @hidden
 */
const SECOND = Unit.SECOND;
/**
 * @hidden
 */
const MOTION = KILOGRAM.mul(METER).div(SECOND);

describe("Sphere3", function () {
    describe("updateAngularVelocity", function () {
        it("dimensionless should accurately update Ω", function () {
            const body = new Sphere3(Geometric3.scalar(1 - 0.5 * Math.random()));
            body.M = Geometric3.scalar(1 + Math.random());
            body.L.yz = Math.random();
            body.L.zx = Math.random();
            body.L.xy = Math.random();

            const r = body.radius;
            const s = 5 / (2 * body.M.a * r.a * r.a);
            body.updateAngularVelocity();
            expect(body.Ω.yz).toBeCloseTo(body.L.yz * s, 14);
            expect(body.Ω.zx).toBeCloseTo(body.L.zx * s, 14);
            expect(body.Ω.xy).toBeCloseTo(body.L.xy * s, 14);
            // expect(body.Ω.uom).toBeUndefined();
        });
        describe("dimensioned should accurately update Ω", function () {
            const body = new Sphere3(Geometric3.scalar(1 - 0.5 * Math.random(), METER));
            body.M = Geometric3.scalar(1 + Math.random(), KILOGRAM);
            body.L = Geometric3.bivector(Math.random(), Math.random(), Math.random(), MOTION.mul(METER));

            const r = body.radius;
            const s = 5 / (2 * body.M.a * r.a * r.a);
            body.updateAngularVelocity();
            it("should compute coordinates correctly", function () {
                expect(body.Ω.yz).toBeCloseTo(body.L.yz * s, 14);
                expect(body.Ω.zx).toBeCloseTo(body.L.zx * s, 14);
                expect(body.Ω.xy).toBeCloseTo(body.L.xy * s, 14);
                expect(body.Ω.uom.multiplier).toBe(1);
            });
            it("M", function () {
                expect(body.Ω.uom.dimensions.M.numer).toBe(0);
                expect(body.Ω.uom.dimensions.M.denom).toBe(1);
            });
            it("L", function () {
                expect(body.Ω.uom.dimensions.L.numer).toBe(0);
                expect(body.Ω.uom.dimensions.L.denom).toBe(1);
            });
            it("T", function () {
                expect(body.Ω.uom.dimensions.T.numer).toBe(-1);
                expect(body.Ω.uom.dimensions.T.denom).toBe(1);
            });
            it("Q", function () {
                expect(body.Ω.uom.dimensions.Q.numer).toBe(0);
                expect(body.Ω.uom.dimensions.Q.denom).toBe(1);
            });
        });
    });
    describe("moment of inertia tensor", function () {
        // Set a random radius in the constructor but override later.
        const body = new Sphere3(Geometric3.scalar(Math.random(), METER));

        body.radius = Geometric3.scalar(7, METER);
        body.M = Geometric3.scalar(5, KILOGRAM);

        it("should be a scaled identity matrix", function () {
            expect(body.I.getElement(0, 0)).toBe(98);
            expect(body.I.getElement(0, 1)).toBe(0);
            expect(body.I.getElement(0, 2)).toBe(0);
            expect(body.I.getElement(1, 0)).toBe(0);
            expect(body.I.getElement(1, 1)).toBe(98);
            expect(body.I.getElement(1, 2)).toBe(0);
            expect(body.I.getElement(2, 0)).toBe(0);
            expect(body.I.getElement(2, 1)).toBe(0);
            expect(body.I.getElement(2, 2)).toBe(98);
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
