import React, { memo, PropsWithChildren } from "react";
import PropTypes from "prop-types";
import { BlocklyEditorProps } from "./BlocklyWorkspaceProps";

function EditorComponent(props: BlocklyEditorProps) {
  const { className, editorRef } = props;

  return <div className={className} ref={editorRef} />;
}

function propsAreEqual(
  prevProps: Readonly<PropsWithChildren<BlocklyEditorProps>>,
  nextProps: Readonly<PropsWithChildren<BlocklyEditorProps>>
) {
  return (
    prevProps.className === nextProps.className &&
    prevProps.editorRef === nextProps.editorRef &&
    prevProps.forceData === nextProps.forceData
  );
}

export const BlocklyEditor = memo(
  EditorComponent,
  propsAreEqual
) as React.ComponentType<BlocklyEditorProps>;

BlocklyEditor.propTypes = {
  className: PropTypes.string,
  editorRef: PropTypes.object,
  forceData: PropTypes.any,
};
