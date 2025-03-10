import React from "react";
import PropTypes from "prop-types";
import useBlocklyWorkspace from "./useBlocklyWorkspace";
import { BlocklyWorkspaceProps } from "./BlocklyWorkspaceProps";

const propTypes = {
  initialXml: PropTypes.string,
  initialJson: PropTypes.object,
  updateXml: PropTypes.string,
  updateJson: PropTypes.object,
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

function BlocklyWorkspace({
  initialXml,
  initialJson,
  updateXml,
  updateJson,
  toolboxConfiguration,
  workspaceConfiguration,
  className,
  onWorkspaceChange,
  onXmlChange,
  onJsonChange,
  onImportXmlError,
  onImportError,
  onInject,
  onDispose,
}: BlocklyWorkspaceProps) {
  const editorDiv = React.useRef(null);
  const { xml, json } = useBlocklyWorkspace({
    ref: editorDiv,
    initialXml,
    initialJson,
    updateXml,
    updateJson,
    toolboxConfiguration,
    workspaceConfiguration,
    onWorkspaceChange,
    onImportXmlError,
    onImportError,
    onInject,
    onDispose,

  });
  const onXmlChangeRef = React.useRef(onXmlChange);
  React.useEffect(() => {
    onXmlChangeRef.current = onXmlChange;
  }, [onXmlChange]);
  const onJsonChangeRef = React.useRef(onJsonChange);
  React.useEffect(() => {
    onJsonChangeRef.current = onJsonChange;
  }, [onJsonChange]);
  React.useEffect(() => {
    if (onXmlChangeRef.current && xml) {
      onXmlChangeRef.current(xml);
    }
    if (onJsonChangeRef.current && json) {
      onJsonChangeRef.current(json);
    }
  }, [xml, json]);

  return <div className={className} ref={editorDiv} />;
}

BlocklyWorkspace.propTypes = propTypes;

export default BlocklyWorkspace;
