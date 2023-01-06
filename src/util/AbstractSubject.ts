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

import clone from './clone';
import { contains } from './contains';
import find from './find';
import { Observer } from './Observer';
import { Parameter } from './Parameter';
import { ParameterBoolean } from './ParameterBoolean';
import { ParameterNumber } from './ParameterNumber';
import { ParameterString } from './ParameterString';
import { remove } from './remove';
import { Subject } from './Subject';
import { SubjectEvent } from './SubjectEvent';
import { toName } from './toName';

/**
 * @hidden 
 */
export class AbstractSubject implements Subject {

    /**
     * 
     */
    private doBroadcast_ = true;

    /**
     * 
     */
    private observers_: Observer[] = [];
    /**
     * 
     */
    private paramList_: Parameter[] = [];

    /**
     * @hidden
     * @param observer 
     */
    addObserver(observer: Observer): void {
        if (!contains(this.observers_, observer)) {
            this.observers_.push(observer);
        }
    }

    /**
     * @hidden
     * @param observer
     */
    removeObserver(observer: Observer): void {
        remove(this.observers_, observer);
    }

    /**
     * Adds the Parameter to the list of this Subject's available Parameters.
     * @param parameter the Parameter to add
     * @hidden
     */
    addParameter(parameter: Parameter): void {
        const name = parameter.name;
        const p = this.getParam(name);
        if (p != null) {
            throw new Error('parameter ' + name + ' already exists: ' + p);
        }
        this.paramList_.push(parameter);
    }

    /**
     * Returns the Parameter with the given name, or null if not found
     * @param name name of parameter to search for
     * @return the Parameter with the given name, or null if not found
     */
    private getParam(name: string): Parameter {
        name = toName(name);
        return find(this.paramList_, function (p) {
            return p.name === name;
        });
    }

    /**
     * 
     * @param name 
     * @returns
     * @hidden
     */
    getParameter(name: string): Parameter {
        const p = this.getParam(name);
        if (p != null) {
            return p;
        }
        throw new Error('Parameter not found ' + name);
    }

    /**
     * 
     * @param name 
     * @returns
     * @hidden
     */
    getParameterBoolean(name: string): ParameterBoolean {
        const p = this.getParam(name);
        if (p instanceof ParameterBoolean) {
            return p;
        }
        throw new Error('ParameterBoolean not found ' + name);
    }

    /**
     * 
     * @param name 
     * @returns 
     * @hidden
     */
    getParameterNumber(name: string): ParameterNumber {
        const p = this.getParam(name);
        if (p instanceof ParameterNumber) {
            return p;
        }
        throw new Error('ParameterNumber not found ' + name);
    }

    /**
     * 
     * @param name 
     * @returns
     * @hidden
     */
    getParameterString(name: string): ParameterString {
        const p = this.getParam(name);
        if (p instanceof ParameterString) {
            return p;
        }
        throw new Error('ParameterString not found ' + name);
    }

    /**
     * 
     * @returns
     * @hidden
     */
    getParameters(): Parameter[] {
        return clone(this.paramList_);
    }

    /**
     * 
     * @param event
     * @hidden
     */
    broadcast(event: SubjectEvent): void {
        if (this.doBroadcast_) {
            const len = this.observers_.length;
            for (let i = 0; i < len; i++) {
                this.observers_[i].observe(event);
            }
        }
    }

    /**
     * 
     * @param name
     * @hidden
     */
    broadcastParameter(name: string): void {
        const p = this.getParam(name);
        if (p === null) {
            throw new Error('unknown Parameter ' + name);
        }
        this.broadcast(p);
    }

    /**
     * Returns whether this Subject is broadcasting events.
     * @return {boolean} whether this Subject is broadcasting events
     * @hidden
     */
    protected getBroadcast(): boolean {
        return this.doBroadcast_;
    }

    /**
     * @hidden
     */
    getObservers(): Observer[] {
        return clone(this.observers_);
    }
}
