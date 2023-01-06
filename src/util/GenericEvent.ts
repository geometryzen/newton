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

import { Subject } from './Subject';
import { SubjectEvent } from './SubjectEvent';
import { toName } from './toName';
import { validName } from './validName';

/**
 * @hidden
 */
export class GenericEvent implements SubjectEvent {
    /**
     * 
     */
    private name_: string;
    /**
     * 
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(private subject_: Subject, name: string, _value?: unknown) {
        this.name_ = validName(toName(name));
    }

    /**
     * 
     */
    get name(): string {
        return this.name_;
    }

    /**
     * 
     */
    getSubject(): Subject {
        return this.subject_;
    }

    /**
     * 
     */
    nameEquals(name: string): boolean {
        return this.name_ === toName(name);
    }

}
