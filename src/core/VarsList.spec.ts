import { VarsList } from "./VarsList";

describe("VarsList", function () {
    describe("constructor", function () {
        it("([])", function () {
            expect(function () {
                const vars = new VarsList([]);
                expect(vars).toBeDefined();
                expect(vars.numVariables()).toBe(0);
            }).toThrowError("No time variable.");
        });
    });
    //
    // VarsList uses the case-insensitive name 'time' to identify which variable holds the time.
    //
    describe("timeIndex", function () {
        it("(['TIME']) should have a timeIndex of 0.", function () {
            const vars = new VarsList(['TIME']);
            expect(vars).toBeDefined();
            expect(vars.timeIndex()).toBe(0);
        });
        it("(['time']) should have a timeIndex of 0.", function () {
            const vars = new VarsList(['time']);
            expect(vars).toBeDefined();
            expect(vars.timeIndex()).toBe(0);
        });
        it("(['foo', 'time']) should have a timeIndex of 1.", function () {
            const vars = new VarsList(['foo', 'time']);
            expect(vars).toBeDefined();
            expect(vars.timeIndex()).toBe(1);
        });
    });

    describe("addVariables", function () {
        it("should return the zero-based index of the first variable in the block.", function () {
            const vars = new VarsList(['time', 'E']);
            const index = vars.addVariables(['x', 'y', 'z']);
            expect(index).toBe(2);
            expect(vars.numVariables()).toBe(5);
            expect(vars.getName(0)).toBe('TIME');
            expect(vars.getName(1)).toBe('E');
            expect(vars.getName(2)).toBe('X');
            expect(vars.getName(3)).toBe('Y');
            expect(vars.getName(4)).toBe('Z');
        });
        it("should throw an Error if the value of the names parameter is an empty list.", function () {
            expect(function () {
                const vars = new VarsList(['time', 'E']);
                vars.addVariables([]);
            }).toThrowError("names must not be empty.");
        });
        it("should throw an Error if a variable is named 'deleted'.", function () {
            expect(function () {
                const vars = new VarsList(['time', 'E']);
                vars.addVariables(['deleted']);
            }).toThrowError("variable cannot be named 'DELETED'.");
        });
    });

    describe("deleteVariables", function () {
        it("should replace variables with sentinel entries.", function () {
            const vars = new VarsList(['time', 'E']);
            vars.addVariables(['x', 'y', 'z']);
            const index = vars.addVariables(['x', 'y', 'z']);
            vars.addVariables(['x', 'y', 'z']);
            vars.deleteVariables(index, 3);
            expect(vars.numVariables()).toBe(11);
            expect(vars.getName(0)).toBe('TIME');
            expect(vars.getName(1)).toBe('E');
            expect(vars.getName(2)).toBe('X');
            expect(vars.getName(3)).toBe('Y');
            expect(vars.getName(4)).toBe('Z');
            expect(vars.getName(5)).toBe('DELETED');
            expect(vars.getName(6)).toBe('DELETED');
            expect(vars.getName(7)).toBe('DELETED');
            expect(vars.getName(8)).toBe('X');
            expect(vars.getName(9)).toBe('Y');
            expect(vars.getName(10)).toBe('Z');
        });
        it("should accept zero as a number of variables to delete.", function () {
            const vars = new VarsList(['time', 'E']);
            vars.addVariables(['x', 'y', 'z']);
            const index = vars.addVariables(['x', 'y', 'z']);
            vars.addVariables(['x', 'y', 'z']);
            vars.deleteVariables(index, 0);
            expect(vars.getName(0)).toBe('TIME');
            expect(vars.getName(1)).toBe('E');
            expect(vars.getName(2)).toBe('X');
            expect(vars.getName(3)).toBe('Y');
            expect(vars.getName(4)).toBe('Z');
            expect(vars.getName(5)).toBe('X');
            expect(vars.getName(6)).toBe('Y');
            expect(vars.getName(7)).toBe('Z');
            expect(vars.getName(8)).toBe('X');
            expect(vars.getName(9)).toBe('Y');
            expect(vars.getName(10)).toBe('Z');
        });
        it("should throw an Error if howMany is negative.", function () {
            expect(function () {
                const vars = new VarsList(['time', 'E']);
                vars.addVariables(['x', 'y', 'z']);
                const index = vars.addVariables(['x', 'y', 'z']);
                vars.addVariables(['x', 'y', 'z']);
                vars.deleteVariables(index, -1);
                // Dummy expectation to prevent warning.
                expect(true).toBe(true);
            }).toThrowError("deleteVariables");
        });
        it("should fill deleted blocks.", function () {
            const vars = new VarsList(['time', 'E']);
            vars.addVariables(['x', 'y', 'z']);
            const index = vars.addVariables(['x', 'y', 'z']);
            vars.addVariables(['x', 'y', 'z']);
            vars.deleteVariables(index, 3);
            const indexFound = vars.addVariables(['x', 'y', 'z']);
            expect(indexFound).toBe(index);
            expect(vars.getName(0)).toBe('TIME');
            expect(vars.getName(1)).toBe('E');
            expect(vars.getName(2)).toBe('X');
            expect(vars.getName(3)).toBe('Y');
            expect(vars.getName(4)).toBe('Z');
            expect(vars.getName(5)).toBe('X');
            expect(vars.getName(6)).toBe('Y');
            expect(vars.getName(7)).toBe('Z');
            expect(vars.getName(8)).toBe('X');
            expect(vars.getName(9)).toBe('Y');
            expect(vars.getName(10)).toBe('Z');
        });
        it("should fill deleted blocks.", function () {
            const vars = new VarsList(['time', 'E']);
            vars.addVariables(['x', 'y']);
            const index = vars.addVariables(['x', 'y']);
            vars.deleteVariables(index, 2);
            const indexFound = vars.addVariables(['x', 'y', 'z']);
            expect(indexFound).toBe(index);
            expect(vars.getName(0)).toBe('TIME');
            expect(vars.getName(1)).toBe('E');
            expect(vars.getName(2)).toBe('X');
            expect(vars.getName(3)).toBe('Y');
            expect(vars.getName(4)).toBe('X');
            expect(vars.getName(5)).toBe('Y');
            expect(vars.getName(6)).toBe('Z');
        });
    });

    describe("Variable", function () {
        it("value should be initialized to zero.", function () {
            const vars = new VarsList(['time', 'E']);
            const index = vars.addVariables(['x']);
            expect(vars.getValue(index)).toBe(0);
        });
        it("name should be normalized.", function () {
            const vars = new VarsList(['time', 'E']);
            const index = vars.addVariables(['My variable name  ']);
            expect(vars.getName(index)).toBe('MY_VARIABLE_NAME__');
        });
        it("sequence should be initialized to zero.", function () {
            const vars = new VarsList(['time', 'E']);
            const index = vars.addVariables(['x']);
            expect(vars.getSequence(index)).toBe(0);
        });
    });

    describe("getValues", function () {
        it("should be initialized to zero.", function () {
            const vars = new VarsList(['time', 'E']);
            const values = vars.getValues();
            expect(Array.isArray(values)).toBe(true);
            expect(values.length).toBe(2);
            expect(values[0]).toBe(0);
            expect(values[1]).toBe(0);
        });
        it("should be a copy.", function () {
            const vars = new VarsList(['time', 'E']);

            const a = vars.getValues();
            expect(Array.isArray(a)).toBe(true);
            expect(a.length).toBe(2);
            expect(a[0]).toBe(0);
            expect(a[1]).toBe(0);
            vars.setValues([Math.PI, Math.E]);

            const b = vars.getValues();
            expect(Array.isArray(b)).toBe(true);
            expect(b.length).toBe(2);
            expect(b[0]).toBe(Math.PI);
            expect(b[1]).toBe(Math.E);

            b[0] = 0;
            b[1] = 0;

            const c = vars.getValues();
            expect(Array.isArray(c)).toBe(true);
            expect(c.length).toBe(2);
            expect(c[0]).toBe(Math.PI);
            expect(c[1]).toBe(Math.E);
        });
    });
});
