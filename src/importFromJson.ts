import Blockly, { Workspace } from "blockly";

function importFromJson(
  json: object,
  workspace: Workspace,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onImportError?: (error: any) => void
) {
  try {
    Blockly.serialization.workspaces.load(json, workspace);
    return true;
  } catch (e) {
    if (onImportError) {
      onImportError(e);
    }
    return false;
  }
}

export { importFromJson };
