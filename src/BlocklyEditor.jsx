import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Immutable from 'immutable';

import BlocklyToolbox from './BlocklyToolbox';
import BlocklyWorkspace from './BlocklyWorkspace';

class BlocklyEditor extends React.Component {
  static propTypes = {
    initialXml: PropTypes.string,
    workspaceConfiguration: PropTypes.object,
    wrapperDivClassName: PropTypes.string,
    toolboxCategories: PropTypes.array,
    toolboxBlocks: PropTypes.array,
    xmlDidChange: PropTypes.func,
    workspaceDidChange: PropTypes.func,
    onImportXmlError: PropTypes.func,
    processToolboxCategory: PropTypes.func
  };

  toolboxDidUpdate = () => {
    var workspaceConfiguration = this.props.workspaceConfiguration || {};
    if (this.refs.workspace && !workspaceConfiguration.readOnly) {
      this.refs.workspace.toolboxDidUpdate(ReactDOM.findDOMNode(this.refs.toolbox));
    }
  }

  componentDidMount = () => {
    this.toolboxDidUpdate();

  	if (this.props.xmlDidChange) {
  	  if (typeof console !== 'undefined') {
  	    console.error('Warning: xmlDidChange is deprecated and will be removed in future versions! Please use workspaceDidChange instead.');
  	  }
  	}
  }

  xmlDidChange = (newXml) => {
    if (this.props.xmlDidChange) {
      this.props.xmlDidChange(newXml);
    }
  }

  workspaceDidChange = (workspace) => {
    if (this.props.workspaceDidChange) {
      this.props.workspaceDidChange(workspace);
    }
  }

  importFromXml = (xml) => {
    return this.refs.workspace.importFromXml(xml);
  }

  resize = () => {
    this.refs.workspace.resize();
  }

  render = () => {
    var toolboxMode;
    if (this.props.toolboxCategories) {
      toolboxMode = "CATEGORIES";
    } else if (this.props.toolboxBlocks) {
      toolboxMode = "BLOCKS";
    }

    return (
      <div className={this.props.wrapperDivClassName}>
        <BlocklyToolbox
          categories={Immutable.fromJS(this.props.toolboxCategories)}
          blocks={Immutable.fromJS(this.props.toolboxBlocks)}
          didUpdate={this.toolboxDidUpdate}
          processCategory={this.props.processToolboxCategory}
          ref="toolbox" />
        <BlocklyWorkspace ref="workspace"
          initialXml={this.props.initialXml}
          onImportXmlError={this.props.onImportXmlError}
          toolboxMode={toolboxMode}
          xmlDidChange={this.xmlDidChange}
		  workspaceDidChange={this.workspaceDidChange}
          wrapperDivClassName={this.props.wrapperDivClassName}
          workspaceConfiguration={this.props.workspaceConfiguration} />
      </div>
    );
  }
}

export default BlocklyEditor;
