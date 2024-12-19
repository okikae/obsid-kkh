import { addIcon, App, Editor, MarkdownView, Menu, Modal, Notice,
         Plugin, PluginSettingTab, Setting } from 'obsidian';
import { toTradKanaArray } from "./totradkanajisyo";
import { toModernKanaArray } from "./tomodernkanajisyo";
import { toOldKanjiArray } from "./tooldkanjijisyo";
import { toNewKanjiArray } from "./tonewkanjijisyo";
import { odoriEnhanceArray } from "./odorienhancejisyo";
import { gairaiEnhanceArray } from "./gairaienhancejisyo";
import { gouryakuEnhanceArray } from "./gouryakuenhancejisyo";
import { yeEnhanceArray } from "./yeenhancejisyo";


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
        selectedText = replaceStrings(selectedText, toTradKanaArray, "normal");
        editor.replaceSelection(selectedText);
    }
});

// 旧仮名遣いから新仮名遣いへ変換(コマンドパレットから)
this.addCommand({
    id: 'kkh-modernkana',
    name: '新仮名遣いへ変換',
    editorCallback: (editor: Editor, view: MarkdownView) => {
        let selectedText = editor.getSelection();
        selectedText = replaceStrings(selectedText, toModernKanaArray, "normal");
        editor.replaceSelection(selectedText);
    }
});

// 新漢字から旧漢字へ変換(コマンドパレットから)
this.addCommand({
    id: 'kkh-oldkanji',
    name: '旧漢字へ変換',
    editorCallback: (editor: Editor, view: MarkdownView) => {
        let selectedText = editor.getSelection();
        selectedText = replaceStrings(selectedText, toOldKanjiArray, "normal");
        editor.replaceSelection(selectedText);
    }
});

// 旧漢字から新漢字へ変換(コマンドパレットから)
this.addCommand({
    id: 'kkh-newkanji',
    name: '新漢字へ変換',
    editorCallback: (editor: Editor, view: MarkdownView) => {
        let selectedText = editor.getSelection();
        selectedText = replaceStrings(selectedText, toNewKanjiArray, "normal");
        editor.replaceSelection(selectedText);
    }
});

// 新字新仮名遣いから旧字旧仮名遣いへ変換(コマンドパレットから)
this.addCommand({
    id: 'kkh-tradkana-oldkanji',
    name: '旧字旧仮名遣いへ変換',
    editorCallback: (editor: Editor, view: MarkdownView) => {
        let selectedText = editor.getSelection();
        selectedText = replaceStrings(selectedText, toTradKanaArray, "normal");
        selectedText = replaceStrings(selectedText, toOldKanjiArray, "normal");
        editor.replaceSelection(selectedText);
    }
});

// 旧字旧仮名遣いから新字新仮名遣いへ変換(コマンドパレットから)
this.addCommand({
    id: 'kkh-modernkana-newkanji',
    name: '新字新仮名遣いへ変換',
    editorCallback: (editor: Editor, view: MarkdownView) => {
        let selectedText = editor.getSelection();
        selectedText = replaceStrings(selectedText, toNewKanjiArray, "normal");
        selectedText = replaceStrings(selectedText, toModernKanaArray, "normal");
        editor.replaceSelection(selectedText);
    }
});

// 旧仮名の踊り字が使われた文を現代表記へ変換(コマンドパレットから)
this.addCommand({
    id: 'kkh-odori-to-new',
    name: '踊り字：旧仮名の踊り字が使われた文を現代表記へ変換',
    editorCallback: (editor: Editor, view: MarkdownView) => {
        let selectedText = editor.getSelection();
        selectedText = replaceStrings(selectedText, odoriEnhanceArray, "reverse");
        editor.replaceSelection(selectedText);
    }
});

// 現代表記を旧仮名の踊り字を使う文へ変換(コマンドパレットから)
this.addCommand({
    id: 'kkh-odori-to-old',
    name: '踊り字：現代表記を旧仮名の踊り字を使う文へ変換',
    editorCallback: (editor: Editor, view: MarkdownView) => {
        let selectedText = editor.getSelection();
        selectedText = replaceStrings(selectedText, odoriEnhanceArray, "normal");
        editor.replaceSelection(selectedText);
    }
});

// 昔風のカタカナを今風に変換(コマンドパレットから)
this.addCommand({
    id: 'kkh-gairai-to-new',
    name: '外来語：昔風のカタカナを今風に変換',
    editorCallback: (editor: Editor, view: MarkdownView) => {
        let selectedText = editor.getSelection();
        selectedText = replaceStrings(selectedText, gairaiEnhanceArray, "reverse");
        editor.replaceSelection(selectedText);
    }
});

// カタカナ表記を昔風に変換(コマンドパレットから)
this.addCommand({
    id: 'kkh-gairai-to-old',
    name: '外来語：カタカナ表記を昔風に変換',
    editorCallback: (editor: Editor, view: MarkdownView) => {
        let selectedText = editor.getSelection();
        selectedText = replaceStrings(selectedText, gairaiEnhanceArray, "normal");
        editor.replaceSelection(selectedText);
    }
});

// 合略仮名が使われた文を現代表記へ変換(コマンドパレットから)
this.addCommand({
    id: 'kkh-gouryaku-to-new',
    name: '合略仮名：合略仮名が使われた文を現代表記へ変換',
    editorCallback: (editor: Editor, view: MarkdownView) => {
        let selectedText = editor.getSelection();
        selectedText = replaceStrings(selectedText, gouryakuEnhanceArray, "reverse");
        editor.replaceSelection(selectedText);
    }
});

// 現代表記を合略仮名を使う文へ変換(コマンドパレットから)
this.addCommand({
    id: 'kkh-gairai-to-old',
    name: '合略仮名：現代表記を合略仮名を使う文へ変換',
    editorCallback: (editor: Editor, view: MarkdownView) => {
        let selectedText = editor.getSelection();
        selectedText = replaceStrings(selectedText, gouryakuEnhanceArray, "normal");
        editor.replaceSelection(selectedText);
    }
});

// ヤ行エが使われた文を現代表記へ変換(コマンドパレットから)
this.addCommand({
    id: 'kkh-ye-to-new',
    name: 'ヤ行エ：ヤ行エが使われた文を現代表記へ変換',
    editorCallback: (editor: Editor, view: MarkdownView) => {
        let selectedText = editor.getSelection();
        selectedText = replaceStrings(selectedText, yeEnhanceArray, "reverse");
        editor.replaceSelection(selectedText);
    }
});

// 現代表記をヤ行エを使う文へ変換(コマンドパレットから)
this.addCommand({
    id: 'kkh-ye-to-old',
    name: 'ヤ行エ：現代表記をヤ行エを使う文へ変換',
    editorCallback: (editor: Editor, view: MarkdownView) => {
        let selectedText = editor.getSelection();
        selectedText = replaceStrings(selectedText, yeEnhanceArray, "normal");
        editor.replaceSelection(selectedText);
    }
});

// 辞書の大きさをポップアップメッセージに表示(コマンドパレットから)
this.addCommand({
    id: 'kkh-dictionary-info',
    name: '辞書の情報',
    callback: () => {
        const message =
            "かな辞書(旧→新)： " + toModernKanaArray.length +
            "\nかな辞書(新→旧)： " + toTradKanaArray.length +
            "\n漢字辞書(旧→新)： " + toNewKanjiArray.length +
            "\n漢字辞書(新→旧)： " + toOldKanjiArray.length +
            "\n拡張辞書(踊り字)： " + odoriEnhanceArray.length +
            "\n拡張辞書(外来語)： " + gairaiEnhanceArray.length +
            "\n拡張辞書(合略仮名)： " + gouryakuEnhanceArray.length +
            "\n拡張辞書(ヤ行エ)： " + yeEnhanceArray.length;
        new Notice(message);
    }
});

/////////////////////////////////////////////////////////////////////////
// リボンからメニューを選択して操作する
/////////////////////////////////////////////////////////////////////////
this.addRibbonIcon('paw-print', 'kkh メニュー', (event) => {
    const menu = new Menu();

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
                                    selectedText = replaceStrings(selectedText, toTradKanaArray, "normal");
                                    selectedText = replaceStrings(selectedText, toOldKanjiArray, "normal");
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
                                    selectedText = replaceStrings(selectedText, toNewKanjiArray, "normal");
                                    selectedText = replaceStrings(selectedText, toModernKanaArray, "normal");
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
                                    selectedText = replaceStrings(selectedText, toTradKanaArray, "normal");
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
                                    selectedText = replaceStrings(selectedText, toModernKanaArray, "normal");
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
                                    selectedText = replaceStrings(selectedText, toOldKanjiArray, "normal");
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
                                    selectedText = replaceStrings(selectedText, toNewKanjiArray, "normal");
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
            .setTitle('踊り字：旧仮名の踊り字が使われた文を現代表記へ変換')
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
                                    selectedText = replaceStrings(selectedText, odoriEnhanceArray, "reverse");
                                    view.editor.replaceSelection(selectedText);
                                    new Notice('踊り字を現代表記へ変換しました！');
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
            .setTitle('踊り字：現代表記を旧仮名の踊り字を使う文へ変換')
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
                                    selectedText = replaceStrings(selectedText, odoriEnhanceArray, "normal");
                                    view.editor.replaceSelection(selectedText);
                                    new Notice('旧仮名の踊り字を使う文へ変換しました！');
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
            .setTitle('外来語：昔風のカタカナを今風に変換')
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
                                    selectedText = replaceStrings(selectedText, gairaiEnhanceArray, "reverse");
                                    view.editor.replaceSelection(selectedText);
                                    new Notice('昔風のカタカナを今風に変換しました！');
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
            .setTitle('外来語：カタカナ表記を昔風に変換')
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
                                    selectedText = replaceStrings(selectedText, gairaiEnhanceArray, "normal");
                                    view.editor.replaceSelection(selectedText);
                                    new Notice('カタカナ表記を昔風に変換しました！');
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
            .setTitle('合略仮名：合略仮名が使われた文を現代表記へ変換')
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
                                    selectedText = replaceStrings(selectedText, gouryakuEnhanceArray, "reverse");
                                    view.editor.replaceSelection(selectedText);
                                    new Notice('合略仮名が使われた文を現代表記へ変換しました！');
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
            .setTitle('合略仮名：現代表記を合略仮名を使う文へ変換')
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
                                    selectedText = replaceStrings(selectedText, gouryakuEnhanceArray, "normal");
                                    view.editor.replaceSelection(selectedText);
                                    new Notice('現代表記を合略仮名を使う文へ変換しました！');
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
            .setTitle('ヤ行エ：ヤ行エが使われた文を現代表記へ変換')
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
                                    selectedText = replaceStrings(selectedText, yeEnhanceArray, "reverse");
                                    view.editor.replaceSelection(selectedText);
                                    new Notice('ヤ行エが使われた文を現代表記へ変換しました！');
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
            .setTitle('ヤ行エ：現代表記をヤ行エを使う文へ変換')
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
                                    selectedText = replaceStrings(selectedText, yeEnhanceArray, "normal");
                                    view.editor.replaceSelection(selectedText);
                                    new Notice('現代表記をヤ行エを使う文へ変換しました！');
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
                const message =
                      "かな辞書(旧→新)： " + toModernKanaArray.length +
                      "\nかな辞書(新→旧)： " + toTradKanaArray.length +
                      "\n漢字辞書(旧→新)： " + toNewKanjiArray.length +
                      "\n漢字辞書(新→旧)： " + toOldKanjiArray.length +
                      "\n拡張辞書(踊り字)： " + odoriEnhanceArray.length +
                      "\n拡張辞書(外来語)： " + gairaiEnhanceArray.length +
                      "\n拡張辞書(合略仮名)： " + gouryakuEnhanceArray.length +
                      "\n拡張辞書(ヤ行エ)： " + yeEnhanceArray.length;
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
                                        selectedText = replaceStrings(selectedText, toTradKanaArray, "normal");
                                        selectedText = replaceStrings(selectedText, toOldKanjiArray, "normal");
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
                                        selectedText = replaceStrings(selectedText, toNewKanjiArray, "normal");
                                        selectedText = replaceStrings(selectedText, toModernKanaArray, "normal");
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
                                        selectedText = replaceStrings(selectedText, toTradKanaArray, "normal");
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
                                        selectedText = replaceStrings(selectedText, toModernKanaArray, "normal");
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
                                        selectedText = replaceStrings(selectedText, toOldKanjiArray, "normal");
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
                                        selectedText = replaceStrings(selectedText, toNewKanjiArray, "normal");
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
                .setTitle('踊り字：旧仮名の踊り字が使われた文を現代表記へ変換')
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
                                        selectedText = replaceStrings(selectedText, odoriEnhanceArray, "reverse");
                                        view.editor.replaceSelection(selectedText);
                                        // new Notice('旧仮名の踊り字が使われた文を現代表記へ変換しました！');
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
                .setTitle('踊り字：現代表記を旧仮名の踊り字を使う文へ変換')
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
                                        selectedText = replaceStrings(selectedText, odoriEnhanceArray, "normal");
                                        view.editor.replaceSelection(selectedText);
                                        // new Notice('現代表記を旧仮名の踊り字を使う文へ変換しました！');
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
                .setTitle('外来語：昔風のカタカナを今風に変換')
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
                                        selectedText = replaceStrings(selectedText, gairaiEnhanceArray, "reverse");
                                        view.editor.replaceSelection(selectedText);
                                        // new Notice('昔風のカタカナを今風に変換しました！');
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
                .setTitle('外来語：カタカナ表記を昔風に変換')
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
                                        selectedText = replaceStrings(selectedText, gairaiEnhanceArray, "normal");
                                        view.editor.replaceSelection(selectedText);
                                        // new Notice('カタカナ表記を昔風に変換しました！');
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
                .setTitle('合略仮名：合略仮名が使われた文を現代表記へ変換')
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
                                        selectedText = replaceStrings(selectedText, gouryakuEnhanceArray, "reverse");
                                        view.editor.replaceSelection(selectedText);
                                        // new Notice('合略仮名が使われた文を現代表記へ変換しました！');
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
                .setTitle('合略仮名：現代表記を合略仮名を使う文へ変換')
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
                                        selectedText = replaceStrings(selectedText, gouryakuEnhanceArray, "normal");
                                        view.editor.replaceSelection(selectedText);
                                        // new Notice('現代表記を合略仮名を使う文へ変換しました！');
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
                .setTitle('ヤ行エ：ヤ行エが使われた文を現代表記へ変換')
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
                                        selectedText = replaceStrings(selectedText, yeEnhanceArray, "reverse");
                                        view.editor.replaceSelection(selectedText);
                                        // new Notice('ヤ行エが使われた文を現代表記へ変換しました！');
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
                .setTitle('ヤ行エ：現代表記をヤ行エを使う文へ変換')
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
                                        selectedText = replaceStrings(selectedText, yeEnhanceArray, "normal");
                                        view.editor.replaceSelection(selectedText);
                                        // new Notice('現代表記をヤ行エを使う文へ変換しました！');
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
                  const message =
                        "かな辞書(旧→新)： " + toModernKanaArray.length +
                        "\nかな辞書(新→旧)： " + toTradKanaArray.length +
                        "\n漢字辞書(旧→新)： " + toNewKanjiArray.length +
                        "\n漢字辞書(新→旧)： " + toOldKanjiArray.length +
                        "\n拡張辞書(踊り字)： " + odoriEnhanceArray.length +
                        "\n拡張辞書(外来語)： " + gairaiEnhanceArray.length +
                        "\n拡張辞書(合略仮名)： " + gouryakuEnhanceArray.length +
                        "\n拡張辞書(ヤ行エ)： " + yeEnhanceArray.length;
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

// 文字列を変換する関数
function replaceStrings(selectedText: string, jisyo: [string, string, string[]][], flag: string): string {
  let buf: string = selectedText;
  for (let i = 0; i < jisyo.length; i++) {
    if (flag === "normal") {
      buf = buf.replaceAll(jisyo[i][0], jisyo[i][1]);
    } else if (flag === "reverse") {
      buf = buf.replaceAll(jisyo[i][1], jisyo[i][0]);
    } else {
    }
  }
  return buf;
}
