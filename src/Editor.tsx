import React, { memo, PropsWithChildren } from "react";
import PropTypes from "prop-types";
import { EditorProps } from "./BlocklyWorkspaceProps";

function EditorComponent(props: EditorProps) {
  const { className, editorDivRef } = props;

  return <div className={className} ref={editorDivRef} />;
}

function propsAreEqual(
  prevProps: Readonly<PropsWithChildren<EditorProps>>,
  nextProps: Readonly<PropsWithChildren<EditorProps>>
) {
  return prevProps.className === nextProps.className;
}

export const Editor = memo(
  EditorComponent,
  propsAreEqual
) as React.ComponentType<EditorProps>;

Editor.propTypes = {
  className: PropTypes.string,
  editorDivRef: PropTypes.object,
};
