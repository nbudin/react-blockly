import Blockly, { Workspace } from "blockly";

function importFromXml(
  xml: string,
  workspace: Workspace,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onImportError?: (error: any) => void
) {
  try {
    if (workspace.getAllBlocks(false).length > 0) return; // we won't load blocks again if they are already loaded
    Blockly.Xml.domToWorkspace(Blockly.utils.xml.textToDom(xml), workspace);
    return true;
  } catch (e) {
    if (onImportError) {
      onImportError(e);
    }
    return false;
  }
}

export { importFromXml };
