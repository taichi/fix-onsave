'use strict';
import {
    commands, workspace,
    ExtensionContext,
    TextDocumentWillSaveEvent,
    TextDocument, TextEdit, WorkspaceEdit
} from 'vscode';

export function activate(context: ExtensionContext) {
    workspace.onWillSaveTextDocument(onWillSave);
}

const supported_languages = ["javascript", "javascriptreact"];
function supports(languageId: string): boolean {
    return -1 < supported_languages.indexOf(languageId);
}

function onWillSave(event: TextDocumentWillSaveEvent) {
    let doc = event.document;
    if (supports(doc.languageId) && workspace.getConfiguration("fix").get("onSave")) {
        commands.executeCommand("eslint.executeAutofix");
    };
}
