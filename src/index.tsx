import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import Blockly from "blockly";

import ConfigFiles from "./initContent/content";
import useBlocklyWorkspace from "./useBlocklyWorkspace";

export function TestEditor() {
    const ref = useRef<HTMLDivElement>(null)
    const [code, setCode] = useState("")
    const [toolboxConfiguration, setToolboxConfiguration] = useState<any>(
        ConfigFiles.INITIAL_TOOLBOX_JSON
    );

    useEffect(() => {
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

    const onWorkspaceChange = (workspace: Blockly.WorkspaceSvg) => {
        console.log(`called immediately, no debouncing`, workspace)
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
    }, [workspace, xml])


    // build the DOM you want!
    return (<>
        <div className="blockly" ref={ref} />
        <pre>{xml}</pre>
        <pre>{code}</pre>
    </>);
};

ReactDOM.render(
    <TestEditor />,
    document.getElementById('root')
);
