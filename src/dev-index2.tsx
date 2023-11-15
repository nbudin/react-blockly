import React, { useState } from "react";
import ReactDOM from "react-dom";
import Blockly, { Workspace } from "blockly";
import { javascriptGenerator } from "blockly/javascript";

import { useBlocklyEditor } from "./index";
import ConfigFiles from "./initContent/content";

import "./dev-index.css";
import { BlocklyEditor } from "./BlocklyEditor";

const TestEditor = () => {
  const [generatedXml, setGeneratedXml] = useState("");
  const [generatedJson, setGeneratedJson] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const workspaceConfiguration = {
    grid: {
      spacing: 20,
      length: 3,
      colour: "#ccc",
      snap: true,
    },
  };

  const onWorkspaceChange = React.useCallback((workspace) => {
    workspace.registerButtonCallback("myFirstButtonPressed", () => {
      alert("button is pressed");
    });
    const newXml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
    setGeneratedXml(newXml);
    const newJson = JSON.stringify(
      Blockly.serialization.workspaces.save(workspace)
    );
    setGeneratedJson(newJson);
    const code = javascriptGenerator.workspaceToCode(workspace);
    setGeneratedCode(code);
  }, []);

  const onXmlChange = React.useCallback((newXml) => {
    setGeneratedXml(newXml);
  }, []);

  const onJsonChange = React.useCallback((newJson) => {
    setGeneratedJson(JSON.stringify(newJson));
  }, []);

  const { editorRef, updateToolboxConfig } = useBlocklyEditor({
    initialXml: ConfigFiles.INITIAL_XML,
    initialJson: ConfigFiles.INITIAL_JSON,
    toolboxConfiguration: ConfigFiles.INITIAL_TOOLBOX_JSON,
    workspaceConfiguration,
    onWorkspaceChange,
    onError,
    onInject,
    onDispose,
    onXmlChange,
    onJsonChange,
  });

  React.useEffect(() => {
    window.setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      updateToolboxConfig((toolboxConfig) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (toolboxConfig && "contents" in toolboxConfig) {
          return {
            ...toolboxConfig,
            contents: [
              ...toolboxConfig.contents,
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
          };
        }
      });
    }, 2000);

    window.setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      updateToolboxConfig((toolboxConfig) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (toolboxConfig && "contents" in toolboxConfig) {
          return {
            ...toolboxConfig,
            contents: [
              ...toolboxConfig.contents.slice(
                0,
                toolboxConfig.contents.length - 1
              ),
              {
                ...toolboxConfig.contents[toolboxConfig.contents.length - 1],
                contents: [{ kind: "block", type: "text" }],
              },
            ],
          };
        }
      });
    }, 5000);

    window.setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      updateToolboxConfig((toolboxConfig) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (toolboxConfig && "contents" in toolboxConfig) {
          return {
            ...toolboxConfig,
            contents: [
              ...toolboxConfig.contents.slice(
                0,
                toolboxConfig.contents.length - 1
              ),
            ],
          };
        }
      });
    }, 6000);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onError(error: any) {
    console.log(error);
  }

  function onInject(workspace: Workspace) {
    console.log("onInject", workspace);
  }

  function onDispose() {
    console.log("onDispose");
  }

  return (
    <>
      <div style={{ height: "600px", width: "800px" }}>
        <BlocklyEditor className={"fill-height"} editorRef={editorRef} />
      </div>
      <pre>{generatedXml}</pre>
      <p>{generatedJson}</p>
      <textarea
        style={{ height: "200px", width: "400px" }}
        value={generatedCode}
        readOnly
      />
    </>
  );
};

window.addEventListener("load", () => {
  const editor = React.createElement(TestEditor);
  const root = document.createElement("div");
  document.body.appendChild(root);

  ReactDOM.render(editor, root);
});
