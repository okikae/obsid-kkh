import { addIcon, App, Editor, MarkdownView, Menu, Modal, Notice,
         Plugin, PluginSettingTab, Setting } from 'obsidian';
import { kanaArray } from "./kanajisyo";
import { kanjiArray } from "./kanjijisyo";


// これらのクラスとインターフェイスの名前を変更するのを忘れずに！
interface kkhPluginSettings {
    mySetting: string;
}


const DEFAULT_SETTINGS: kkhPluginSettings = {
    mySetting: '既定'
}


export default class kkhPlugin extends Plugin {
    settings: kkhPluginSettings;

    async onload() {
        await this.loadSettings();

///////////////////////////////////////////////////////////////////////
// コマンドパレットからコマンドを呼び出して操作する
///////////////////////////////////////////////////////////////////////
// 新仮名遣いから旧仮名遣いへ変換(コマンドパレットから)
this.addCommand({
    id: 'kkh-tradkana',
    name: '旧仮名遣いへ変換',
    editorCallback: (editor: Editor, view: MarkdownView) => {
        let selectedText = editor.getSelection();
        selectedText = modernToTrad(selectedText);
        editor.replaceSelection(selectedText);
    }
});

// 旧仮名遣いから新仮名遣いへ変換(コマンドパレットから)
this.addCommand({
    id: 'kkh-modernkana',
    name: '新仮名遣いへ変換',
    editorCallback: (editor: Editor, view: MarkdownView) => {
        let selectedText = editor.getSelection();
        selectedText = tradToModern(selectedText);
        editor.replaceSelection(selectedText);
    }
});

// 新漢字から旧漢字へ変換(コマンドパレットから)
this.addCommand({
    id: 'kkh-oldkanji',
    name: '旧漢字へ変換',
    editorCallback: (editor: Editor, view: MarkdownView) => {
        let selectedText = editor.getSelection();
        selectedText = newToOld(selectedText);
        editor.replaceSelection(selectedText);
    }
});

// 旧漢字から新漢字へ変換(コマンドパレットから)
this.addCommand({
    id: 'kkh-newkanji',
    name: '新漢字へ変換',
    editorCallback: (editor: Editor, view: MarkdownView) => {
        let selectedText = editor.getSelection();
        selectedText = oldToNew(selectedText);
        editor.replaceSelection(selectedText);
    }
});

// 新字新仮名遣いから旧字旧仮名遣いへ変換(コマンドパレットから)
this.addCommand({
    id: 'kkh-tradkana-oldkanji',
    name: '旧字旧仮名遣いへ変換',
    editorCallback: (editor: Editor, view: MarkdownView) => {
        let selectedText = editor.getSelection();
        selectedText = modernToTrad(selectedText);
        selectedText = newToOld(selectedText);
        editor.replaceSelection(selectedText);
    }
});

// 旧字旧仮名遣いから新字新仮名遣いへ変換(コマンドパレットから)
this.addCommand({
    id: 'kkh-modernkana-newkanji',
    name: '新字新仮名遣いへ変換',
    editorCallback: (editor: Editor, view: MarkdownView) => {
        let selectedText = editor.getSelection();
        selectedText = oldToNew(selectedText);
        selectedText = tradToModern(selectedText);
        editor.replaceSelection(selectedText);
    }
});

// 辞書の大きさをポップアップメッセージに表示(コマンドパレットから)
this.addCommand({
    id: 'kkh-dictionary-info',
    name: '辞書の情報',
    callback: () => {
        const message = "かな辞書:" + kanaArray.length + '  ' +
                        "漢字辞書:" + kanjiArray.length;
        new Notice(message);
    }
});

/////////////////////////////////////////////////////////////////////////
// リボンからメニューを選択して操作する
/////////////////////////////////////////////////////////////////////////
this.addRibbonIcon('dice', 'kkh メニュー', (event) => {
    const menu = new Menu();

    menu.addItem((item) =>
        item
            .setTitle('かな：旧仮名遣いへ変換')
            .setIcon('')  // モバイル版では表示される
            .onClick(() => {
                let view = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (!view) {
                    // View は null の時もある。この場合は何もしない
                } else {
                    let view_mode = view.getMode();
                    switch (view_mode) {
                        case "preview":
                            new Notice('編集モードにしてください！');
                            break;
                        case "source":
                            if ("editor" in view) {
                                let selectedText = view.editor.getSelection();
                                if (selectedText.length === 0) {
                                    new Notice('文字列が選択されていません！');
                                } else {
                                    selectedText = modernToTrad(selectedText);
                                    view.editor.replaceSelection(selectedText);
                                    new Notice('旧仮名遣いへ変換しました！');
                                }
                            }
                            break;
                        default:
                            break;
                    }
                }
            })
                );

    menu.addItem((item) =>
        item
            .setTitle('かな：新仮名遣いへ変換')
            .setIcon('')  // モバイル版では表示される
            .onClick(() => {
                let view = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (!view) {
                    // View は null の時もある。この場合は何もしない
                } else {
                    let view_mode = view.getMode();
                    switch (view_mode) {
                        case "preview":
                            new Notice('編集モードにしてください！');
                            break;
                        case "source":
                            if ("editor" in view) {
                                let selectedText = view.editor.getSelection();
                                if (selectedText.length === 0) {
                                    new Notice('文字列が選択されていません！');
                                } else {
                                    selectedText = tradToModern(selectedText);
                                    view.editor.replaceSelection(selectedText);
                                    new Notice('新仮名遣いへ変換しました！');
                                }
                            }
                            break;
                        default:
                            break;
                    }
                }
            })
                );

    menu.addSeparator();

    menu.addItem((item) =>
        item
            .setTitle('漢字：旧漢字へ変換')
            .setIcon('')  // モバイル版では表示される
            .onClick(() => {
                let view = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (!view) {
                    // View は null の時もある。この場合は何もしない
                } else {
                    let view_mode = view.getMode();
                    switch (view_mode) {
                        case "preview":
                            new Notice('編集モードにしてください！');
                            break;
                        case "source":
                            if ("editor" in view) {
                                let selectedText = view.editor.getSelection();
                                if (selectedText.length === 0) {
                                    new Notice('文字列が選択されていません！');
                                } else {
                                    selectedText = newToOld(selectedText);
                                    view.editor.replaceSelection(selectedText);
                                    new Notice('旧漢字へ変換しました！');
                                }
                            }
                            break;
                        default:
                            break;
                    }
                }
            })
                );

    menu.addItem((item) =>
        item
            .setTitle('漢字：新漢字へ変換')
            .setIcon('')  // モバイル版では表示される
            .onClick(() => {
                let view = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (!view) {
                    // View は null の時もある。この場合は何もしない
                } else {
                    let view_mode = view.getMode();
                    switch (view_mode) {
                        case "preview":
                            new Notice('編集モードにしてください！');
                            break;
                        case "source":
                            if ("editor" in view) {
                                let selectedText = view.editor.getSelection();
                                if (selectedText.length === 0) {
                                    new Notice('文字列が選択されていません！');
                                } else {
                                    selectedText = oldToNew(selectedText);
                                    view.editor.replaceSelection(selectedText);
                                    new Notice('新漢字へ変換しました！');
                                }
                            }
                            break;
                        default:
                            break;
                    }
                }
            })
                );

    menu.addSeparator();

    menu.addItem((item) =>
        item
            .setTitle('文章：旧字旧仮名へ変換')
            .setIcon('')  // モバイル版では表示される
            .onClick(() => {
                let view = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (!view) {
                    // View は null の時もある。この場合は何もしない
                } else {
                    let view_mode = view.getMode();
                    switch (view_mode) {
                        case "preview":
                            new Notice('編集モードにしてください！');
                            break;
                        case "source":
                            if ("editor" in view) {
                                let selectedText = view.editor.getSelection();
                                if (selectedText.length === 0) {
                                    new Notice('文字列が選択されていません！');
                                } else {
                                    selectedText = modernToTrad(selectedText);
                                    selectedText = newToOld(selectedText);
                                    view.editor.replaceSelection(selectedText);
                                    new Notice('旧字旧仮名へ変換しました！');
                                }
                            }
                            break;
                        default:
                            break;
                    }
                }
            })
                );

    menu.addItem((item) =>
        item
            .setTitle('文章：新字新仮名へ変換')
            .setIcon('')  // モバイル版では表示される
            .onClick(() => {
                let view = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (!view) {
                    // View は null の時もある。この場合は何もしない
                } else {
                    let view_mode = view.getMode();
                    switch (view_mode) {
                        case "preview":
                            new Notice('編集モードにしてください！');
                            break;
                        case "source":
                            if ("editor" in view) {
                                let selectedText = view.editor.getSelection();
                                if (selectedText.length === 0) {
                                    new Notice('文字列が選択されていません！');
                                } else {
                                    selectedText = oldToNew(selectedText);
                                    selectedText = tradToModern(selectedText);
                                    view.editor.replaceSelection(selectedText);
                                    new Notice('新字新仮名へ変換しました！');
                                }
                            }
                            break;
                        default:
                            break;
                    }
                }
            })
                );

    menu.addSeparator();

    menu.addItem((item) =>
        item
            .setTitle('kkh 辞書の情報')
            .setIcon('')  // モバイル版では表示される
            .onClick(() => {
                const message = "かな辞書: " + kanaArray.length + '\n' +
                                "漢字辞書: " + kanjiArray.length;
                new Notice(message);
            })
                );

    menu.showAtMouseEvent(event);
});


/////////////////////////////////////////////////////////////////////////
// ファイルメニュー(右側の・・・)からメニューを選択して操作する
/////////////////////////////////////////////////////////////////////////
// ファイルメニュー(右側の・・・)にコンテキストメニューを追加する
this.registerEvent(
    this.app.workspace.on('file-menu', (menu, file) => {
        menu.addItem((item) => {
            item
                .setTitle('かな：旧仮名遣いへ変換')
                .setIcon('')
                .onClick(async () => {
                    let view = this.app.workspace.getActiveViewOfType(MarkdownView);
                    if (!view) {
                        // View は null の時もある。この場合は何もしない
                    } else {
                        let view_mode = view.getMode();
                        switch (view_mode) {
                            case "preview":
                                new Notice('編集モードにしてください！');
                                break;
                            case "source":
                                if ("editor" in view) {
                                    let selectedText = view.editor.getSelection();
                                    if (selectedText.length === 0) {
                                        new Notice('文字列が選択されていません！');
                                    } else {
                                        selectedText = modernToTrad(selectedText);
                                        view.editor.replaceSelection(selectedText);
                                        // new Notice('旧仮名遣いへ変換しました！');
                                    }
                                }
                                break;
                            default:
                                break;
                        }
                    }
                });
        });
        menu.addItem((item) => {
            item
                .setTitle('かな：新仮名遣いへ変換')
                .setIcon('')
                .onClick(async () => {
                    let view = this.app.workspace.getActiveViewOfType(MarkdownView);
                    if (!view) {
                        // View は null の時もある。この場合は何もしない
                    } else {
                        let view_mode = view.getMode();
                        switch (view_mode) {
                            case "preview":
                                new Notice('編集モードにしてください！');
                                break;
                            case "source":
                                if ("editor" in view) {
                                    let selectedText = view.editor.getSelection();
                                    if (selectedText.length === 0) {
                                        new Notice('文字列が選択されていません！');
                                    } else {
                                        selectedText = tradToModern(selectedText);
                                        view.editor.replaceSelection(selectedText);
                                        // new Notice('新仮名遣いへ変換しました！');
                                    }
                                }
                                break;
                            default:
                                break;
                        }
                    }
                });
        });
        menu.addItem((item) => {
            item
                .setTitle('漢字：旧漢字へ変換')
                .setIcon('')
                .onClick(async () => {
                    let view = this.app.workspace.getActiveViewOfType(MarkdownView);
                    if (!view) {
                        // View は null の時もある。この場合は何もしない
                    } else {
                        let view_mode = view.getMode();
                        switch (view_mode) {
                            case "preview":
                                new Notice('編集モードにしてください！');
                                break;
                            case "source":
                                if ("editor" in view) {
                                    let selectedText = view.editor.getSelection();
                                    if (selectedText.length === 0) {
                                        new Notice('文字列が選択されていません！');
                                    } else {
                                        selectedText = newToOld(selectedText);
                                        view.editor.replaceSelection(selectedText);
                                        // new Notice('旧漢字へ変換しました！');
                                    }
                                }
                                break;
                            default:
                                break;
                        }
                    }
                });
        });
        menu.addItem((item) => {
            item
                .setTitle('漢字：新漢字へ変換')
                .setIcon('')
                .onClick(async () => {
                    let view = this.app.workspace.getActiveViewOfType(MarkdownView);
                    if (!view) {
                        // View は null の時もある。この場合は何もしない
                    } else {
                        let view_mode = view.getMode();
                        switch (view_mode) {
                            case "preview":
                                new Notice('編集モードにしてください！');
                                break;
                            case "source":
                                if ("editor" in view) {
                                    let selectedText = view.editor.getSelection();
                                    if (selectedText.length === 0) {
                                        new Notice('文字列が選択されていません！');
                                    } else {
                                        selectedText = oldToNew(selectedText);
                                        view.editor.replaceSelection(selectedText);
                                        // new Notice('新漢字へ変換しました！');
                                    }
                                }
                                break;
                            default:
                                break;
                        }
                    }
                });
        });
        menu.addItem((item) => {
            item
                .setTitle('文章：旧字旧仮名へ変換')
                .setIcon('')
                .onClick(async () => {
                    let view = this.app.workspace.getActiveViewOfType(MarkdownView);
                    if (!view) {
                        // View は null の時もある。この場合は何もしない
                    } else {
                        let view_mode = view.getMode();
                        switch (view_mode) {
                            case "preview":
                                new Notice('編集モードにしてください！');
                                break;
                            case "source":
                                if ("editor" in view) {
                                    let selectedText = view.editor.getSelection();
                                    if (selectedText.length === 0) {
                                        new Notice('文字列が選択されていません！');
                                    } else {
                                        selectedText = modernToTrad(selectedText);
                                        selectedText = newToOld(selectedText);
                                        view.editor.replaceSelection(selectedText);
                                        // new Notice('旧字旧仮名へ変換しました！');
                                    }
                                }
                                break;
                            default:
                                break;
                        }
                    }
                });
        });
        menu.addItem((item) => {
            item
                .setTitle('文章：新字新仮名へ変換')
                .setIcon('')
                .onClick(async () => {
                    let view = this.app.workspace.getActiveViewOfType(MarkdownView);
                    if (!view) {
                        // View は null の時もある。この場合は何もしない
                    } else {
                        let view_mode = view.getMode();
                        switch (view_mode) {
                            case "preview":
                                new Notice('編集モードにしてください！');
                                break;
                            case "source":
                                if ("editor" in view) {
                                    let selectedText = view.editor.getSelection();
                                    if (selectedText.length === 0) {
                                        new Notice('文字列が選択されていません！');
                                    } else {
                                        selectedText = oldToNew(selectedText);
                                        selectedText = tradToModern(selectedText);
                                        view.editor.replaceSelection(selectedText);
                                        // new Notice('新字新仮名へ変換しました！');
                                    }
                                }
                                break;
                            default:
                                break;
                        }
                    }
                });
        });
        menu.addItem((item) =>
            item
                .setTitle('kkh 辞書の情報')
                .setIcon('')  // モバイル版では表示される
                .onClick(() => {
                    const message = "かな辞書: " + kanaArray.length + '\n' +
                        "漢字辞書: " + kanjiArray.length;
                    new Notice(message);
                })
                    );
    })
);


    }  // onload() 閉じ

    onunload() {

    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS,
                                      await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}


class kkhModalInfo extends Modal {
    constructor(app: App) {
        super(app);
    }

    onOpen() {
        const {contentEl} = this;
        const message = "kkh plugin for Obsidian."
        contentEl.setText(message);
    }

    onClose() {
        const {contentEl} = this;
        contentEl.empty();
    }
}

// 新仮名遣いから旧仮名遣いへ変換
function modernToTrad(text:string): string {
    let buf:string = text;
    for (let i = 0; i < kanaArray.length; i++) {
        buf = buf.replaceAll(kanaArray[i][0], kanaArray[i][1]);
    }
    return buf;
}

// 旧仮名遣いから新仮名遣いへ変換
function tradToModern(text:string): string {
    let buf:string = text;
    for (let i = 0; i < kanaArray.length; i++) {
        buf = buf.replaceAll(kanaArray[i][1], kanaArray[i][0]);
    }
    return buf;
}

// 新漢字から旧漢字へ変換
function newToOld(text:string): string {
    let buf:string = text;
    for (let i = 0; i < kanjiArray.length; i++) {
        buf = buf.replaceAll(kanjiArray[i][0], kanjiArray[i][1]);
    }
    return buf;
}

// 旧漢字から新漢字へ変換
function oldToNew(text:string): string {
    let buf:string = text;
    for (let i = 0; i < kanjiArray.length; i++) {
        buf = buf.replaceAll(kanjiArray[i][1], kanjiArray[i][0]);
    }
    return buf;
}
