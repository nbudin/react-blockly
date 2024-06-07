import React, { useState } from "react";
import ReactDOM from "react-dom";
import * as Blockly from "blockly/core";
import { javascriptGenerator } from "blockly/javascript";

import { BlocklyWorkspace } from "./index";
import ConfigFiles from "./initContent/content";
import { ToolboxInfo } from "blockly/core/utils/toolbox";

import "./dev-index.css";

const TestEditor = () => {
  const [toolboxConfiguration, setToolboxConfiguration] =
    React.useState<ToolboxInfo>(ConfigFiles.INITIAL_TOOLBOX_JSON);
  const [generatedXml, setGeneratedXml] = useState("");
  const [generatedJson, setGeneratedJson] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");

  React.useEffect(() => {
    window.setTimeout(() => {
      setToolboxConfiguration((prevConfig: ToolboxInfo) => ({
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
      setToolboxConfiguration((prevConfig: ToolboxInfo) => ({
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
      setToolboxConfiguration((prevConfig: ToolboxInfo) => ({
        ...prevConfig,
        contents: [
          ...prevConfig.contents.slice(0, prevConfig.contents.length - 1),
        ],
      }));
    }, 10000);
  }, []);

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
  const [serialState, setSerialState] = useState<"XML" | "JSON">("XML");
  return (
    <>
      <div style={{ height: "600px", width: "800px" }}>
        <button
          onClick={(e) =>
            setSerialState(
              (e.target as HTMLElement).innerText == "XML" ? "XML" : "JSON"
            )
          }
        >
          {serialState == "XML" ? "JSON" : "XML"}{" "}
        </button>
        <BlocklyWorkspace
          key={serialState}
          toolboxConfiguration={toolboxConfiguration}
          workspaceConfiguration={{
            grid: {
              spacing: 20,
              length: 3,
              colour: "#ccc",
              snap: true,
            },
          }}
          initialXml={
            serialState === "XML" ? ConfigFiles.INITIAL_XML : undefined
          }
          initialJson={
            serialState === "JSON" ? ConfigFiles.INITIAL_JSON : undefined
          }
          className="fill-height"
          onWorkspaceChange={onWorkspaceChange}
          onXmlChange={onXmlChange}
          onJsonChange={onJsonChange}
        />
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
