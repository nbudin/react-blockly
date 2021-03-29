import React from "react";
import PropTypes from "prop-types";
import Blockly from "blockly";

import { importFromXml } from "./BlocklyHelper";

function debounce(func, wait) {
  let timeout = null;
  let later = null;

  const debouncedFunction = (...args) => {
    later = () => {
      timeout = null;
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };

  const cancel = () => {
    if (timeout !== null) {
      clearTimeout(timeout);
      later();
    }
  };

  return [debouncedFunction, cancel];
}

const propTypes = {
  initialXml: PropTypes.string,
  toolboxConfiguration: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  workspaceConfiguration: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  className: PropTypes.string,
  workspaceDidChange: PropTypes.func,
  onImportXmlError: PropTypes.func,
};

const defaultProps = {
  initialXml: null,
  toolboxConfiguration: null,
  workspaceConfiguration: null,
  className: null,
  workspaceDidChange: null,
  onImportXmlError: null,
};

function BlocklyWorkspace({
  initialXml,
  toolboxConfiguration,
  workspaceConfiguration,
  className,
  workspaceDidChange,
  onImportXmlError,
}) {
  const [workspace, setWorkspace] = React.useState(null);
  const [xml, setXml] = React.useState(initialXml);
  const [didInitialImport, setDidInitialImport] = React.useState(false);

  const editorDiv = React.useRef(null);

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

  const handleWorkspaceChanged = React.useCallback(
    (newWorkspace) => {
      if (workspaceDidChange) {
        workspaceDidChange(newWorkspace);
      }
    },
    [workspaceDidChange]
  );

  // Initial mount
  React.useEffect(() => {
    const newWorkspace = Blockly.inject(editorDiv.current, {
      ...workspaceConfigurationRef.current,
      toolbox: toolboxConfigurationRef.current,
    });
    setWorkspace(newWorkspace);
    setDidInitialImport(false); // force a re-import if we recreate the workspace
    handleWorkspaceChanged(newWorkspace);
    newWorkspace.addChangeListener(() => {
      handleWorkspaceChanged(newWorkspace);
    });

    // Dispose of the workspace when our div ref goes away (Equivalent to didComponentUnmount)
    return () => {
      newWorkspace.dispose();
    };
  }, [handleWorkspaceChanged]);

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
      const success = importFromXml(xml, workspace, onImportXmlError);
      if (!success) {
        setXml(null);
      }
      setDidInitialImport(true);
    }
  }, [xml, workspace, didInitialImport, onImportXmlError]);

  return <div className={className} ref={editorDiv} />;
}

BlocklyWorkspace.propTypes = propTypes;
BlocklyWorkspace.defaultProps = defaultProps;

export default BlocklyWorkspace;
