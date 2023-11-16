import { MutableRefObject, useEffect, useRef } from "react";
import Blockly, { Workspace, WorkspaceSvg } from "blockly";
import { UseBlocklyEditorProps } from "./BlocklyWorkspaceProps";
import { ToolboxDefinition } from "blockly/core/utils/toolbox";

import debounce from "./debounce";
import { importFromXml } from "./importFromXml";
import { importFromJson } from "./importFromJson";

const useBlocklyEditor = ({
  workspaceConfiguration,
  toolboxConfiguration,
  initial,
  onError,
  onInject,
  onChange,
  onDispose,
}: UseBlocklyEditorProps): {
  workspace: WorkspaceSvg | null;
  xml: string | null;
  json: object | null;
  editorRef: MutableRefObject<HTMLDivElement | null>;
  toolboxConfig: ToolboxDefinition;
  updateToolboxConfig: (
    cb?: (configuration?: ToolboxDefinition) => ToolboxDefinition
  ) => void;
} => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const workspaceRef = useRef<WorkspaceSvg | null>(null);
  const xmlRef = useRef<string | null>(null);
  const jsonRef = useRef<object | null>(null);
  // we explicitly don't want to recreate the workspace when the configuration changes
  // so, we'll keep it in a ref and update as necessary in an effect hook
  const workspaceConfigurationRef = useRef(workspaceConfiguration);
  const toolboxConfigurationRef = useRef(toolboxConfiguration);

  // Workspace creation
  useEffect(() => {
    if (!editorRef.current) {
      return;
    }
    const workspace = Blockly.inject(editorRef.current as HTMLDivElement, {
      ...workspaceConfigurationRef.current,
      toolbox: toolboxConfigurationRef.current,
    });
    workspaceRef.current = workspace;
    _onCallback(onInject, workspace);
    _saveData(workspace, initial);
    const [callback, cancel] = debounce(listener, 200);
    workspace.addChangeListener(callback);

    // Dispose of the workspace when our div ref goes away (Equivalent to didComponentUnmount)
    return () => {
      workspace.removeChangeListener(callback);
      cancel();
      workspace.dispose();
      _onCallback(onDispose, workspace);
    };
    // eslint-disable-next-line
  }, []);

  function listener() {
    try {
      if (workspaceRef.current) {
        const newXml = Blockly.Xml.domToText(
          Blockly.Xml.workspaceToDom(workspaceRef.current)
        );
        _saveData(workspaceRef.current, newXml);
      }
    } catch (e) {
      _onCallback(onError, e);
    }
  }

  function _onCallback(cb?: (arg?: any) => void, arg?: any) {
    if (cb) {
      cb(arg);
    }
  }

  function _saveData(workspace: Workspace, data?: string | object): boolean {
    if (!data) {
      return false;
    }
    let isUpdate = false;
    if ((data as string) && data !== xmlRef.current) {
      xmlRef.current = data as string;
      importFromXml(data as string, workspace, onError);
      jsonRef.current = Blockly.serialization.workspaces.save(workspace);
      isUpdate = true;
    } else if (data as object) {
      jsonRef.current = data as object;
      importFromJson(data as object, workspace, onError);
      const newXml = Blockly.Xml.domToText(
        Blockly.Xml.workspaceToDom(workspace)
      );
      if (newXml !== xmlRef.current) {
        xmlRef.current = newXml;
        isUpdate = true;
      }
    }
    if (isUpdate) {
      _onCallback(onChange, {
        workspace,
        xml: xmlRef.current,
        json: jsonRef.current,
      });
    }
    return isUpdate;
  }

  function updateToolboxConfig(
    cb?: (configuration?: ToolboxDefinition) => ToolboxDefinition
  ) {
    if (cb) {
      const configuration: ToolboxDefinition = cb(
        toolboxConfigurationRef.current
      );
      if (
        configuration &&
        workspaceRef.current &&
        !workspaceConfiguration?.readOnly
      ) {
        toolboxConfigurationRef.current = configuration;
        workspaceRef.current.updateToolbox(configuration);
      }
    }
  }

  return {
    workspace: workspaceRef.current,
    xml: xmlRef.current,
    json: jsonRef.current,
    editorRef,
    toolboxConfig: toolboxConfigurationRef.current as ToolboxDefinition,
    updateToolboxConfig,
  };
};

export { useBlocklyEditor };
