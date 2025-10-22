import * as Blockly from "blockly/core";
import { WorkspaceSvg } from "blockly";
import { RefObject } from "react";

export interface CommonBlocklyProps {
  initialXml?: string;
  initialJson?: object;
  toolboxConfiguration?: Blockly.utils.toolbox.ToolboxDefinition;
  workspaceConfiguration: Blockly.BlocklyOptions;
  onWorkspaceChange?: (_workspace: WorkspaceSvg) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onImportXmlError?: (_error: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onImportError?: (_error: any) => void;
  onInject?: (_newWorkspace: WorkspaceSvg) => void;
  onDispose?: (_workspace: WorkspaceSvg) => void;
}
export interface BlocklyWorkspaceProps extends CommonBlocklyProps {
  className?: string;
  onXmlChange?: (_xml: string) => void;
  onJsonChange?: (_worksapceJson: object) => void;
}
export interface UseBlocklyProps extends CommonBlocklyProps {
  ref: RefObject<HTMLDivElement | null>;
}
