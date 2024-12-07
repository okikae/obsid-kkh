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
    id: 'kkh-tradkana-command',
    name: '旧仮名遣いへ変換',
    editorCallback: (editor: Editor, view: MarkdownView) => {
        let selectedText = editor.getSelection();
        selectedText = modernToTrad(selectedText);
        editor.replaceSelection(selectedText);
    }
});

// 旧仮名遣いから新仮名遣いへ変換(コマンドパレットから)
this.addCommand({
    id: 'kkh-modernkana-command',
    name: '新仮名遣いへ変換',
    editorCallback: (editor: Editor, view: MarkdownView) => {
        let selectedText = editor.getSelection();
        selectedText = tradToModern(selectedText);
        editor.replaceSelection(selectedText);
    }
});

// 新漢字から旧漢字へ変換(コマンドパレットから)
this.addCommand({
    id: 'kkh-oldkanji-command',
    name: '旧漢字へ変換',
    editorCallback: (editor: Editor, view: MarkdownView) => {
        let selectedText = editor.getSelection();
        selectedText = newToOld(selectedText);
        editor.replaceSelection(selectedText);
    }
});

// 旧漢字から新漢字へ変換(コマンドパレットから)
this.addCommand({
    id: 'kkh-newkanji-command',
    name: '新漢字へ変換',
    editorCallback: (editor: Editor, view: MarkdownView) => {
        let selectedText = editor.getSelection();
        selectedText = oldToNew(selectedText);
        editor.replaceSelection(selectedText);
    }
});

// 新字新仮名遣いから旧字旧仮名遣いへ変換(コマンドパレットから)
this.addCommand({
    id: 'kkh-tradkana-oldkanji-command',
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
    id: 'kkh-modernkana-newkanji-command',
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
    name: 'kkh 辞書の情報',
    callback: () => {
        const message = "かな辞書:" + kanaArray.length + '  ' +
                        "漢字辞書:" + kanjiArray.length;
        new Notice(message);
    }
});

// kkh についてモーダルウィンドウに表示(コマンドパレットから)
this.addCommand({
    id: 'kkh-about-modal',
    name: 'kkh について(モーダル)',
    callback: () => {
        new kkhModalInfo(this.app).open();
    }
});

// 辞書の大きさをポップアップメッセージに表示(リボンアイコンから)
// this.addRibbonIcon('info', 'kkh 辞書の情報', () => {
//   const message = "かな辞書:" + kanaArray.length + '  ' +
//                   "漢字辞書:" + kanjiArray.length;
//   new Notice(message);
// });


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

// エディタメニュー(モバイル版のみ)コンテキストメニューを追加する
// エディタメニューはコマンドパレットから
// "Show context menu under cursor" を選択すると表示される
// this.registerEvent(
//     this.app.workspace.on('editor-menu', (menu, editor, view) => {
//         menu.addItem((item) => {
//             item
//                 .setTitle('kkh 👈')
//                 .setIcon('')
//                 .onClick(async () => {
//                     new Notice(view.file.path);
//                 });
//         });
//     })
// );
// 左側のリボンにアイコンを作成する
// const ribbonIconEl =
//     this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
//      // ユーザがアイコンをクリックした時に呼ばれる
//      new Notice('This is a notice!');
//     });

// // Perform additional things with the ribbon
// ribbonIconEl.addClass('my-plugin-ribbon-class');

// This adds a status bar item to the bottom of the app.
// モバイルアプリでは動作しない
// const statusBarItemEl = this.addStatusBarItem();
// statusBarItemEl.setText('Status Bar Text');

// This adds an editor command that can perform some operation
// on the current editor instance
// this.addCommand({
//  id: 'sample-editor-command',
//  name: 'Sample editor command',
//  editorCallback: (editor: Editor, view: MarkdownView) => {
//      console.log(editor.getSelection());
//      editor.replaceSelection('Sample Editor Command');
//  }
// });

// This adds a complex command that can check whether the current
// state of the app allows execution of the command
// this.addCommand({
//  id: 'open-sample-modal-complex',
//  name: 'Open sample modal (complex)',
//  checkCallback: (checking: boolean) => {
//      // Conditions to check
//      const markdownView =
//             this.app.workspace.getActiveViewOfType(MarkdownView);
//      if (markdownView) {
//          // If checking is true, we're simply "checking"
//             // if the command can be run.
//          // If checking is false, then we want to actually perform
//             // the operation.
//          if (!checking) {
//              new SampleModal(this.app).open();
//          }
//          // This command will only show up in Command Palette
//             // when the check function returns true
//          return true;
//      }
//  }
// });

// This adds a settings tab so the user can configure various
// aspects of the plugin
// this.addSettingTab(new SampleSettingTab(this.app, this));

// If the plugin hooks up any global DOM events (on parts of
// the app that doesn't belong to this plugin)
// Using this function will automatically remove the event listener
// when this plugin is disabled.
// this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
//  console.log('click', evt);
// });

// When registering intervals, this function will automatically clear
// the interval when the plugin is disabled.
// this.registerInterval(window.setInterval(() =>
//     console.log('setInterval'), 5 * 60 * 1000));


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


class SampleSettingTab extends PluginSettingTab {
    plugin: kkhPlugin;

    constructor(app: App, plugin: kkhPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const {containerEl} = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName('設定項目その1')
            .setDesc('設定すべきもはある？')
            .addText(text => text
            .setPlaceholder('ないんだな')
            .setValue(this.plugin.settings.mySetting)
            .onChange(async (value) => {
                this.plugin.settings.mySetting = value;
                await this.plugin.saveSettings();
            }));
        new Setting(containerEl)
            .setName('設定項目その2')
            .setDesc('設定すべきもはない？')
            .addText(text => text
            .setPlaceholder('だからないの')
            .setValue(this.plugin.settings.mySetting)
            .onChange(async (value) => {
                this.plugin.settings.mySetting = value;
                await this.plugin.saveSettings();
            }));
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

// replaceAll が実装されるまでの一時的な関数
// function gsub(str:string, key:string, val:string): string {
//     return str.split(key).join(val);
// }

// 参考にしたソース
// [https://forum.obsidian.md/t/get-current-text-selection/23436/3] より
// let view = this.app.workspace.getActiveViewOfType(MarkdownView);
// if (!view) {
//     // View は null の時もある。この場合は何もしない
// } else {
//     let view_mode = view.getMode(); // "preview" か "source"
//     switch (view_mode) {
//         case "preview":
//             // preview モードでは何もしない
//             break;
//         case "source":
//             if ("editor" in view) {
//                 let selection = view.editor.getSelection();
//                 // ここで好きなようにする
//             }
//             break;
//         default:
//             break;
//     }
// }
