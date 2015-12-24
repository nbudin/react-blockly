import React from 'react';
import ReactDOM from 'react-dom';

import BlocklyToolbox from './BlocklyToolbox';
import BlocklyWorkspace from './BlocklyWorkspace';

var BlocklyEditor = React.createClass({
  toolboxDidUpdate: function() {
    if (this.refs.workspace) {
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

  importFromXml: function(xml) {
    this.refs.workspace.importFromXml(xml);
  },

  render: function() {
    return (
      <div className={this.props.className}>
        <BlocklyToolbox
          categories={this.props.toolboxCategories}
          didUpdate={this.toolboxDidUpdate}
          processCategory={this.props.processToolboxCategory}
          ref="toolbox" />
        <BlocklyWorkspace ref="workspace"
          xml={this.props.xml}
          xmlDidChange={this.xmlDidChange}
          className={this.props.className}
          workspaceConfiguration={this.props.workspaceConfiguration} />
      </div>
    );
  }
});

export default BlocklyEditor;