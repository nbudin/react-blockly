# Version 3.0.2 - May 5, 2018

* Fix a logic error in BlocklyEditor's componentDidUpdate (thanks @prabak!)

# Version 3.0.1 - January 22, 2018

* If the toolbox props change, automatically update the toolbox in Blockly

# Version 3.0.0 - December 29, 2017

* Support React 16.  Drop support for React 0.14.x.
* Deprecate `xmlDidChange` in favor of `workspaceDidChange`, which gives you access to the workspace object itself to allow generating code for any language including XML (thanks @Xaptor!)
* Stop depending on ReactDOM in favor of callback refs.
* Major internal cleanups to pass AirBnB's eslint configuration.

# Version 2.0.1 - November 22, 2016

* Update react-immutable-proptypes dependency to avoid warning in newer React versions (thanks @ipince!)

# Version 2.0.0 - November 19, 2016

* BREAKING CHANGE: Swap the order of arguments for `domToWorkspace` to match the latest Blockly changes (thanks @ipince!)

# Version 1.3.0 - November 19, 2016

* Handle errors when importing/exporting workspace XML, optionally passing the error back to the app (thanks @benjie!)

# Version 1.2.1 - September 30, 2016

* Support `readOnly` mode for workspaces (thanks @benjie!).

# Version 1.2.0 - August 29, 2016

* Add `colour` property for toolbox blocks (thanks @benjie!).

# Version 1.1.4 - July 6, 2016

* Add `.npmignore` so that npm doesn't use `.gitignore` by default.

# Version 1.1.3 - July 5, 2016

* Make React a peerDependency.

# Version 1.1.2 - July 5, 2016

* Loosen the React version dependency.

# Version 1.1.1 - April 12, 2016

* Fix a bug that was causing unnecessary toolbox updates.

# Version 1.1.0 - April 8, 2016

* Expose a `resize` function from `BlocklyEditor` and `BlocklyWorkspace` that causes the workspace to resize to fit its container element.

# Version 1.0.0 - April 4, 2016

* Breaking change: the component now uses [Immutable.js](https://facebook.github.io/immutable-js/) internally to track its state and properties for dramatically improved performance.  This is mostly invisible to embedding apps, but if they have a custom `processToolboxCategory` function, that function will now be passed an Immutable.js Map and is expected to return one (either modified or not).

# Version 0.1.2 - March 22, 2016

* Reconfigured the build to emit compiled ES5 in the dist-modules directory, for easier use in build systems.
* Add a default export so that this component can easily be used inside another ES6 module.
* Add support for PatientsLikeMe's [https://github.com/google/blockly/pull/224](pending pull request) on Blockly to allow typeahead search.
* Add a code of conduct.

# Version 0.1.0 - December 24, 2016

* Initial public release.
