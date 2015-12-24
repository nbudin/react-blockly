var ReactBlocklyComponent =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _BlocklyEditor = __webpack_require__(2);

	var _BlocklyEditor2 = _interopRequireDefault(_BlocklyEditor);

	var _BlocklyToolbox = __webpack_require__(5);

	var _BlocklyToolbox2 = _interopRequireDefault(_BlocklyToolbox);

	var _BlocklyToolboxBlock = __webpack_require__(7);

	var _BlocklyToolboxBlock2 = _interopRequireDefault(_BlocklyToolboxBlock);

	var _BlocklyToolboxCategory = __webpack_require__(6);

	var _BlocklyToolboxCategory2 = _interopRequireDefault(_BlocklyToolboxCategory);

	var _BlocklyWorkspace = __webpack_require__(8);

	var _BlocklyWorkspace2 = _interopRequireDefault(_BlocklyWorkspace);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var ReactBlocklyComponent = {
	  BlocklyEditor: _BlocklyEditor2.default,
	  BlocklyToolbox: _BlocklyToolbox2.default,
	  BlocklyToolboxBlock: _BlocklyToolboxBlock2.default,
	  BlocklyToolboxCategory: _BlocklyToolboxCategory2.default,
	  BlocklyWorkspace: _BlocklyWorkspace2.default
	};

	module.exports = ReactBlocklyComponent;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(4);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _BlocklyToolbox = __webpack_require__(5);

	var _BlocklyToolbox2 = _interopRequireDefault(_BlocklyToolbox);

	var _BlocklyWorkspace = __webpack_require__(8);

	var _BlocklyWorkspace2 = _interopRequireDefault(_BlocklyWorkspace);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var BlocklyEditor = _react2.default.createClass({
	  displayName: 'BlocklyEditor',

	  toolboxDidUpdate: function toolboxDidUpdate() {
	    if (this.refs.workspace) {
	      this.refs.workspace.toolboxDidUpdate(_reactDom2.default.findDOMNode(this.refs.toolbox));
	    }
	  },

	  componentDidMount: function componentDidMount() {
	    this.toolboxDidUpdate();
	  },

	  xmlDidChange: function xmlDidChange(newXml) {
	    if (this.props.xmlDidChange) {
	      this.props.xmlDidChange(newXml);
	    }
	  },

	  importFromXml: function importFromXml(xml) {
	    this.refs.workspace.importFromXml(xml);
	  },

	  render: function render() {
	    return _react2.default.createElement(
	      'div',
	      { className: this.props.className },
	      _react2.default.createElement(_BlocklyToolbox2.default, {
	        categories: this.props.toolboxCategories,
	        didUpdate: this.toolboxDidUpdate,
	        processCategory: this.props.processToolboxCategory,
	        ref: 'toolbox' }),
	      _react2.default.createElement(_BlocklyWorkspace2.default, { ref: 'workspace',
	        xml: this.props.xml,
	        xmlDidChange: this.xmlDidChange,
	        className: this.props.className,
	        workspaceConfiguration: this.props.workspaceConfiguration })
	    );
	  }
	});

	exports.default = BlocklyEditor;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = ReactDOM;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	var _BlocklyToolboxCategory = __webpack_require__(6);

	var _BlocklyToolboxCategory2 = _interopRequireDefault(_BlocklyToolboxCategory);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var BlocklyToolbox = _react2.default.createClass({
	  displayName: 'BlocklyToolbox',

	  renderCategories: function renderCategories(categories) {
	    return categories.map((function (category, i) {
	      if (category.type == 'sep') {
	        return _react2.default.createElement('sep', { key: "sep_" + i });
	      } else if (category.type == 'search') {
	        return _react2.default.createElement('search', { key: "search_" + i });
	      } else {
	        return _react2.default.createElement(_BlocklyToolboxCategory2.default, {
	          name: category.name,
	          custom: category.custom,
	          key: "category_" + category.name + "_" + i,
	          blocks: category.blocks,
	          categories: category.categories });
	      }
	    }).bind(this));
	  },

	  componentDidMount: function componentDidMount() {
	    this.props.didUpdate();
	  },

	  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
	    this.props.didUpdate();
	  },

	  processCategory: function processCategory(category) {
	    var processedCategory = _.clone(category);
	    if (processedCategory.categories) {
	      _.extend(processedCategory, { categories: processedCategory.categories.map(this.processCategory) });
	    }

	    if (this.props.processCategory) {
	      this.props.processCategory(processedCategory);
	    }

	    return processedCategory;
	  },

	  render: function render() {
	    return _react2.default.createElement(
	      'xml',
	      { style: { display: "none" } },
	      this.renderCategories(this.props.categories.map(this.processCategory))
	    );
	  }
	});

	exports.default = BlocklyToolbox;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	var _BlocklyToolboxBlock = __webpack_require__(7);

	var _BlocklyToolboxBlock2 = _interopRequireDefault(_BlocklyToolboxBlock);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var BlocklyToolboxCategory = _react2.default.createClass({
	  displayName: 'BlocklyToolboxCategory',

	  componentDidMount: function componentDidMount() {
	    if (this.props.custom) {
	      ReactDOM.findDOMNode(this.refs.category).setAttribute('custom', this.props.custom);
	    }
	  },

	  render: function render() {
	    var subcategories = (this.props.categories || []).map((function (subcategory, i) {
	      return _react2.default.createElement(BlocklyToolboxCategory, {
	        name: subcategory.name,
	        custom: subcategory.custom,
	        key: "category_" + subcategory.name + "_" + i,
	        blocks: subcategory.blocks,
	        categories: subcategory.categories });
	    }).bind(this));

	    var blocks = (this.props.blocks || []).map(function (block, i) {
	      return _react2.default.createElement(_BlocklyToolboxBlock2.default, {
	        type: block.type,
	        key: "block_" + block.type + "_" + i,
	        fields: block.fields,
	        values: block.values,
	        mutation: block.mutation,
	        shadow: block.shadow,
	        next: block.next });
	    });

	    return _react2.default.createElement(
	      'category',
	      { name: this.props.name, ref: 'category' },
	      blocks,
	      subcategories
	    );
	  }
	});

	exports.default = BlocklyToolboxCategory;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(4);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var BlocklyToolboxBlock = _react2.default.createClass({
	  displayName: 'BlocklyToolboxBlock',

	  componentDidMount: function componentDidMount() {
	    if (this.props.mutation) {
	      var mutation = _reactDom2.default.findDOMNode(this.refs.mutation);

	      Object.getOwnPropertyNames(this.props.mutation.attributes).forEach((function (attributeName) {
	        mutation.setAttribute(attributeName, this.props.mutation.attributes[attributeName]);
	      }).bind(this));
	    }
	  },

	  render: function render() {
	    var fields = [];
	    var values = [];
	    var mutation = null;
	    var nextBlock = null;

	    if (this.props.fields) {
	      fields = Object.getOwnPropertyNames(this.props.fields).map((function (fieldName, i) {
	        return _react2.default.createElement(
	          'field',
	          { name: fieldName, key: "field_" + fieldName + "_" + i },
	          this.props.fields[fieldName]
	        );
	      }).bind(this));
	    }

	    if (this.props.values) {
	      values = Object.getOwnPropertyNames(this.props.values).map((function (valueName, i) {
	        var valueBlock = this.props.values[valueName];

	        return _react2.default.createElement(
	          'value',
	          { name: valueName, key: "value_" + valueName + "_" + i },
	          _react2.default.createElement(BlocklyToolboxBlock, {
	            name: valueName,
	            type: valueBlock.type,
	            fields: valueBlock.fields,
	            values: valueBlock.values,
	            mutation: valueBlock.mutation,
	            shadow: valueBlock.shadow,
	            next: valueBlock.next
	          })
	        );
	      }).bind(this));
	    }

	    if (this.props.mutation) {
	      mutation = _react2.default.createElement('mutation', { dangerouslySetInnerHTML: { __html: this.props.mutation.innerContent }, ref: 'mutation' });
	    }

	    if (this.props.next) {
	      nextBlock = _react2.default.createElement(
	        'next',
	        null,
	        _react2.default.createElement(BlocklyToolboxBlock, {
	          type: this.props.next.type,
	          fields: this.props.next.fields,
	          values: this.props.next.values,
	          mutation: this.props.next.mutation,
	          shadow: this.props.next.shadow,
	          next: this.props.next.next
	        })
	      );
	    }

	    if (this.props.shadow) {
	      return _react2.default.createElement(
	        'shadow',
	        { type: this.props.type },
	        mutation,
	        fields,
	        values,
	        nextBlock
	      );
	    } else {
	      return _react2.default.createElement(
	        'block',
	        { type: this.props.type },
	        mutation,
	        fields,
	        values,
	        nextBlock
	      );
	    }
	  }
	});

	exports.default = BlocklyToolboxBlock;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(4);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var BlocklyWorkspace = _react2.default.createClass({
	  displayName: 'BlocklyWorkspace',

	  getInitialState: function getInitialState() {
	    return {
	      workspace: null,
	      xml: this.props.xml
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    // TODO figure out how to use setState here without breaking the toolbox when switching tabs
	    this.state.workspace = Blockly.inject(this.refs.editorDiv, _.extend(_.clone(this.props.workspaceConfiguration || {}), {
	      toolbox: _reactDom2.default.findDOMNode(this.refs.dummyToolbox)
	    }));

	    if (this.state.xml) {
	      this.importFromXml(this.state.xml);
	    }

	    this.state.workspace.addChangeListener(_.debounce((function () {
	      var newXml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(this.state.workspace));
	      if (newXml == this.state.xml) {
	        return;
	      }

	      this.setState({ xml: newXml }, (function () {
	        if (this.props.xmlDidChange) {
	          this.props.xmlDidChange(this.state.xml);
	        }
	      }).bind(this));
	    }).bind(this), 200));
	  },

	  importFromXml: function importFromXml(xml) {
	    Blockly.Xml.domToWorkspace(this.state.workspace, Blockly.Xml.textToDom(xml));
	  },

	  componentWillReceiveProps: function componentWillReceiveProps(newProps) {
	    if (this.props.xml != newProps.xml) {
	      this.setState({ xml: newProps.xml });
	    }
	  },

	  componentWillUnmount: function componentWillUnmount() {
	    if (this.state.workspace) {
	      this.state.workspace.dispose();
	    }
	  },

	  shouldComponentUpdate: function shouldComponentUpdate() {
	    return false;
	  },

	  toolboxDidUpdate: function toolboxDidUpdate(toolboxNode) {
	    if (toolboxNode && this.state.workspace) {
	      this.state.workspace.updateToolbox(toolboxNode);
	    }
	  },

	  render: function render() {
	    // We have to fool Blockly into setting up a toolbox with categories initially;
	    // otherwise it will refuse to do so after we inject the real categories into it.

	    return _react2.default.createElement(
	      'div',
	      { className: this.props.className },
	      _react2.default.createElement(
	        'xml',
	        { style: { display: "none" }, ref: 'dummyToolbox' },
	        _react2.default.createElement('category', { name: 'Dummy toolbox' })
	      ),
	      _react2.default.createElement('div', { ref: 'editorDiv', className: this.props.className })
	    );
	  }
	});

	exports.default = BlocklyWorkspace;

/***/ }
/******/ ]);