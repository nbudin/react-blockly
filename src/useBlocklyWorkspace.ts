import {
  useState,
  useEffect,
  useRef,
  useCallback,
  MutableRefObject,
} from "react";
import Blockly, { Block } from "blockly";
import debounce from "./debounce";

function importFromXml(
  xml: string,
  workspace: Blockly.Workspace,
  onImportXmlError: (e: any) => void
) {
  try {
    Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), workspace);
    return true;
  } catch (e) {
    if (onImportXmlError) {
      onImportXmlError(e);
    }
    return false;
  }
}

export interface BlocklyWorkspaceProps {
  initialXml?: string;
  toolboxConfiguration?: any;
  workspaceConfiguration?: any;
  onWorkspaceChange?: (workspace: Blockly.WorkspaceSvg) => void;
  onImportXmlError?: (error: any) => void;
}

export default function useBlocklyWorkspace(
  props: {
    ref: MutableRefObject<HTMLElement>;
  } & BlocklyWorkspaceProps
) {
  const {
    ref,
    initialXml,
    toolboxConfiguration,
    workspaceConfiguration,
    onWorkspaceChange,
    onImportXmlError,
  } = props;
  const [workspace, setWorkspace] = useState<Blockly.WorkspaceSvg>();
  const [xml, setXml] = useState(initialXml);
  const [didInitialImport, setDidInitialImport] = useState(false);
  const [didHandleNewWorkspace, setDidHandleNewWorkspace] = useState(false);

  // we explicitly don't want to recreate the workspace when the configuration changes
  // so, we'll keep it in a ref and update as necessary in an effect hook
  const workspaceConfigurationRef = useRef(workspaceConfiguration);
  useEffect(() => {
    workspaceConfigurationRef.current = workspaceConfiguration;
  }, [workspaceConfiguration]);

  const toolboxConfigurationRef = useRef(toolboxConfiguration);
  useEffect(() => {
    toolboxConfigurationRef.current = toolboxConfiguration;
    if (toolboxConfiguration && workspace) {
      workspace.updateToolbox(toolboxConfiguration);
    }
  }, [toolboxConfiguration, workspace]);

  const handleWorkspaceChanged = useCallback(
    (newWorkspace: Blockly.WorkspaceSvg) => {
      if (onWorkspaceChange) {
        onWorkspaceChange(newWorkspace);
      }
    },
    [onWorkspaceChange]
  );

  // Workspace creation
  useEffect(() => {
    const newWorkspace = Blockly.inject(ref.current, {
      ...workspaceConfigurationRef.current,
      toolbox: toolboxConfigurationRef.current,
    });
    setWorkspace(newWorkspace);
    setDidInitialImport(false); // force a re-import if we recreate the workspace
    setDidHandleNewWorkspace(false); // Singal that a workspace change event needs to be sent.

    // Dispose of the workspace when our div ref goes away (Equivalent to didComponentUnmount)
    return () => newWorkspace.dispose();
  }, [ref]);

  // Send a workspace change event when the workspace is created
  useEffect(() => {
    if (workspace && !didHandleNewWorkspace) {
      handleWorkspaceChanged(workspace);
    }
  }, [handleWorkspaceChanged, didHandleNewWorkspace, workspace]);

  // Workspace change listener
  useEffect(() => {
    if (!workspace) return undefined;
    const listener = () => handleWorkspaceChanged(workspace);
    workspace.addChangeListener(listener);
    return () => workspace.removeChangeListener(listener);
  }, [workspace, handleWorkspaceChanged]);

  // xmlDidChange callback
  useEffect(() => {
    if (!workspace) return undefined;

    const { debounced, cancel } = debounce(() => {
      const newXml = Blockly.Xml.domToText(
        Blockly.Xml.workspaceToDom(workspace)
      );
      if (newXml === xml) return;

      setXml(newXml);
    }, 200);

    workspace.addChangeListener(debounced);
    return () => {
      workspace.removeChangeListener(debounced);
      cancel();
    };
  }, [workspace, xml]);

  // Initial Xml Changes
  useEffect(() => {
    if (xml && workspace && !didInitialImport) {
      const success = importFromXml(xml, workspace, onImportXmlError);
      if (!success) {
        setXml(null);
      }
      setDidInitialImport(true);
    }
  }, [xml, workspace, didInitialImport, onImportXmlError]);

  return { workspace, xml };
}
