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

import { Observer } from './Observer';
import { Subject } from './Subject';
import { SubjectEvent } from './SubjectEvent';

/**
 * Observes a Subject; when the Subject broadcasts a SubjectEvent then this executes a specified function.
 * @hidden
 */
export class GenericObserver implements Observer {
    private subject_: Subject;
    private observeFn_: (event: SubjectEvent) => unknown;
    /**
     * @param subject the Subject to observe
     * @param observeFn  function to execute when a SubjectEvent is broadcast by Subject
     */
    constructor(subject: Subject, observeFn: (event: SubjectEvent) => unknown) {
        this.subject_ = subject;
        subject.addObserver(this);
        this.observeFn_ = observeFn;
    }

    /**
     * Disconnects this GenericObserver from the Subject.
     */
    disconnect(): void {
        this.subject_.removeObserver(this);
    }

    observe(event: SubjectEvent): void {
        this.observeFn_(event);
    }

}
