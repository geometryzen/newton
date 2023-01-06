import { Unit } from '@geometryzen/multivectors';
import isNumber from '../checks/isNumber';
import isString from '../checks/isString';
import { ConcreteVariable } from '../model/ConcreteVariable';
import { Variable } from '../model/Variable';
import { AbstractSubject } from '../util/AbstractSubject';
import clone from '../util/clone';
import extendArray from '../util/extendArray';
import find from '../util/find';
import findIndex from '../util/findIndex';
import { GenericEvent } from '../util/GenericEvent';
import { toName } from '../util/toName';
import { validName } from '../util/validName';

export class VarsList extends AbstractSubject {
    /**
     * This name cannot be used as a variable name.
     */
    private static readonly DELETED = 'DELETED';
    /**
     * This name is the reserved name for the time variable.
     */
    public static readonly TIME = 'TIME';
    /**
     * 
     */
    private static readonly VARS_MODIFIED = 'VARS_MODIFIED';
    /**
     * The zero-based index of the time variable.
     */
    private $timeIdx = -1;
    /**
     * The variables that provide the data for this wrapper.
     */
    private $variables: Variable[] = [];
    /**
     * A lazy cache of variable values to minimize creation of temporary objects.
     * This is only synchronized when the state is requested.
     */
    private readonly $values: number[] = [];
    private readonly $units: Unit[] = [];
    /**
     * Whether to save simulation state history.
     */
    private history_ = true;
    /**
     * Recent history of the simulation state for debugging.
     * An array of copies of the vars array.
     */
    private histArray_: number[][] = [];
    /**
     * Initializes the list of variables. The names argument must contain the reserved, case-insensitive, 'time' variable.
     * @param names  array of language-independent variable names;
     * these will be underscorized so the English names can be passed in here.
     */
    constructor(names: string[]) {
        super();
        // console.lg(`VarsList.constructor(names=${JSON.stringify(names)})`);
        const howMany = names.length;
        if (howMany !== 0) {
            this.addVariables(names);
        }
        // This call has the side-effect of throwing an exception if the time variable has not been defined.
        this.getTime();
    }

    /**
     * Returns index to put a contiguous group of variables.  Expands the set of variables
     * if necessary.
     * @param quantity number of contiguous variables to allocate
     * @return index of first variable
     */
    private findOpenSlot_(quantity: number): number {
        let found = 0;
        let startIdx = -1;
        for (let i = 0, n = this.$variables.length; i < n; i++) {
            if (this.$variables[i].name === VarsList.DELETED) {
                if (startIdx === -1) {
                    startIdx = i;
                }
                found++;
                if (found >= quantity) {
                    return startIdx;
                }
            }
            else {
                startIdx = -1;
                found = 0;
            }
        }
        let expand: number;
        if (found > 0) {
            // Found a group of deleted variables at end of VarsList, but need more.
            // Expand to get full quantity.
            expand = quantity - found;
        }
        else {
            // Did not find contiguous group of deleted variables of requested size.
            // Add space at end of current variables.
            startIdx = this.$variables.length;
            expand = quantity;
        }
        const newVars: ConcreteVariable[] = [];
        for (let i = 0; i < expand; i++) {
            newVars.push(new ConcreteVariable(this, VarsList.DELETED));
        }
        extendArray(this.$variables, expand, newVars);
        return startIdx;
    }

    /**
     * Add a contiguous block of variables.
     * @param names language-independent names of variables; these will be
     * underscorized so the English name can be passed in here.
     * @return index index of first Variable that was added
     * @throws if any of the variable names is 'DELETED', or array of names is empty
     */
    addVariables(names: string[]): number {
        // TODO: This is used BOTH when adding a body and when constructing the summary variables.
        // But the check for the time variable only happens for the summary variables (and could be
        // prohibited for adding a body). Additionally, the broadcast does not make sense in the constructor
        // since there would be no listeners.
        const howMany = names.length;
        if (howMany === 0) {
            throw new Error("names must not be empty.");
        }
        const position = this.findOpenSlot_(howMany);
        for (let i = 0; i < howMany; i++) {
            const name = validName(toName(names[i]));
            if (name === VarsList.DELETED) {
                throw new Error(`variable cannot be named '${VarsList.DELETED}'.`);
            }
            const idx = position + i;
            // DRY: Why aren't we delegating to this.addVariable with the newly created variable?
            this.$variables[idx] = new ConcreteVariable(this, name);
            if (name === VarsList.TIME) {
                // auto-detect time variable
                this.$timeIdx = idx;
            }
        }
        this.broadcast(new GenericEvent(this, VarsList.VARS_MODIFIED));
        return position;
    }

    /**
     * Deletes a contiguous block of variables.
     * Delete several variables, but leaves those places in the array as empty spots that
     * can be allocated in future with `addVariables`. Until an empty spot is
     * reallocated, the name of the variable at that spot has the reserved name 'DELETED' and
     * should not be used.
     * @param index index of first variable to delete
     * @param howMany number of variables to delete
     */
    deleteVariables(index: number, howMany: number): void {
        if (howMany === 0) {
            return;
        }
        if (howMany < 0 || index < 0 || index + howMany > this.$variables.length) {
            throw new Error('deleteVariables');
        }
        for (let i = index; i < index + howMany; i++) {
            this.$variables[i] = new ConcreteVariable(this, VarsList.DELETED);
        }
        this.broadcast(new GenericEvent(this, VarsList.VARS_MODIFIED));
    }

    /**
     * Increments the sequence number for the specified variable(s), which indicates a
     * discontinuity has occurred in the value of this variable. This information is used in a
     * graph to prevent drawing a line between points that have a discontinuity.
     * @param indexes  the indexes of the variables;
     * if no index given then all variable's sequence numbers are incremented
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    incrSequence(...indexes: number[]): void {
        if (arguments.length === 0) {
            // increment sequence number on all variables
            for (let i = 0, n = this.$variables.length; i < n; i++) {
                this.$variables[i].incrSequence();
            }
        }
        else {
            // increment sequence number only on specified variables
            for (let i = 0, n = arguments.length; i < n; i++) {
                // eslint-disable-next-line prefer-rest-params
                const idx = arguments[i];
                this.checkIndex_(idx);
                this.$variables[idx].incrSequence();
            }
        }
    }

    /**
     * Returns the current value of the variable with the given index.
     * @param index the index of the variable of interest
     * @return the current value of the variable of interest
     */
    getValue(index: number): number {
        this.checkIndex_(index);
        return this.$variables[index].getValue();
    }

    getName(index: number): string {
        this.checkIndex_(index);
        return this.$variables[index].name;
    }

    getSequence(index: number): number {
        this.checkIndex_(index);
        return this.$variables[index].getSequence();
    }

    /**
     * Returns an array with the current value of each variable.
     * The returned array is a copy of the variable values; changing the array will not change the variable values.
     * However, for performance, the array is maintained between invocations.
     */
    getValues(): number[] {
        const values = this.$values;
        const variables = this.$variables;
        const N = variables.length;
        if (values.length !== N) {
            values.length = N;
        }
        for (let i = 0; i < N; i++) {
            values[i] = variables[i].getValue();
        }
        return this.$values;
    }

    /**
     * Sets the value of each variable from the given list of values. When the length of
     * `vars` is less than length of VarsList then the remaining variables are not modified.
     * Assumes this is a discontinous change, so the sequence number is incremented
     * unless you specify that this is a continuous change in the variable.
     * @param vars array of state variables
     * @param continuous `true` means this new value is continuous with
     * previous values; `false` (the default) means the new value is discontinuous with
     * previous values, so the sequence number for the variable is incremented
     * @throws if length of `vars` exceeds length of VarsList
     */
    setValues(vars: number[], continuous = false): void {
        const N = this.$variables.length;
        const n = vars.length;
        if (n > N) {
            throw new Error(`setValues bad length n = ${n} > N = ${N}`);
        }
        for (let i = 0; i < N; i++) {
            if (i < n) {
                this.setValue(i, vars[i], continuous);
            }
        }
    }

    /**
     * @hidden
     */
    setValuesContinuous(vars: number[]): void {
        const N = this.$variables.length;
        const n = vars.length;
        for (let i = 0; i < N; i++) {
            if (i < n) {
                this.setValueContinuous(i, vars[i]);
            }
        }
    }

    /**
     * Sets the specified variable to the given value. Variables are numbered starting at
     * zero. Assumes this is a discontinous change, so the sequence number is incremented
     * unless you specify that this is a continuous change in the variable.
     * @param index  the index of the variable within the array of variables
     * @param value  the value to set the variable to
     * @param continuous `true` means this new value is continuous with
     * previous values; `false` (the default) means the new value is discontinuous with
     * previous values, so the sequence number for the variable is incremented
     * @throws if value is `NaN`
     */
    setValue(index: number, value: number, continuous = false): void {
        this.checkIndex_(index);
        const variable = this.$variables[index];
        if (isNaN(value)) {
            throw new Error('cannot set variable ' + variable.name + ' to NaN');
        }
        if (continuous) {
            variable.setValueContinuous(value);
        }
        else {
            variable.setValueJump(value);
        }
    }

    /**
     * @hidden
     */
    setValueContinuous(index: number, value: number): void {
        const variable = this.$variables[index];
        variable.setValueContinuous(value);
    }

    /**
     * @hidden
     */
    setValueJump(index: number, value: number): void {
        const variable = this.$variables[index];
        if (variable) {
            variable.setValueJump(value);
        }
        else {
            throw new Error(`index is invalid in setValueJump(index=${index}, value=${value}).`);
        }
    }

    getUnits(): Unit[] {
        const units = this.$units;
        const variables = this.$variables;
        const N = variables.length;
        if (units.length !== N) {
            units.length = N;
        }
        for (let i = 0; i < N; i++) {
            units[i] = variables[i].getUnit();
        }
        return this.$units;
    }

    setUnits(units: Unit[]): void {
        const N = this.$variables.length;
        const n = units.length;
        if (n > N) {
            throw new Error(`setUnits bad length n = ${n} > N = ${N}`);
        }
        for (let i = 0; i < N; i++) {
            if (i < n) {
                this.setUnit(i, units[i]);
            }
        }
    }

    setUnit(index: number, unit: Unit): void {
        this.checkIndex_(index);
        const variable = this.$variables[index];
        variable.setUnit(unit);
    }

    /**
     * 
     */
    private checkIndex_(index: number): void {
        if (index < 0 || index >= this.$variables.length) {
            throw new Error('bad variable index=' + index + '; numVars=' + this.$variables.length);
        }
    }

    //
    // Add a Variable to this VarsList.
    // @param variable the Variable to add
    // @return the index number of the variable
    // @throws if name if the Variable is 'DELETED'
    //
    /*
    private addVariable(variable: Variable): number {
        const name = variable.name;
        if (name === VarsList.DELETED) {
            throw new Error(`variable cannot be named '${VarsList.DELETED}'`);
        }
        // add variable to first open slot
        const position = this.findOpenSlot_(1);
        this.$variables[position] = variable;
        if (name === VarsList.TIME) {
            // auto-detect time variable
            this.$timeIdx = position;
        }
        this.broadcast(new GenericEvent(this, VarsList.VARS_MODIFIED));
        return position;
    }
    */

    /**
     * Whether recent history is being stored, see `saveHistory`.
     * @return true if recent history is being stored
     */
    getHistory(): boolean {
        return this.history_;
    }

    getParameter(name: string): Variable {
        name = toName(name);
        const p = find(this.$variables, function (p) {
            return p.name === name;
        });
        if (p != null) {
            return p;
        }
        throw new Error('Parameter not found ' + name);
    }

    getParameters(): Variable[] {
        return clone(this.$variables);
    }

    /**
     * Returns the value of the time variable, or throws an exception if there is no time variable.
     * 
     * There are no explicit units for the time, so you can regard a time unit as any length
     * of time, as long as it is consistent with other units.
     * @return the current simulation time
     * @throws if there is no time variable
     */
    getTime(): number {
        if (this.$timeIdx < 0) {
            throw new Error('No time variable.');
        }
        return this.getValue(this.$timeIdx);
    }

    /**
     * Returns the Variable object at the given index or with the given name
     * @param id the index or name of the variable; the name can be the
     * English or language independent version of the name
     * @return the Variable object at the given index or with the given name
     */
    getVariable(id: number | string): Variable {
        let index: number;
        if (isNumber(id)) {
            index = id;
        }
        else if (isString(id)) {
            id = toName(id);
            index = findIndex(this.$variables, v => v.name === id);
            if (index < 0) {
                throw new Error('unknown variable name ' + id);
            }
        }
        else {
            throw new Error();
        }
        this.checkIndex_(index);
        return this.$variables[index];
    }

    /**
     * Returns the number of variables available. This includes any deleted
     * variables (which are not being used and should be ignored).
     * @return the number of variables in this VarsList
     */
    numVariables(): number {
        return this.$variables.length;
    }

    /**
     * Saves the current variables in a 'history' set, for debugging, to be able to
     * reproduce an error condition. See `printHistory`.
     */
    saveHistory(): void {
        if (this.history_) {
            const v = this.getValues();
            v.push(this.getTime());
            this.histArray_.push(v); // adds element to end of histArray_
            if (this.histArray_.length > 20) {
                // to prevent filling memory, only keep recent history entries
                this.histArray_.shift(); // removes element at histArray_[0]
            }
        }
    }

    /**
     * Indicates the specified Variables are being automatically computed.
     * @param indexes  the indexes of the variables
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setComputed(...indexes: number[]): void {
        for (let i = 0, n = arguments.length; i < n; i++) {
            // eslint-disable-next-line prefer-rest-params
            const idx = arguments[i];
            this.checkIndex_(idx);
            this.$variables[idx].setComputed(true);
        }
    }

    /**
     * Sets whether to store recent history, see {@link #saveHistory}.
     * @param value true means recent history should be stored
     */
    setHistory(value: boolean): void {
        this.history_ = value;
    }

    /**
     * Sets the current simulation time.
     * @param time the current simulation time.
     * @throws {Error} if there is no time variable
     */
    setTime(time: number): void {
        this.setValueJump(this.$timeIdx, time);
    }

    /**
     * Returns the index of the time variable, or -1 if there is no time variable.
     */
    timeIndex(): number {
        return this.$timeIdx;
    }

    /**
     * Returns the set of Variable objects in this VarsList, in their correct ordering.
     */
    toArray(): Variable[] {
        return clone(this.$variables);
    }
}
