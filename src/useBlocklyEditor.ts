import { MutableRefObject, useEffect, useRef } from "react";
import Blockly, { Workspace, WorkspaceSvg } from "blockly";
import { UseBlocklyEditorProps } from "./BlocklyWorkspaceProps";
import { ToolboxDefinition } from "blockly/core/utils/toolbox";

import debounce from "./debounce";
import { importFromXml } from "./importFromXml";
import { importFromJson } from "./importFromJson";

const useBlocklyEditor = ({
  onXmlChange,
  onJsonChange,
  initialXml,
  initialJson,
  toolboxConfiguration,
  workspaceConfiguration,
  onWorkspaceChange,
  onError,
  onInject,
  onDispose,
}: UseBlocklyEditorProps): {
  workspace: WorkspaceSvg | null;
  xml: string | null;
  json: object | null;
  editorRef: MutableRefObject<HTMLDivElement | null>;
  toolboxConfig: ToolboxDefinition;
  updateToolboxConfig: (
    cb?: ((configuration?: ToolboxDefinition) => ToolboxDefinition) | undefined
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
    _saveData(workspace, initialXml, initialJson);
    const [callback, cancel] = debounce(listener, 200);
    workspace.addChangeListener(callback);

    _onCallback(onInject, workspace);

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
        const isUpdate = _saveData(workspaceRef.current, newXml);
        isUpdate && _onCallback(onWorkspaceChange, workspaceRef.current);
      }
    } catch (e) {
      _onCallback(onError, e);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function _onCallback(cb?: (arg?: any) => void, arg?: any) {
    if (cb) {
      cb(arg);
    }
  }

  function _saveData(
    workspace: Workspace,
    xml?: string,
    json?: object
  ): boolean {
    if (!xml && !json) {
      return false;
    }
    let isUpdate = false;
    if (xml && xml !== xmlRef.current) {
      xmlRef.current = xml;
      importFromXml(xml, workspace, onError);
      jsonRef.current = Blockly.serialization.workspaces.save(workspace);
      isUpdate = true;
    } else if (json) {
      jsonRef.current = json;
      importFromJson(json, workspace, onError);
      const newXml = Blockly.Xml.domToText(
        Blockly.Xml.workspaceToDom(workspace)
      );
      if (newXml !== xmlRef.current) {
        xmlRef.current = newXml;
        isUpdate = true;
      }
    }
    if (isUpdate) {
      _onCallback(onXmlChange, xmlRef.current);
      _onCallback(onJsonChange, jsonRef.current);
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
