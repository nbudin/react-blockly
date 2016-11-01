import React from 'react';
import ReactDOM from 'react-dom';

var debounce = function(func, wait) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			func.apply(context, args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
};

var BlocklyWorkspace = React.createClass({
  propTypes: {
    initialXml: React.PropTypes.string,
    workspaceConfiguration: React.PropTypes.object,
    wrapperDivClassName: React.PropTypes.string,
    xmlDidChange: React.PropTypes.func,
    toolboxMode: React.PropTypes.oneOf(['CATEGORIES', 'BLOCKS'])
  },

  getInitialState: function() {
    return {
      workspace: null,
      xml: this.props.initialXml
    };
  },

  componentDidMount: function() {
    // TODO figure out how to use setState here without breaking the toolbox when switching tabs
    this.state.workspace = Blockly.inject(
      this.refs.editorDiv,
      Object.assign({}, (this.props.workspaceConfiguration || {}), {
        toolbox: ReactDOM.findDOMNode(this.refs.dummyToolbox)
      })
    );

    if (this.state.xml) {
      if (this.importFromXml(this.state.xml)) {
        this.xmlDidChange();
      } else {
        this.setState({xml: null}, this.xmlDidChange);
      }
    }

    this.state.workspace.addChangeListener(debounce(function() {
      var newXml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(this.state.workspace));
      if (newXml == this.state.xml) {
        return;
      }

      this.setState({xml: newXml}, this.xmlDidChange);
    }.bind(this), 200));
  },

  importFromXml: function(xml) {
    try {
      Blockly.Xml.domToWorkspace(this.state.workspace, Blockly.Xml.textToDom(xml));
      return true;
    } catch (e) {
      return false;
    }
  },

  componentWillReceiveProps: function(newProps) {
    if (this.props.initialXml != newProps.initialXml) {
      this.setState({xml: newProps.initialXml});
    }
  },

  componentWillUnmount: function() {
    if (this.state.workspace) {
      this.state.workspace.dispose();
    }
  },

  shouldComponentUpdate: function() {
    return false;
  },

  xmlDidChange: function() {
    if (this.props.xmlDidChange) {
      this.props.xmlDidChange(this.state.xml);
    }
  },

  toolboxDidUpdate: function(toolboxNode) {
    if (toolboxNode && this.state.workspace) {
      this.state.workspace.updateToolbox(toolboxNode);
    }
  },

  resize: function() {
    Blockly.svgResize(this.state.workspace);
  },

  render: function() {
    // We have to fool Blockly into setting up a toolbox with categories initially;
    // otherwise it will refuse to do so after we inject the real categories into it.
    var dummyToolboxContent;
    if (this.props.toolboxMode === "CATEGORIES") {
      dummyToolboxContent = (
        <category name="Dummy toolbox" />
      );
    }

    return (
      <div className={this.props.wrapperDivClassName}>
        <xml style={{display: "none"}} ref="dummyToolbox">
          {dummyToolboxContent}
        </xml>
        <div ref="editorDiv" className={this.props.wrapperDivClassName} />
      </div>
    );
  }
});

export default BlocklyWorkspace;