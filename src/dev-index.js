import React from 'react';
import ReactDOM from 'react-dom';
import ReactBlocklyComponent from './index';

window.addEventListener('load', () => {
  const editor = React.createElement(ReactBlocklyComponent.BlocklyEditor, {
    workspaceConfiguration: {
      grid: {
        spacing: 20,
        length: 3,
        colour: '#ccc',
        snap: true,
      },
    },
    toolboxCategories: [
      {
        name: 'Controls',
        blocks: [
          { type: 'controls_if' },
          {
            type: 'controls_repeat_ext',
            values: {
              TIMES: {
                type: 'math_number',
                shadow: true,
                fields: {
                  NUM: 10,
                },
              },
            },
            statements: {
              DO: {
                type: 'text_print',
                shadow: true,
                values: {
                  TEXT: {
                    type: 'text',
                    shadow: true,
                    fields: {
                      TEXT: 'abc',
                    },
                  },
                },
              },
            },
          },
        ],
      },
      {
        name: 'Text',
        blocks: [
          { type: 'text' },
          {
            type: 'text_print',
            values: {
              TEXT: {
                type: 'text',
                shadow: true,
                fields: {
                  TEXT: 'abc',
                },
              },
            },
          },
        ],
      },
    ],
    initialXml: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="text" x="70" y="30"><field name="TEXT"></field></block></xml>',
    wrapperDivClassName: 'fill-height',
    workspaceDidChange: (workspace) => {
      const newXml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
      document.getElementById('generated-xml').innerText = newXml;

      const code = Blockly.JavaScript.workspaceToCode(workspace);
      document.getElementById('code').value = code;
    },
  });
  ReactDOM.render(editor, document.getElementById('blockly'));
});
