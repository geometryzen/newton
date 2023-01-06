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
export class ClockTask {

    /**
     * 
     */
    private timeoutID_ = NaN;

    /**
     * 
     */
    constructor(private time_: number, private callBack_: () => unknown) {
        // Do nothing yet.
    }

    /** 
     * Cancels the scheduled execution of this task.
     */
    cancel(): void {
        if (isFinite(this.timeoutID_)) {
            clearTimeout(this.timeoutID_);
            this.timeoutID_ = NaN;
        }
    }

    /**
     * Returns the clock time in seconds when the task should be executed.
     */
    getTime() {
        return this.time_;
    }

    /** 
     * Schedules the task to be executed after given time delay in seconds of system time.
     * @param delay time delay till execution in seconds of system time
     */
    schedule(delay: number) {
        this.cancel();
        const delay_ms = Math.round(delay * 1000);
        this.timeoutID_ = window.setTimeout(this.callBack_, delay_ms);
    }
}
