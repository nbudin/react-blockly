import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

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

class BlocklyWorkspace extends React.Component {
  static propTypes = {
    initialXml: PropTypes.string,
    workspaceConfiguration: PropTypes.object,
    wrapperDivClassName: PropTypes.string,
    xmlDidChange: PropTypes.func,
    workspaceDidChange: PropTypes.func,
    onImportXmlError: PropTypes.func,
    toolboxMode: PropTypes.oneOf(['CATEGORIES', 'BLOCKS'])
  };

	constructor(props) {
		super(props);

		this.state = {
			workspace: null,
      xml: this.props.initialXml,
		};
	}

  componentDidMount = () => {
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

	this.state.workspace.addChangeListener(this.workspaceDidChange);

    this.state.workspace.addChangeListener(debounce(function() {
      var newXml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(this.state.workspace));
      if (newXml == this.state.xml) {
        return;
      }

      this.setState({xml: newXml}, this.xmlDidChange);
    }.bind(this), 200));
  }

  importFromXml = (xml) => {
    try {
      Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), this.state.workspace);
      return true;
    } catch (e) {
      if (this.props.onImportXmlError) {
        this.props.onImportXmlError(e);
      }
      return false;
    }
  }

  componentWillReceiveProps = (newProps) => {
    if (this.props.initialXml != newProps.initialXml) {
      this.setState({xml: newProps.initialXml});
    }
  }

  componentWillUnmount = () => {
    if (this.state.workspace) {
      this.state.workspace.dispose();
    }
  }

  shouldComponentUpdate = () => {
    return false;
  }

  xmlDidChange = () => {
    if (this.props.xmlDidChange) {
      this.props.xmlDidChange(this.state.xml);
    }
  }

  workspaceDidChange = (event) => {
    if (this.props.workspaceDidChange) {
      this.props.workspaceDidChange(this.state.workspace);
    }
  }

  toolboxDidUpdate = (toolboxNode) => {
    if (toolboxNode && this.state.workspace) {
      this.state.workspace.updateToolbox(toolboxNode);
    }
  }

  resize = () => {
    Blockly.svgResize(this.state.workspace);
  }

  render = () => {
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
}

export default BlocklyWorkspace;
