==== Workaround for allowing the tests to run.

Jest tries to use the @geometryzen/multivectors module designated by "import".

Change the "import" entry in node_modules/@geometryzen/multivectors/package.json to be...

```json
"exports": {
    ".": {
        "types": "./dist/index.d.ts",
        "system": "./dist/system/index.min.js",
        "import": "./dist/cjs/index.js",
        "require": "./dist/cjs/index.js",
        "default": "./dist/esm/index.min.js"
    }
},
```