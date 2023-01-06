// Copyright 2017 David Holmes.  All Rights Reserved.
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

/**
 * @hidden
 * @param arg1 
 * @param arg2 
 * @param epsilon 
 * @param magnitude 
 * @returns 
 */
export function veryDifferent(arg1: number, arg2: number, epsilon = 1E-14, magnitude = 1): boolean {
    if (epsilon <= 0) {
        throw new Error(`epsilon (${epsilon}) must be positive.`);
    }
    if (magnitude <= 0) {
        throw new Error(`magnitude (${magnitude}) must be positive.`);
    }
    const maxArg = Math.max(Math.abs(arg1), Math.abs(arg2));
    const max = maxArg > magnitude ? maxArg : magnitude;
    return Math.abs(arg1 - arg2) > max * epsilon;
}
