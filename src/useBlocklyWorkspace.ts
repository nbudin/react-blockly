import React from "react";
import Blockly, { Workspace, WorkspaceSvg } from "blockly";
import { UseBlocklyProps } from "./BlocklyWorkspaceProps";

import debounce from "./debounce";

function importFromXml(
  xml: string,
  workspace: Workspace,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onImportError?: (error: any) => void
) {
  try {
    Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), workspace);
    return true;
  } catch (e) {
    if (onImportError) {
      onImportError(e);
    }
    return false;
  }
}

function importFromJson(
  json: object,
  workspace: Workspace,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onImportError?: (error: any) => void
) {
  try {
    Blockly.serialization.workspaces.load(json, workspace);
    return true;
  } catch (e) {
    if (onImportError) {
      onImportError(e);
    }
    return false;
  }
}

const useBlocklyWorkspace = ({
  ref,
  initialXml,
  initialJson,
  toolboxConfiguration,
  workspaceConfiguration,
  onWorkspaceChange,
  onImportError,
  onInject,
  onDispose,
}: UseBlocklyProps): { workspace: WorkspaceSvg | null; xml: string | null, json: object | null } => {
  const [workspace, setWorkspace] = React.useState<WorkspaceSvg | null>(null);
  const [xml, setXml] = React.useState<string | null>(initialXml);
  const [json, setJson] = React.useState<object | null>(initialJson);
  const [didInitialImport, setDidInitialImport] = React.useState(false);
  const [didHandleNewWorkspace, setDidHandleNewWorkspace] =
    React.useState(false);

  // we explicitly don't want to recreate the workspace when the configuration changes
  // so, we'll keep it in a ref and update as necessary in an effect hook
  const workspaceConfigurationRef = React.useRef(workspaceConfiguration);
  React.useEffect(() => {
    workspaceConfigurationRef.current = workspaceConfiguration;
  }, [workspaceConfiguration]);

  const toolboxConfigurationRef = React.useRef(toolboxConfiguration);
  React.useEffect(() => {
    toolboxConfigurationRef.current = toolboxConfiguration;
    if (toolboxConfiguration && workspace) {
      workspace.updateToolbox(toolboxConfiguration);
    }
  }, [toolboxConfiguration, workspace]);

  const onInjectRef = React.useRef(onInject);
  const onDisposeRef = React.useRef(onDispose);
  React.useEffect(() => {
    onInjectRef.current = onInject;
  }, [onInject]);
  React.useEffect(() => {
    onDisposeRef.current = onDispose;
  }, [onDispose]);

  const handleWorkspaceChanged = React.useCallback(
    (newWorkspace) => {
      if (onWorkspaceChange) {
        onWorkspaceChange(newWorkspace);
      }
    },
    [onWorkspaceChange]
  );

  // Workspace creation
  React.useEffect(() => {
    if (!ref.current) {
      return;
    }
    const newWorkspace = Blockly.inject(ref.current, {
      ...workspaceConfigurationRef.current,
      toolbox: toolboxConfigurationRef.current,
    });
    setWorkspace(newWorkspace);
    setDidInitialImport(false); // force a re-import if we recreate the workspace
    setDidHandleNewWorkspace(false); // Signal that a workspace change event needs to be sent.

    if (onInjectRef.current) {
      onInjectRef.current(newWorkspace);
    }

    const onDisposeFunction = onDisposeRef.current;

    // Dispose of the workspace when our div ref goes away (Equivalent to didComponentUnmount)
    return () => {
      newWorkspace.dispose();

      if (onDisposeFunction) {
        onDisposeFunction(newWorkspace);
      }
    };
  }, [ref]);

  // Send a workspace change event when the workspace is created
  React.useEffect(() => {
    if (workspace && !didHandleNewWorkspace) {
      handleWorkspaceChanged(workspace);
    }
  }, [handleWorkspaceChanged, didHandleNewWorkspace, workspace]);

  // Workspace change listener
  React.useEffect(() => {
    if (workspace == null) {
      return undefined;
    }

    const listener = () => {
      handleWorkspaceChanged(workspace);
    };
    workspace.addChangeListener(listener);
    return () => {
      workspace.removeChangeListener(listener);
    };
  }, [workspace, handleWorkspaceChanged]);

  // xmlDidChange callback
  React.useEffect(() => {
    if (workspace == null) {
      return undefined;
    }

    const [callback, cancel] = debounce(() => {
      const newXml = Blockly.Xml.domToText(
        Blockly.Xml.workspaceToDom(workspace)
      );
      if (newXml === xml) {
        return;
      }
      const newJson = Blockly.serialization.workspaces.save(workspace);
      setJson(newJson);
      setXml(newXml);
    }, 200);

    workspace.addChangeListener(callback);

    return () => {
      workspace.removeChangeListener(callback);
      cancel();
    };
  }, [workspace, xml]);

  // Initial Xml Changes
  React.useEffect(() => {
    if (xml && workspace && !didInitialImport) {
      const success = importFromXml(xml, workspace, onImportError);
      if (!success) {
        setXml(null);
      }
      setDidInitialImport(true);
    }
    else if (json && workspace && !didInitialImport) {
      const success = importFromJson(json, workspace, onImportError);
      if (!success) {
        setJson(null);
      }
      const jsonToXml = Blockly.Xml.domToText(
        Blockly.Xml.workspaceToDom(workspace)
      )
      setXml(jsonToXml);
      setDidInitialImport(true);
    }
  }, [json, xml, workspace, didInitialImport, onImportError]);

  return { workspace, xml, json };
};

export default useBlocklyWorkspace;
