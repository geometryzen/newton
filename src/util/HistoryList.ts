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

import { HistoryIterator } from './HistoryIterator';

/**
 * An ordered list of values that can be added to but not altered; older
 * values might be forgotten. Each value has a unique unchanging index in the HistoryList,
 * but the HistoryList can have limited capacity and old values might be dropped from the
 * HistoryList to make room for new values to be added. HistoryList contains only those
 * values whose index is between {@link #getStartIndex} and {@link #getEndIndex}
 * (inclusive).
 * 
 * Designed to represent a CircularList where new values are
 * written over old values. Therefore the starting index can change when writing a new
 * value to the list, because the new value might overwrite an old value.
 * @hidden
 */
export interface HistoryList<T> {
    /**
     * Returns the index of the ending value in this HistoryList. The ending value is
     * the newest value in this HistoryList.
     * @return {number} the index of the ending value in this HistoryList, or -1 if nothing has
     * yet been stored
     * @throws {Error} when the index number exceeds the maximum representable integer
     */
    getEndIndex(): number;

    /**
     * Returns the last value stored in this HistoryList.
     * @return {?T} the value stored at the given index, or null if this HistoryList is empty
     */
    getEndValue(): T;

    /**
     * Returns a HistoryIterator which begins at the
     * given index in this HistoryList.
     * @param index the index to start the iterator at;  if undefined or -1, then
     * starts at beginning of this HistoryList
     * @return a HistoryIterator which begins
     * at the given index in this HistoryList.
     */
    getIterator(index?: number): HistoryIterator<T>;

    /**
     * Returns the number of points currently stored in this HistoryList (which is less
     * than or equal to the capacity of this HistoryList).
     * @return {number} the number of points currently stored in this HistoryList
     */
    getSize(): number;

    /**
     * Returns the index of the starting value in this HistoryList. The starting value is
     * the oldest value in this HistoryList.
     * @return {number} the index of the starting value in this HistoryList
     * @throws {Error} when the index number exceeds the maximum representable integer
     */
    getStartIndex(): number;

    /**
     * Returns the value stored at the given index in this HistoryList.
     * @param {number} index  the index of the point of interest
     * @return {T} the value stored at the given index
     * @throws {Error} if the index is out of range
     */
    getValue(index: number): T;

    /**
     * Clears out the memory of this HistoryList, so that there are no values stored.
     * The capacity of this HistoryList is unchanged.
     */
    reset(): void;

    /**
     * Stores the given value into this HistoryList, and advances the internal pointer to
     * the next available spot in this HistoryList.
     * @param {T} value the value to store
     * @return {number} index within HistoryList where the value was stored
     * @throws {Error} when the index number exceeds the maximum representable integer
     */
    store(value: T): number;

}
