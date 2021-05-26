import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import Blockly from "blockly";

import ConfigFiles from "./initContent/content";
import useBlocklyWorkspace from "./useBlocklyWorkspace";

const TestEditor = () => {
  const ref = useRef()
  const [code, setCode] = useState("")
  const [toolboxConfiguration, setToolboxConfiguration] = useState<any>(
    ConfigFiles.INITIAL_TOOLBOX_JSON
  );

  useEffect(() => {
    window.setTimeout(() => {
      setToolboxConfiguration((prevConfig) => ({
        ...prevConfig,
        contents: [
          ...prevConfig.contents,
          {
            kind: "category",
            name: "Dynamically added category",
            contents: [
              { kind: "block", type: "text" },
              {
                kind: "block",
                blockxml:
                  '<block type="text_print"><value name="TEXT"><shadow type="text">abc</shadow></value></block>',
              },
            ],
          },
        ],
      }));
    }, 2000);

    window.setTimeout(() => {
      setToolboxConfiguration((prevConfig) => ({
        ...prevConfig,
        contents: [
          ...prevConfig.contents.slice(0, prevConfig.contents.length - 1),
          {
            ...prevConfig.contents[prevConfig.contents.length - 1],
            contents: [{ kind: "block", type: "text" }],
          },
        ],
      }));
    }, 4000);

    window.setTimeout(() => {
      setToolboxConfiguration((prevConfig) => ({
        ...prevConfig,
        contents: [
          ...prevConfig.contents.slice(0, prevConfig.contents.length - 1),
        ],
      }));
    }, 10000);
  }, []);

  const onWorkspaceChange = (workspace: Blockly.WorkspaceSvg) => {
    console.log(`called immediately, no debouncing`)
  }

  const { workspace, xml } = useBlocklyWorkspace({
    ref,
    toolboxConfiguration,
    workspaceConfiguration: {
      grid: {
        spacing: 20,
        length: 3,
        colour: "#ccc",
        snap: true,
      },
    },
    initialXml: ConfigFiles.INITIAL_XML,
    onWorkspaceChange
  })

  // one time initializations
  useEffect(() => {
    if (workspace)
      workspace.registerButtonCallback("myFirstButtonPressed", () => {
        alert("button is pressed");
      });

  }, [workspace])

  // debounced serializations
  useEffect(() => {
    const newCode = workspace ? (Blockly as any).JavaScript.workspaceToCode(workspace) : ""
    setCode(newCode)
  }, [xml])


  // build the DOM you want!
  return (<>
    <p>react-blockly demo</p>
    <div style={({ width: "800px", height: "100%" })} ref={ref} />
    <pre>{xml}</pre>
    <pre>{code}</pre>
  </>);
};

ReactDOM.render(
  <React.StrictMode>
    <TestEditor />
  </React.StrictMode>,
  document.getElementById('root')
);
