import React from "react";
import useBlocklyWorkspace, { BlocklyWorkspaceProps } from "./useBlocklyWorkspace";

export default function BlocklyWorkspace(props: {
  className?: string,
  onXmlChange: (xml: string) => void,
} & BlocklyWorkspaceProps) {
  const { className, onXmlChange, ...rest } = props
  const editorDiv = React.useRef(null);
  const { xml } = useBlocklyWorkspace({
    ref: editorDiv,
    ...rest,
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
