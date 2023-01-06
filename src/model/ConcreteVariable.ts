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
import { VarsList } from '../core/VarsList';
import { toName } from '../util/toName';
import { validName } from '../util/validName';
import { Variable } from './Variable';

/**
 * @hidden
 */
export class ConcreteVariable implements Variable {

    /**
     * 
     */
    private $value = 0;

    /**
     *
     */
    private $uom: Unit = Unit.ONE;

    /**
     * 
     */
    private name_: string;

    /**
     * Sequence numbers, to detect discontinuity in a variable.
     */
    private seq_ = 0;

    /**
     * 
     */
    private isComputed_ = false;

    /**
     * 
     */
    private doesBroadcast_ = false;

    /**
     * 
     */
    constructor(private varsList_: VarsList, name: string) {
        this.name_ = validName(toName(name));
    }

    getBroadcast(): boolean {
        return this.doesBroadcast_;
    }

    /**
     * 
     */
    get name(): string {
        return this.name_;
    }

    getSequence(): number {
        return this.seq_;
    }

    /**
     * 
     */
    getSubject(): VarsList {
        return this.varsList_;
    }

    /**
     * 
     */
    getValue(): number {
        return this.$value;
    }

    getUnit(): Unit {
        return this.$uom;
    }

    nameEquals(name: string): boolean {
        return this.name_ === toName(name);
    }

    setBroadcast(value: boolean): void {
        this.doesBroadcast_ = value;
    }

    setComputed(value: boolean) {
        this.isComputed_ = value;
    }

    get isComputed() {
        return this.isComputed_;
    }

    setUnit(uom: Unit): void {
        this.$uom = uom;
    }

    /**
     * 
     */
    setValueJump(value: number): void {
        if (this.$value !== value) {
            this.$value = value;
            this.seq_++;
            if (this.doesBroadcast_) {
                this.varsList_.broadcast(this);
            }
        }
    }

    setValueContinuous(value: number): void {
        this.$value = value;
    }

    /**
     * 
     */
    incrSequence(): void {
        this.seq_++;
    }
}
