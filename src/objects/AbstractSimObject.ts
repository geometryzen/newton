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

import { SimObject } from '../core/SimObject';

/**
 *
 */
export class AbstractSimObject implements SimObject {
    /**
     * 
     */
    private expireTime_ = Number.POSITIVE_INFINITY;

    /**
     * 
     */
    constructor() {
        // Do nothing yet.
    }

    /**
     * 
     */
    get expireTime(): number {
        return this.expireTime_;
    }
    set expireTime(expireTime: number) {
        this.expireTime_ = expireTime;
    }
}
