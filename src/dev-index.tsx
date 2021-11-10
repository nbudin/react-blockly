/* eslint-disable import/no-extraneous-dependencies */

import React from "react";
import ReactDOM from "react-dom";
import Blockly from "blockly";

import { BlocklyWorkspace } from "./index";
import ConfigFiles from "./initContent/content";

const TestEditor = () => {
  const [toolboxConfiguration, setToolboxConfiguration] = React.useState<any>(
    ConfigFiles.INITIAL_TOOLBOX_JSON
  );

  React.useEffect(() => {
    window.setTimeout(() => {
      setToolboxConfiguration((prevConfig: any) => ({
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
      setToolboxConfiguration((prevConfig: any) => ({
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
      setToolboxConfiguration((prevConfig: any) => ({
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
    document.getElementById("generated-xml")!.innerText = newXml;

    //@ts-ignore
    const code = Blockly.JavaScript.workspaceToCode(workspace);
    //@ts-ignore
    document.getElementById("code").value = code;
  }, []);

  const onXmlChange = React.useCallback((newXml) => {
    document.getElementById("generated-xml")!.innerText = newXml;
  }, []);

  return (
    <BlocklyWorkspace
      toolboxConfiguration={toolboxConfiguration}
      workspaceConfiguration={{
        grid: {
          spacing: 20,
          length: 3,
          colour: "#ccc",
          snap: true,
        },
      }}
      initialXml={ConfigFiles.INITIAL_XML}
      className="fill-height"
      onWorkspaceChange={onWorkspaceChange}
      onXmlChange={onXmlChange}
    />
  );
};

window.addEventListener("load", () => {
  const editor = React.createElement(TestEditor);
  ReactDOM.render(editor, document.getElementById("blockly"));
});
