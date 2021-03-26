import React from 'react';
import PropTypes from 'prop-types';
import Blockly from 'blockly';

import {importFromXml} from './BlocklyHelper'

function debounce(func, wait) {
  let timeout = null;
  let later = null;

  const debouncedFunction = function(...args) {
    later = function later() {
      timeout = null;
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };

  const cancel = function() {
    if (timeout !== null) {
      clearTimeout(timeout) 
      later();   
    }
  };

  return [debouncedFunction, cancel];
}

function handleXmlChanged(xml, xmlDidChange) {
  if (xmlDidChange) {
    xmlDidChange(xml);
  }
}

function handleWorkspaceChanged(workspace, workspaceDidChange) {
  if (workspaceDidChange) {
    workspaceDidChange(workspace);
  }
}

const propTypes = {
  initialXml: PropTypes.string,
  workspaceConfiguration: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  wrapperDivClassName: PropTypes.string,
  xmlDidChange: PropTypes.func,
  workspaceDidChange: PropTypes.func,
  onImportXmlError: PropTypes.func,
  toolboxMode: PropTypes.oneOf(['CATEGORIES', 'BLOCKS']),
}

const defaultProps = {
  initialXml: null,
  workspaceConfiguration: null,
  wrapperDivClassName: null,
  xmlDidChange: null,
  workspaceDidChange: null,
  onImportXmlError: null,
  toolboxMode: 'BLOCKS',
}


function BlocklyWorkspace(props) {
  const [workspace, setWorkspace] = React.useState(null);
  const [xml, setXml] = React.useState(props.initialXml);

  const editorDiv = React.useRef(null);
  const dummyToolbox = React.useRef(null);

  // Initial mount
  React.useEffect(() => {
    const newWorkspace = Blockly.inject(
      editorDiv.current,
      {
        ...props.workspaceConfiguration,
        toolbox: dummyToolbox.current
      },
    );
    setWorkspace(newWorkspace);

    if (xml) {
      if (importFromXml(xml, newWorkspace, props.onImportXmlError)) {
        handleXmlChanged(xml, props.xmlDidChange);
      } else {
        setXml(null);
        handleXmlChanged(null, props.xmlDidChange);
      }
    }

    // Dispose of the workspace when our div ref goes away (Equivalent to didComponentUnmount)
    return () => {
      newWorkspace.dispose();
    };
  }, [editorDiv]);


  // workspaceDidChange callback
  React.useEffect(() => {
    if (workspace === null) {
      return;
    }

    const callback = () => {
      handleWorkspaceChanged(workspace, props.workspaceDidChange);
    };

    workspace.addChangeListener(callback);

    return () => { workspace.removeChangeListener(callback); };
  }, [workspace, props.workspaceDidChange]);


  // xmlDidChange callback
  React.useEffect(() => {
    if (workspace === null) {
      return;
    }

    const [callback, cancel] = debounce(() => {
      const newXml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
      if (newXml === xml) {
        return;
      }

      setXml(newXml);
      handleXmlChanged(newXml, props.xmlDidChange);
    }, 200);

    workspace.addChangeListener(callback);

    return () => { 
      workspace.removeChangeListener(callback); 
      cancel();
    };
  }, [workspace, xml, props.xmlDidChange]);

  // Initial Xml Changes
  React.useEffect(() => {
    setXml(props.initialXml);
  }, [props.initialXml]);

  // We have to fool Blockly into setting up a toolbox with categories initially;
  // otherwise it will refuse to do so after we inject the real categories into it.
  let dummyToolboxContent;
  if (props.toolboxMode === 'CATEGORIES') {
    dummyToolboxContent = (
      <category name="Dummy toolbox" colour='' is="div"/>
    );
  }

  return (
    <div className={props.wrapperDivClassName}>
      <xml style={{ display: 'none' }}
        ref={dummyToolbox}
        is="div">
        {dummyToolboxContent}
      </xml>
      <div
        className={props.wrapperDivClassName}
        ref={editorDiv}
      />
    </div>
  );
}

BlocklyWorkspace.propTypes = propTypes;
BlocklyWorkspace.defaultProps = defaultProps;

export default BlocklyWorkspace;
