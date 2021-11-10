import React from "react";
import PropTypes from "prop-types";
import useBlocklyWorkspace from "./useBlocklyWorkspace";

const propTypes = {
  initialXml: PropTypes.string,
  toolboxConfiguration: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  workspaceConfiguration: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  className: PropTypes.string,
  onWorkspaceChange: PropTypes.func,
  onImportXmlError: PropTypes.func,
  onXmlChange: PropTypes.func,
  onInject: PropTypes.func,
  onDispose: PropTypes.func,
};

const defaultProps = {
  initialXml: null,
  toolboxConfiguration: null,
  workspaceConfiguration: null,
  className: null,
  onWorkspaceChange: null,
  onImportXmlError: null,
  onXmlChange: null,
  onInject: null,
  onDispose: null,
};

function BlocklyWorkspace({
  initialXml,
  toolboxConfiguration,
  workspaceConfiguration,
  className,
  onWorkspaceChange,
  onXmlChange,
  onImportXmlError,
  onInject,
  onDispose,
}: any) {
  const editorDiv = React.useRef(null);
  const { xml } = useBlocklyWorkspace({
    ref: editorDiv,
    initialXml,
    toolboxConfiguration,
    workspaceConfiguration,
    onWorkspaceChange,
    onImportXmlError,
    onInject,
    onDispose,
  });
  const onXmlChangeRef = React.useRef(onXmlChange);
  React.useEffect(() => {
    onXmlChangeRef.current = onXmlChange;
  }, [onXmlChange]);
  React.useEffect(() => {
    if (onXmlChangeRef.current && xml) {
      onXmlChangeRef.current(xml);
    }
  }, [xml]);

  return <div className={className} ref={editorDiv} />;
}

BlocklyWorkspace.propTypes = propTypes;
BlocklyWorkspace.defaultProps = defaultProps;

export default BlocklyWorkspace;
