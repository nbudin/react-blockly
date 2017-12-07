import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';

import BlocklyToolbox from './BlocklyToolbox';
import BlocklyWorkspace from './BlocklyWorkspace';

var BlocklyEditor = React.createClass({
  propTypes: {
    initialXml: React.PropTypes.string,
    workspaceConfiguration: React.PropTypes.object,
    wrapperDivClassName: React.PropTypes.string,
    toolboxCategories: React.PropTypes.array,
    toolboxBlocks: React.PropTypes.array,
    xmlDidChange: React.PropTypes.func,
	workspaceDidChange: React.PropTypes.func,
    onImportXmlError: React.PropTypes.func,
    processToolboxCategory: React.PropTypes.func
  },

  toolboxDidUpdate: function() {
    var workspaceConfiguration = this.props.workspaceConfiguration || {};
    if (this.refs.workspace && !workspaceConfiguration.readOnly) {
      this.refs.workspace.toolboxDidUpdate(ReactDOM.findDOMNode(this.refs.toolbox));
    }
  },

  componentDidMount: function() {
    this.toolboxDidUpdate();
  },

  xmlDidChange: function(newXml) {
    if (this.props.xmlDidChange) {
      this.props.xmlDidChange(newXml);
    }
  },
  
  workspaceDidChange: function(workspace) {
    if (this.props.workspaceDidChange) {
      this.props.workspaceDidChange(workspace);
    }
  },

  importFromXml: function(xml) {
    return this.refs.workspace.importFromXml(xml);
  },

  resize: function() {
    this.refs.workspace.resize();
  },

  render: function() {
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
});

export default BlocklyEditor;