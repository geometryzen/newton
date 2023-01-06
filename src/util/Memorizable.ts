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
 * An object that memorizes simulation data or performs some other function that needs
 * to happen regularly. The `memorize` method is meant to be called after each simulation
 * time step.
 * See MemoList for how to add a Memorizable
 * object to the list of those that will be called.
 * @hidden
 */
export interface Memorizable {
    /**
     * Memorize the current simulation data or do some other function.
     */
    memorize(): void;

}
