import Blockly, { WorkspaceSvg } from "blockly";
import { MutableRefObject, RefObject } from "react";

export interface CommonBlocklyProps {
  initialXml?: string;
  initialJson?: object;
  toolboxConfiguration?: Blockly.utils.toolbox.ToolboxDefinition;
  workspaceConfiguration: Blockly.BlocklyOptions;
  onWorkspaceChange?: (workspace: WorkspaceSvg) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onImportXmlError?: (error: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onImportError?: (error: any) => void;
  onInject?: (newWorkspace: WorkspaceSvg) => void;
  onDispose?: (workspace: WorkspaceSvg) => void;
}
export interface BlocklyWorkspaceProps extends CommonBlocklyProps {
  className?: string;
  onXmlChange?: (xml: string) => void;
  onJsonChange?: (worksapceJson: object) => void;
}
export interface UseBlocklyProps extends BlocklyWorkspaceProps {
  ref: RefObject<HTMLDivElement | null>;
}
export interface EditorProps {
  className?: string;
  editorDivRef: MutableRefObject<HTMLDivElement | null>;
}
