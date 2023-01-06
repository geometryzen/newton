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
 * A differential equation solver that achieves O(h cubed) Local Truncation Error (LTE),
 * where h is the step size.
 * @hidden
 */
export class RungeKutta implements DiffEqSolver {
    private invals: number[] = [];
    private inuoms: Unit[] = [];
    private k1vals: number[] = [];
    private k1uoms: Unit[] = [];
    private k2vals: number[] = [];
    private k2uoms: Unit[] = [];
    private k3vals: number[] = [];
    private k3uoms: Unit[] = [];
    private k4vals: number[] = [];
    private k4uoms: Unit[] = [];

    /**
     * Constructs a differential equation solver (integrator) that uses the classical Runge-Kutta method.
     * @param system The model that provides the system state and computes rates of change.
     */
    constructor(private readonly system: DiffEqSolverSystem) {
        mustBeNonNullObject('system', system);
    }

    /**
     * 
     */
    step(stepSize: number, uomStep?: Unit): void {
        const system = this.system;
        const stateVals = system.getState();
        const stateUoms = system.getUnits();
        const N = stateVals.length;
        if (this.invals.length < N) {
            this.invals = new Array(N);
            this.inuoms = new Array(N);
            this.k1vals = new Array(N);
            this.k1uoms = new Array(N);
            this.k2vals = new Array(N);
            this.k2uoms = new Array(N);
            this.k3vals = new Array(N);
            this.k3uoms = new Array(N);
            this.k4vals = new Array(N);
            this.k4uoms = new Array(N);
        }
        const invals = this.invals;
        const inuoms = this.inuoms;
        const k1vals = this.k1vals;
        const k1uoms = this.k1uoms;
        const k2vals = this.k2vals;
        const k2uoms = this.k2uoms;
        const k3vals = this.k3vals;
        const k3uoms = this.k3uoms;
        const k4vals = this.k4vals;
        const k4uoms = this.k4uoms;

        // evaluate at time t
        for (let i = 0; i < N; i++) {
            invals[i] = stateVals[i];
            inuoms[i] = stateUoms[i];
        }
        zeroArray(k1vals);
        system.evaluate(invals, inuoms, k1vals, k1uoms, 0, uomStep);

        // evaluate at time t + stepSize / 2
        for (let i = 0; i < N; i++) {
            if (i > 10 && !Unit.isOne(uomStep)) {
                if (Unit.isOne(k1uoms[i]) && k1vals[i] !== 0) {
                    throw new Error(`i=${i}, stateVals[${i}]=${stateVals[i]}, stateUoms[${i}]=${stateUoms[i]}, k1vals[${i}]=${k1vals[i]}, k1uoms[${i}]=${k1uoms[i]}, uomStep=${uomStep}`);
                }
            }
            const uom = Unit.mul(k1uoms[i], uomStep);
            if (stateVals[i] !== 0) {
                try {
                    if (k1vals[i] !== 0) {
                        inuoms[i] = Unit.compatible(stateUoms[i], uom);
                    }
                    else {
                        inuoms[i] = uom;
                    }
                }
                catch (e) {
                    const cause = (e instanceof Error) ? e.message : `${e}`;
                    throw new Error(`${system.getVariableName(i)}. Cause: ${cause}`);
                    // It would be good to translate the index into a variable name.
                    // system.getVariableName(i);
                    // throw new Error(`i=${i}, stateVals[${i}]=${stateVals[i]}, stateUoms[${i}]=${stateUoms[i]}, k1vals[${i}]=${k1vals[i]}, k1uoms[${i}]=${k1uoms[i]}, uomStep=${uomStep}. Cause: ${e}`);
                }
            }
            else {
                inuoms[i] = uom;
            }
            invals[i] = stateVals[i] + k1vals[i] * stepSize / 2;
        }
        zeroArray(k2vals);
        system.evaluate(invals, inuoms, k2vals, k2uoms, stepSize / 2, uomStep);

        // evaluate at time t + stepSize / 2
        for (let i = 0; i < N; i++) {
            const uom = Unit.mul(k2uoms[i], uomStep);
            if (stateVals[i] !== 0) {
                try {
                    if (k2vals[i] !== 0) {
                        inuoms[i] = Unit.compatible(stateUoms[i], uom);
                    }
                    else {
                        inuoms[i] = uom;
                    }
                }
                catch (e) {
                    throw new Error(`i=${i}, stateVals[${i}]=${stateVals[i]}, stateUoms[${i}]=${stateUoms[i]}, k2vals[${i}]=${k2vals[i]}, k2uoms[${i}]=${k2uoms[i]}, uomStep=${uomStep}. Cause: ${e}`);
                }
            }
            else {
                inuoms[i] = uom;
            }
            invals[i] = stateVals[i] + k2vals[i] * stepSize / 2;
        }
        zeroArray(k3vals);
        system.evaluate(invals, inuoms, k3vals, k3uoms, stepSize / 2, uomStep);

        // evaluate at time t + stepSize
        for (let i = 0; i < N; i++) {
            const uom = Unit.mul(k3uoms[i], uomStep);
            if (stateVals[i] !== 0) {
                try {
                    if (k3vals[i] !== 0) {
                        inuoms[i] = Unit.compatible(stateUoms[i], uom);
                    }
                    else {
                        // inuoms[i] = stateUoms[i];
                        inuoms[i] = uom;
                    }
                }
                catch (e) {
                    throw new Error(`i=${i}, stateVals[${i}]=${stateVals[i]}, stateUoms[${i}]=${stateUoms[i]}, k3vals[${i}]=${k3vals[i]}, k3uoms[${i}]=${k3uoms[i]}, uomStep=${uomStep}. Cause: ${e}`);
                }
            }
            else {
                inuoms[i] = uom;
            }
            invals[i] = stateVals[i] + k3vals[i] * stepSize;
        }
        zeroArray(k4vals);
        system.evaluate(invals, inuoms, k4vals, k4uoms, stepSize, uomStep);

        for (let i = 0; i < N; i++) {
            const uom = Unit.mul(k4uoms[i], uomStep);
            if (stateVals[i] !== 0) {
                try {
                    if (k4vals[i] !== 0) {
                        stateUoms[i] = Unit.compatible(stateUoms[i], uom);
                    }
                    else {
                        // Do nothing.
                        stateUoms[i] = uom;
                    }
                }
                catch (e) {
                    throw new Error(`i=${i}, stateVals[${i}]=${stateVals[i]}, stateUoms[${i}]=${stateUoms[i]}, k4vals[${i}]=${k4vals[i]}, k4uoms[${i}]=${k4uoms[i]}, uomStep=${uomStep}. Cause: ${e}`);
                }
            }
            else {
                stateUoms[i] = uom;
            }
            stateVals[i] += (k1vals[i] + 2 * k2vals[i] + 2 * k3vals[i] + k4vals[i]) * stepSize / 6;
        }
        system.setState(stateVals);
        system.setUnits(stateUoms);
    }
}
