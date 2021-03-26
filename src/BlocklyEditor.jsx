import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';

import BlocklyToolbox from './BlocklyToolbox';
import BlocklyWorkspace from './BlocklyWorkspace';
import {importFromXml} from './BlocklyHelper'

const BlockPropType = PropTypes.shape({
  type: PropTypes.string,
  shadow: PropTypes.bool,
  fields: PropTypes.object,
  values: PropTypes.object,
  statements: PropTypes.object,
  next: PropTypes.object,
  mutation: PropTypes.shape({
    attributes: PropTypes.object,
    innerContent: PropTypes.string,
  }),
});

const categoryPropsNonRecursive = {
  type: PropTypes.string,
  name: PropTypes.string,
  custom: PropTypes.string,
  colour: PropTypes.string,
  blocks: PropTypes.arrayOf(BlockPropType),
};

const CategoryPropType = PropTypes.shape({
  ...categoryPropsNonRecursive,
  categories: PropTypes.arrayOf(PropTypes.shape(categoryPropsNonRecursive)),
});


const propTypes = {
  initialXml: PropTypes.string,
  workspaceConfiguration: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  wrapperDivClassName: PropTypes.string,
  toolboxCategories: PropTypes.arrayOf(CategoryPropType.isRequired),
  toolboxBlocks: PropTypes.arrayOf(BlockPropType.isRequired),
  xmlDidChange: PropTypes.func,
  workspaceDidChange: PropTypes.func,
  onImportXmlError: PropTypes.func,
  processToolboxCategory: PropTypes.func,
};

const defaultProps = {
  initialXml: null,
  workspaceConfiguration: null,
  wrapperDivClassName: null,
  toolboxCategories: null,
  toolboxBlocks: null,
  xmlDidChange: null,
  workspaceDidChange: null,
  onImportXmlError: null,
  processToolboxCategory: null,
};

class BlocklyEditor extends React.Component {
  componentDidMount = () => {
    this.toolboxDidUpdate();

    if (this.props.xmlDidChange) {
      if (typeof console !== 'undefined') {
        // eslint-disable-next-line no-console
        console.error('Warning: xmlDidChange is deprecated and will be removed in future versions! Please use workspaceDidChange instead.');
      }
    }
  }

  componentDidUpdate = (prevProps) => {
    if (
      (
        this.props.toolboxBlocks
        && !Immutable.fromJS(this.props.toolboxBlocks).equals(Immutable.fromJS(prevProps.toolboxBlocks))
      )
      || (
        this.props.toolboxCategories
        && !Immutable.fromJS(this.props.toolboxCategories).equals(Immutable.fromJS(prevProps.toolboxCategories))
      )
    ) {
      this.toolboxDidUpdate();
    }
  }

  toolboxDidUpdate = () => {
    const workspaceConfiguration = this.props.workspaceConfiguration || {};
    if (this.workspace && this.toolbox && !workspaceConfiguration.readOnly) {
      this.workspace.updateToolbox(this.toolbox.getRootNode())
    }
  }

  xmlDidChange = (newXml) => {
    if (this.props.xmlDidChange) {
      this.props.xmlDidChange(newXml);
    }
  }

  workspaceDidChange = (workspace) => {
    const previousWorkspace = this.workspace;
    this.workspace = workspace;

    if (previousWorkspace !== workspace) {
      // Make sure the new Blockly's workspace has it's toolbox updated.
      this.toolboxDidUpdate();
    }

    if (this.props.workspaceDidChange) {
      this.props.workspaceDidChange(workspace);
    }
  }

  importFromXml = (xml) => {
    return importFromXml(xml, this.workspace, this.props.onImportXmlError);
  }

  resize = () => {
    Blockly.svgResize(this.workspace);
  }

  render = () => {
    let toolboxMode;
    if (this.props.toolboxCategories) {
      toolboxMode = 'CATEGORIES';
    } else if (this.props.toolboxBlocks) {
      toolboxMode = 'BLOCKS';
    }

    return (
      <div className={this.props.wrapperDivClassName}>
        <BlocklyToolbox
          categories={Immutable.fromJS(this.props.toolboxCategories)}
          blocks={Immutable.fromJS(this.props.toolboxBlocks)}
          didUpdate={this.toolboxDidUpdate}
          processCategory={this.props.processToolboxCategory}
          ref={(toolbox) => { this.toolbox = toolbox; }}
        />
        <BlocklyWorkspace
          initialXml={this.props.initialXml}
          onImportXmlError={this.props.onImportXmlError}
          toolboxMode={toolboxMode}
          xmlDidChange={this.xmlDidChange}
          workspaceDidChange={this.workspaceDidChange}
          wrapperDivClassName={this.props.wrapperDivClassName}
          workspaceConfiguration={this.props.workspaceConfiguration}
        />
      </div>
    );
  }
}
BlocklyEditor.propTypes = propTypes;
BlocklyEditor.defaultProps = defaultProps;

export default BlocklyEditor;
