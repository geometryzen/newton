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

import { HistoryIterator } from './HistoryIterator';
import { HistoryList } from './HistoryList';
import { UtilityCore } from './UtilityCore';

/**
 * @hidden
 */
const MAX_INDEX_ERROR = 'exceeded max int';

/**
 * @hidden
 */
export class CircularList<T> implements HistoryList<T> {
    /**
     * capacity of the list, maximum size
     */
    private capacity_: number;
    /**
     * number of items now in memory list <= capacity
     */
    size_ = 0;
    /**
     * number of times the list has been overwritten
     */
    private cycles_ = 0;
    /**
     * pointer to next entry in list;  oldest entry if list has wrapped around.
     */
    private nextPtr_ = 0;
    /**
     * pointer to newest entry: index of last entry written to list or -1 if never written.
     */
    private lastPtr_ = -1;
    /**
     * values stored.
     */
    values_: Array<T>;
    /**
     * last value written to memory list
     */
    // private lastValue_: T;
    /**
     * 
     */
    constructor(capacity = 3000) {
        this.capacity_ = capacity || 3000;
        if (this.capacity_ < 2) {
            throw new Error();
        }
        this.size_ = 0;
        this.cycles_ = 0;
        this.nextPtr_ = 0;
        this.lastPtr_ = -1;
        this.values_ = new Array(this.capacity_);
        // this.lastValue_ = null;
    }

    /**
     * Causes the MAX_INDEX_ERROR exception to occur in near future by setting
     * the number of cycles to be near the maximum allowed, for testing.
     */
    causeMaxIntError(): void {
        this.size_ = this.capacity_;
        this.cycles_ = Math.floor(UtilityCore.MAX_INTEGER / this.capacity_) - 1;
    }

    /**
     * 
     */
    getEndIndex(): number {
        if (this.size_ === 0) {
            return -1;
        }
        let idx;
        if (this.nextPtr_ === 0)
            idx = this.pointerToIndex(this.size_ - 1);
        else
            idx = this.pointerToIndex(this.nextPtr_ - 1);
        return idx;
    }

    /**
     * 
     */
    getEndValue() {
        const idx = this.getEndIndex();
        return idx === -1 ? null : this.values_[this.indexToPointer_(idx)];
    }

    /**
     * 
     */
    getIterator(index: number): HistoryIterator<T> {
        return new CircularListIterator(this, index);
    }

    getSize() {
        return this.size_;
    }

    getStartIndex() {
        const idx = (this.size_ < this.capacity_) ? 0 : this.pointerToIndex(this.nextPtr_);
        return idx;
    }

    getValue(index: number) {
        const i = this.indexToPointer_(index);
        return this.values_[i];
    }

    /**
     * Converts an index (which includes cycles) into a pointer.
     * Pointer and index are the same until the list fills and 'wraps around'.
     * @param index the index number, which can be larger than the size of the list
     * @return the pointer to the corresponding point in the list
     */
    indexToPointer_(index: number): number {
        if (this.size_ < this.capacity_)
            return index;
        const p = index % this.capacity_;
        const idx = index - (this.cycles_ - (p < this.nextPtr_ ? 0 : 1)) * this.capacity_;
        return idx;
    }

    /**
     * Converts a pointer into the list to an index number that includes cycles.
     * Pointer and index are the same until the list fills and 'wraps around'.
     * @throws when the index number exceeds the maximum representable integer
     * @param pointer an index from 0 to size
     * @return the index number of this point including cycles
     */
    private pointerToIndex(pointer: number): number {
        if (this.size_ < this.capacity_)
            return pointer;
        const idx = pointer +
            (this.cycles_ - (pointer < this.nextPtr_ ? 0 : 1)) * this.capacity_;
        if (idx >= UtilityCore.MAX_INTEGER)
            throw new Error(MAX_INDEX_ERROR);
        return idx;
    }

    reset(): void {
        this.nextPtr_ = this.size_ = 0;  // clear out the memory
        this.cycles_ = 0;
        this.lastPtr_ = -1;
    }

    store(value: T): number {
        this.lastPtr_ = this.nextPtr_;
        this.values_[this.nextPtr_] = value;
        this.nextPtr_++;
        if (this.size_ < this.capacity_)
            this.size_++;
        if (this.nextPtr_ >= this.capacity_) {  // wrap around at end
            this.cycles_++;
            this.nextPtr_ = 0;
        }
        return this.pointerToIndex(this.lastPtr_);
    }
}

/**
 * @hidden
 */
class CircularListIterator<T> implements HistoryIterator<T> {

    /**
     * 
     */
    private cList_: CircularList<T>;

    /**
     * Flag indicates we are at start of the iteration.
     */
    private first_: boolean;

    /**
     * 
     */
    private index_: number;

    /**
     * 
     */
    private pointer_: number;

    /**
     * @param cList the CircularList to iterate over
     * @param startIndex  the index to start the iteration at; undefined or -1 will start at oldest entry
     */
    constructor(cList: CircularList<T>, startIndex: number) {
        this.first_ = cList.size_ > 0;
        this.cList_ = cList;
        if (startIndex === undefined || startIndex < 0) {
            startIndex = cList.getStartIndex();
        }
        // Allow making iterator on empty CircularList, but if non-empty require the starting
        // index to be in range.
        if (cList.size_ > 0 &&
            (startIndex < cList.getStartIndex() || startIndex > cList.getEndIndex())) {
            throw new Error('out of range startIndex=' + startIndex);
        }
        this.index_ = startIndex;
        this.pointer_ = cList.indexToPointer_(startIndex);
    }

    getIndex() {
        if (this.cList_.size_ === 0) {
            throw new Error('no data');
        }
        return this.index_;
    }

    getValue() {
        if (this.cList_.size_ === 0) {
            throw new Error('no data');
        }
        return this.cList_.values_[this.pointer_];
    }

    hasNext() {
        return this.first_ || this.index_ < this.cList_.getEndIndex();
    }

    hasPrevious() {
        return this.first_ || this.index_ > this.cList_.getStartIndex();
    }

    nextValue() {
        if (this.cList_.size_ === 0)
            throw new Error('no data');
        if (this.first_) {
            // first 'nextPoint' does nothing except clear this flag
            this.first_ = false;
        }
        else {
            if (this.index_ + 1 > this.cList_.getEndIndex()) {
                throw new Error('cannot iterate past end of list');
            }
            this.index_++;
            this.pointer_ = this.cList_.indexToPointer_(this.index_);
        }
        return this.cList_.values_[this.pointer_];
    }

    previousValue() {
        if (this.cList_.size_ === 0)
            throw new Error('no data');
        if (this.first_) {
            // first 'previousPoint' does nothing except clear this flag
            this.first_ = false;
        }
        else {
            if (this.index_ - 1 < this.cList_.getStartIndex()) {
                throw new Error('cannot iterate prior to start of list');
            }
            this.index_--;
            this.pointer_ = this.cList_.indexToPointer_(this.index_);
        }
        return this.cList_.values_[this.pointer_];
    }
}

