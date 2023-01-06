import { mustBeNonNullObject } from '../checks/mustBeNonNullObject';
import { AbstractSubject } from '../util/AbstractSubject';
import { contains } from '../util/contains';
import { GenericEvent } from '../util/GenericEvent';
import { remove } from '../util/remove';
import { SimObject } from './SimObject';

/**
 * @hidden
 */
export class SimList extends AbstractSubject {

    /**
     * 
     */
    static OBJECT_ADDED = 'OBJECT_ADDED';

    /**
     * 
     */
    static OBJECT_REMOVED = 'OBJECT_REMOVED';

    /**
     * 
     */
    private $elements: SimObject[] = [];

    /**
     * 
     */
    constructor() {
        super();
    }

    /**
     * 
     */
    add(element: SimObject): void {
        mustBeNonNullObject('element', element);
        if (!contains(this.$elements, element)) {
            this.$elements.push(element);
            this.broadcast(new GenericEvent(this, SimList.OBJECT_ADDED, element));
        }
    }

    /**
     * 
     */
    forEach(callBack: (simObject: SimObject, index: number) => unknown): void {
        return this.$elements.forEach(callBack);
    }

    /**
     * 
     */
    remove(simObject: SimObject): void {
        if (remove(this.$elements, simObject)) {
            this.broadcast(new GenericEvent(this, SimList.OBJECT_REMOVED, simObject));
        }
    }

    /**
     * Removes SimObjects from this SimList whose *expiration time* is less than the given time.
     * Notifies Observers by broadcasting the `OBJECT_REMOVED` event for each SimObject removed.
     * @param time the current simulation time
     */
    removeTemporary(time: number): void {
        for (let i = this.$elements.length - 1; i >= 0; i--) {
            const simobj = this.$elements[i];
            if (simobj.expireTime < time) {
                this.$elements.splice(i, 1);
                this.broadcast(new GenericEvent(this, SimList.OBJECT_REMOVED, simobj));
            }
        }
    }
}
