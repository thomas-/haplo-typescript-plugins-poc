# haplo-typescript-plugins-poc

Proof of concept for creating [Haplo](https://github.com/haplo-org/haplo) plugins in [Typescript](https://www.typescriptlang.org/), and using Typescript in Check JS mode to check javascript plugins.

## Setup

To install dependencies:

```
npm install
```

This proof of concept uses Browserify (with TSify) to combine the compiled Typescript source into a single ES5 javascript bundle, compatible with the Rhino interpretter included in the Haplo platform.

## typings/

Some basic typings of Haplo interfaces are bundled in this repo and form the base of this proof of concept. The typings are a barebones proof of concept only and I don't recommend trying to use them for development at this stage.

### In VSCode/IDEs with Typescript support

An example of what this looks like in VSCode, using a function declaration that is prefixed with the [Haplo Docs](https://github.com/haplo-org/haplo-docs) description.

![VSCode type hinting](vscode-context.png?raw=true "VSCode type hinting")

## Typescript plugin ts_object_changelog

The plugin entry source file can be found at [ts_object_changelog/ts/index.ts](ts_object_changelog/ts/index.ts)

Our `plugin.json` specifies 1 file to load, `js/bundle.js`, which we compile from this typescript source.

You can build the bundle yourself with

```
cd ts_object_changelog
./build.sh
```

which executes the following:

```
../node_modules/.bin/browserify ts/index.ts --debug -p [ tsify --noImplicitAny ] > js/bundle.js
```

### Sourcemaps

The build script specifies `--debug` mode, which will embed a SourceMap in the output `bundle.js`, which can be used to resolve the location of any runtime errors from the compiled JS to the source Typescript.

A fork of the Haplo platform with very crude sourcemap support is available at [thomas-/haplo/tree/typescript-poc](https://github.com/thomas-/haplo/tree/typescript-poc). An example error created by this fork when a runtime error occurs in a compiled file with a sourcemap:

```
TypeError: Cannot read property "fail" from undefined

Error location

ts_object_changelog/js/bundle.js (line 65)
ts_object_changelog/js/bundle.js (line 65) Mapping 65:4 -> index.ts:10:4
```

### Database table return from constructor

The above mentioned fork also modifies `P.db.table()` to return the `JdTable` object, making it easier to type database rows, and also to pass database tables around via imports.

Some commented out code in `ts_object_changelog/ts/index.ts` relies on this behaviour, and will throw runtime errors if uncommented and used on the upstream version of Haplo.


## Javascript checking of haplo_simple_notification

The repository contains a modified version of the opensource [haplo_simple_notification](https://github.com/haplo-org/haplo-plugins/tree/master/haplo_simple_notification) plugin, which we're using to give an example of how Haplo platform typescript typings could be used to check existing code for correctness/bugs.

Some modifications have been made to purposefully cause errors when checked using Typescript with the `--checkJs` option. Similarly, an example of using ad-hoc typing of JS using JSDoc comments is present, defining a `NotificationDetails` type. These modifications demonstrate finding a few small errors, for example:

* A typo in a path element definition.
* Attempting to use a property on a Haplo platform interface that does not exist.
* Where a property does not match a type defined in a JSDoc comment.

`tsconfig.json` is setup to check javascript files, to run it yourself:

```
cd haplo_simple_notification
./check.sh
```
which executes:

```
../node_modules/.bin/tsc 
```

or see example output below:

### Output of ./check.sh

```
js/haplo_simple_notification.js:8:82 - error TS2322: Type '{ pathElement: number; as: string; workType: string; optinal: true; }' is not assignable to type 'ParametersAndPathElements'.
  Object literal may only specify known properties, but 'optinal' does not exist in type 'ParametersAndPathElements'. Did you mean to write 'optional'?

8     {pathElement:0, as:"workUnit", workType:"haplo_simple_notification:message", optinal: true}
                                                                                   ~~~~~~~~~~~~~

js/haplo_simple_notification.js:147:5 - error TS2345: Argument of type '{ workType: string; description: string; fail: string; notify: (workUnit: WorkUnit) => { fail: any; template: string; title: string; notesHTML: string; button: string; action: string; }; render: (W: any) => void; }' is not assignable to parameter of type '{ workType: string; description: string; notify?(workUnit: WorkUnit): LooseObject; render(W: any): void; }'.
  Object literal may only specify known properties, and 'fail' does not exist in type '{ workType: string; description: string; notify?(workUnit: WorkUnit): LooseObject; render(W: any): void; }'.

147     fail: "oops",
        ~~~~~~~~~~~~

js/haplo_simple_notification.js:151:27 - error TS2339: Property 'oops' does not exist on type 'NotificationDetails'.

151             fail: details.oops,
                              ~~~~


Found 3 errors.
```