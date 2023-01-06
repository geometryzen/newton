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

import { AbstractSubject } from '../util/AbstractSubject';
import { GenericEvent } from '../util/GenericEvent';
import getSystemTime from '../util/getSystemTime';
import { ClockTask } from './ClockTask';

/**
 * @hidden
 */
export class Clock extends AbstractSubject {
    /**
     * When 'zero clock time' occurs, in system time, in seconds.
     */
    private clockStart_sys_secs_ = getSystemTime();
    // private realStart_sys_secs_: number;
    /**
     * Whether clock time is advancing.
     */
    private isRunning_ = false;
    /**
     * Remembers clock time while clock is stopped, in seconds.
     */
    private saveTime_secs_ = 0;
    /**
     * Remembers the real time while clock is stopped, in seconds.
     */
    private saveRealTime_secs_ = 0;
    /**
     * Means we are currently in single-step mode: clock time has advanced even though clock is paused.
     */
    // private stepMode_ = false;
    /**
     * 
     */
    private tasks_: ClockTask[] = [];
    /**
     * Rate at which clock time advances compared to system time.
     */
    private timeRate_ = 1;
    /**
     * 
     */
    static CLOCK_RESUME = 'CLOCK_RESUME';
    /**
     * 
     */
    static CLOCK_SET_TIME = 'CLOCK_SET_TIME';
    /**
     * 
     */
    constructor() {
        super();
        // this.realStart_sys_secs_ = this.clockStart_sys_secs_;
    }
    /**
     * Called during *step mode*, this indicates that the client has advanced the Simulation to match the clock time.
     */
    clearStepMode() {
        // this.stepMode_ = false;
    }

    getTime(): number {
        if (this.isRunning_) {
            return (getSystemTime() - this.clockStart_sys_secs_) * this.timeRate_;
        }
        else {
            return this.saveTime_secs_;
        }
    }
    /**
     * Resumes increasing clock time and real time.
     * Schedules all ClockTasks that should run at or after the current clock time.
     * Broadcasts a {@link #CLOCK_RESUME} event.
     */
    resume(): void {
        this.clearStepMode();
        if (!this.isRunning_) {
            this.isRunning_ = true;
            this.setTimePrivate(this.saveTime_secs_);
            this.setRealTime(this.saveRealTime_secs_);
            this.broadcast(new GenericEvent(this, Clock.CLOCK_RESUME));
        }
    }

    /**
     * 
     */
    setTime(time_secs: number): void {
        this.setTimePrivate(time_secs);
        this.broadcast(new GenericEvent(this, Clock.CLOCK_SET_TIME));
    }

    /**
     * 
     */
    private setTimePrivate(time_secs: number) {
        if (this.isRunning_) {
            this.clockStart_sys_secs_ = getSystemTime() - time_secs / this.timeRate_;

            this.scheduleAllClockTasks();
        }
        else {
            this.saveTime_secs_ = time_secs;
        }
    }

    /**
     * 
     */
    private scheduleAllClockTasks(): void {
        this.tasks_.forEach((task) => {
            this.scheduleTask(task);
        });
    }

    /**
     * 
     */
    private scheduleTask(task: ClockTask) {
        task.cancel();
        if (this.isRunning_) {
            // convert to system time to handle time rate other than 1.0
            const nowTime = this.clockToSystem(this.getTime());
            const taskTime = this.clockToSystem(task.getTime());
            if (taskTime >= nowTime) {
                task.schedule(taskTime - nowTime);
            }
        }
    }

    /**
     * Sets the real time to the given time in seconds.
     */
    setRealTime(time_secs: number): void {
        if (this.isRunning_) {
            // this.realStart_sys_secs_ = getSystemTime() - time_secs / this.timeRate_;
        }
        else {
            this.saveRealTime_secs_ = time_secs;
        }
    }

    /** 
     * Converts clock time to system time.
     */
    clockToSystem(clockTime: number): number {
        return clockTime / this.timeRate_ + this.clockStart_sys_secs_;
    }
}
