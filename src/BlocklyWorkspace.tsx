import React from "react";
import PropTypes from "prop-types";
import { useBlocklyWorkspace } from "./useBlocklyWorkspace";
import { BlocklyWorkspaceProps } from "./BlocklyWorkspaceProps";
import { Editor } from "./Editor";

const propTypes = {
  initialXml: PropTypes.string,
  initialJson: PropTypes.object,
  toolboxConfiguration: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  workspaceConfiguration: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  className: PropTypes.string,
  onWorkspaceChange: PropTypes.func,
  onImportXmlError: PropTypes.func,
  onImportError: PropTypes.func,
  onXmlChange: PropTypes.func,
  onJsonChange: PropTypes.func,
  onInject: PropTypes.func,
  onDispose: PropTypes.func,
};

function BlocklyWorkspaceComponent(props: BlocklyWorkspaceProps) {
  const { className, ...otherProps } = props;
  const { editorDivRef } = useBlocklyWorkspace(otherProps);

  return <Editor className={className} editorDivRef={editorDivRef} />;
}

export const BlocklyWorkspace = React.memo(
  BlocklyWorkspaceComponent
) as React.ComponentType<BlocklyWorkspaceProps>;

BlocklyWorkspace.propTypes = propTypes;
