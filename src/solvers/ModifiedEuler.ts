// Copyright 2017-2021 David Holmes.  All Rights Reserved.
// Copyright 2016 Erik Neumann.  All Rights Reserved.
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

import { Unit } from '@geometryzen/multivectors';
import { mustBeNonNullObject } from '../checks/mustBeNonNullObject';
import { DiffEqSolver } from '../core/DiffEqSolver';
import { DiffEqSolverSystem } from '../core/DiffEqSolverSystem';
import { zeroArray } from '../util/zeroArray';

/**
 * The modified Euler algorithm uses the rate of change values at both
 * the beginning of the step and at the end, taking an average in order
 * to perform the integration.
 * @hidden
 */
export class ModifiedEuler implements DiffEqSolver {
    private $invals: number[] = [];
    private $inuoms: Unit[] = [];
    private $k1vals: number[] = [];
    private $k1uoms: Unit[] = [];
    private $k2vals: number[] = [];
    private $k2uoms: Unit[] = [];
    /**
     * 
     */
    constructor(private readonly system: DiffEqSolverSystem) {
        mustBeNonNullObject('system', system);
    }
    step(stepSize: number, uomStep?: Unit): void {
        const stateVals = this.system.getState();
        const stateUoms = this.system.getUnits();
        const N = stateVals.length;
        if (this.$invals.length !== N) {
            this.$invals = new Array(N);
            this.$inuoms = new Array(N);
            this.$k1vals = new Array(N);
            this.$k1uoms = new Array(N);
            this.$k2vals = new Array(N);
            this.$k2uoms = new Array(N);
        }
        const invals = this.$invals;
        const inuoms = this.$inuoms;
        const k1vals = this.$k1vals;
        const k1uoms = this.$k1uoms;
        const k2vals = this.$k2vals;
        const k2uoms = this.$k2uoms;
        // evaluate at time t
        for (let i = 0; i < N; i++) {
            invals[i] = stateVals[i];
            inuoms[i] = stateUoms[i];
        }
        zeroArray(k1vals);
        this.system.evaluate(invals, inuoms, k1vals, k1uoms, 0, uomStep);
        // evaluate at time t+stepSize
        for (let i = 0; i < N; i++) {
            if (stateVals[i] !== 0) {
                inuoms[i] = Unit.compatible(stateUoms[i], Unit.mul(k1uoms[i], uomStep));
            }
            else {
                inuoms[i] = Unit.mul(k1uoms[i], uomStep);
            }
            invals[i] = stateVals[i] + k1vals[i] * stepSize;
        }
        zeroArray(k2vals);
        this.system.evaluate(invals, inuoms, k2vals, k2uoms, stepSize, uomStep);
        for (let i = 0; i < N; i++) {
            if (stateVals[i] !== 0) {
                if (k2vals[i] !== 0) {
                    stateUoms[i] = Unit.compatible(stateUoms[i], Unit.mul(k2uoms[i], uomStep));
                }
                else {
                    // Do nothing.
                }
            }
            else {
                stateUoms[i] = Unit.mul(k2uoms[i], uomStep);
            }
            stateVals[i] += (k1vals[i] + k2vals[i]) * stepSize / 2;
        }
        this.system.setState(stateVals);
        this.system.setUnits(stateUoms);
    }
}
