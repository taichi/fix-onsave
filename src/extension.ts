'use strict';
import { commands, workspace,
    ExtensionContext,
    TextDocument, TextEdit, WorkspaceEdit } from 'vscode';

export function activate(context: ExtensionContext) {
    workspace.onDidSaveTextDocument(onSave);
}

const supported_languages = ["javascript", "javascriptreact"];
function supports(languageId: string): boolean {
    return -1 < supported_languages.indexOf(languageId);
}

function onSave(doc: TextDocument) {
    if (supports(doc.languageId) && workspace.getConfiguration("fix").get("onSave")) {
        let t = commands.executeCommand("vscode.executeFormatDocumentProvider", doc.uri, {});
        t.then((edits: TextEdit[]) => {
            let we = new WorkspaceEdit();
            we.set(doc.uri, edits);
            return workspace.applyEdit(we).then(() => {
                return commands.executeCommand("eslint.executeAutofix");
            }).then(() => doc.save());
        });
    }

}

export function deactivate() {
}
