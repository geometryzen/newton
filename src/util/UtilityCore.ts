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
 */
export class UtilityCore {
    /**
     * Maximum representable integer.
     * Need to avoid having an index ever reach this value because we can then
     * no longer increment by 1.
     * That is:  2^53 + 1 == 2^53 because of how floating point works.
     */
    static MAX_INTEGER = Math.pow(2, 53);
}
