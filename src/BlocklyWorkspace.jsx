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
  workspaceConfiguration: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  wrapperDivClassName: PropTypes.string,
  xmlDidChange: PropTypes.func,
  workspaceDidChange: PropTypes.func,
  onImportXmlError: PropTypes.func,
  toolboxMode: PropTypes.oneOf(["CATEGORIES", "BLOCKS"]),
};

const defaultProps = {
  initialXml: null,
  workspaceConfiguration: null,
  wrapperDivClassName: null,
  xmlDidChange: null,
  workspaceDidChange: null,
  onImportXmlError: null,
  toolboxMode: "BLOCKS",
};

function BlocklyWorkspace({
  initialXml,
  workspaceConfiguration,
  wrapperDivClassName,
  xmlDidChange,
  workspaceDidChange,
  onImportXmlError,
  toolboxMode,
}) {
  const [workspace, setWorkspace] = React.useState(null);
  const [xml, setXml] = React.useState(initialXml);
  const [didInitialImport, setDidInitialImport] = React.useState(false);

  const editorDiv = React.useRef(null);
  const dummyToolbox = React.useRef(null);

  // we explicitly don't want to recreate the workspace when the configuration changes
  // so, we'll keep it in a ref and update as necessary in an effect hook
  const workspaceConfigurationRef = React.useRef(workspaceConfiguration);
  React.useEffect(() => {
    workspaceConfigurationRef.current = workspaceConfiguration;
  }, [workspaceConfiguration]);

  const handleXmlChanged = React.useCallback(
    (newXml) => {
      if (xmlDidChange) {
        xmlDidChange(newXml);
      }
    },
    [xmlDidChange]
  );

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
      toolbox: dummyToolbox.current,
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
      handleXmlChanged(newXml);
    }, 200);

    workspace.addChangeListener(callback);

    return () => {
      workspace.removeChangeListener(callback);
      cancel();
    };
  }, [workspace, xml, handleXmlChanged]);

  // Initial Xml Changes
  React.useEffect(() => {
    if (xml && workspace && !didInitialImport) {
      if (importFromXml(xml, workspace, onImportXmlError)) {
        handleXmlChanged(xml);
      } else {
        setXml(null);
        handleXmlChanged(null);
      }
      setDidInitialImport(true);
    }
  }, [xml, workspace, didInitialImport, handleXmlChanged, onImportXmlError]);

  // We have to fool Blockly into setting up a toolbox with categories initially;
  // otherwise it will refuse to do so after we inject the real categories into it.
  let dummyToolboxContent;
  if (toolboxMode === "CATEGORIES") {
    dummyToolboxContent = <category name="Dummy toolbox" colour="" is="div" />;
  }

  return (
    <div className={wrapperDivClassName}>
      <xml style={{ display: "none" }} ref={dummyToolbox} is="div">
        {dummyToolboxContent}
      </xml>
      <div className={wrapperDivClassName} ref={editorDiv} />
    </div>
  );
}

BlocklyWorkspace.propTypes = propTypes;
BlocklyWorkspace.defaultProps = defaultProps;

export default BlocklyWorkspace;
