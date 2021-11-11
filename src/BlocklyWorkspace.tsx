import React from "react";
import useBlocklyWorkspace from "./useBlocklyWorkspace";

interface IProps {
  initialXml: string;
  toolboxConfiguration?: any;
  workspaceConfiguration?: any;
  className?: string;
  onWorkspaceChange?: any;
  onImportXmlError?: any;
  onXmlChange?: any;
  onInject?: any;
  onDispose?: any;
}

// the default value will be undefined if the prop is not passed
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
}: IProps) {
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

export default BlocklyWorkspace;
