import Blockly, { WorkspaceSvg } from "blockly";
import { ToolboxDefinition } from "blockly/core/utils/toolbox";
import { MutableRefObject, RefObject } from "react";

export interface CommonBlocklyProps {
  initialXml?: string;
  initialJson?: object;
  toolboxConfiguration?: ToolboxDefinition;
  workspaceConfiguration: Blockly.BlocklyOptions;
  onWorkspaceChange?: (workspace: WorkspaceSvg) => void;
  onImportXmlError?: (error: any) => void;
  onImportError?: (error: any) => void;
  onInject?: (newWorkspace: WorkspaceSvg) => void;
  onDispose?: (workspace: WorkspaceSvg) => void;
}
export interface BlocklyWorkspaceProps extends CommonBlocklyProps {
  className?: string;
  onXmlChange?: (xml: string) => void;
  onJsonChange?: (workspaceJson: object) => void;
}
export interface UseBlocklyProps extends CommonBlocklyProps {
  ref: RefObject<Element>;
}
export interface BlocklyEditorProps {
  editorRef?: MutableRefObject<HTMLDivElement | null>;
  className?: string;
  forceData?: any;
}
export interface UseBlocklyEditorProps {
  workspaceConfiguration: Blockly.BlocklyOptions;
  toolboxConfiguration: ToolboxDefinition;
  initialXml?: string;
  initialJson?: object;
  onError?: (error: any) => void;
  onInject?: (workspace: WorkspaceSvg) => void;
  onDispose?: (workspace: WorkspaceSvg) => void;
  onChange?: (state: {
    workspace: WorkspaceSvg;
    xml: string;
    json: object;
  }) => void;
}
