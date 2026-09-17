import { App, Editor, MarkdownView, Menu,
         Modal, Notice, Plugin } from 'obsidian';
import { kanaArray } from "./jisyo/kana-jisyo";
import { kanjiArray } from "./jisyo/kanji-jisyo";
import { kogakiKanaArray } from "./jisyo/kogaki-kana-jisyo";


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
        let rangeFrom = editor.getCursor("from");
        let selectedText = editor.getSelection();
        let replacedText = replaceStrings(selectedText, kanaArray, "normal");
        editor.replaceSelection(replacedText);
        let rangeTo = {line: rangeFrom.line,
            ch: rangeFrom.ch + replacedText.length};
        editor.setSelection(rangeFrom, rangeTo);
    }
});

// 新仮名遣いから旧仮名遣いへ変換(小書き用)(コマンドパレットから)
this.addCommand({
    id: 'kkh-kogaki-tradkana',
    name: '旧仮名遣いへ変換(小書き仮名)',
    editorCallback: (editor: Editor, view: MarkdownView) => {
        let rangeFrom = editor.getCursor("from");
        let selectedText = editor.getSelection();
        let replacedText = replaceStrings(selectedText, kogakiKanaArray, "normal");
        editor.replaceSelection(replacedText);
        let rangeTo = {line: rangeFrom.line,
            ch: rangeFrom.ch + replacedText.length};
        editor.setSelection(rangeFrom, rangeTo);
    }
});

// 旧仮名遣いから新仮名遣いへ変換(コマンドパレットから)
this.addCommand({
    id: 'kkh-modernkana',
    name: '新仮名遣いへ変換',
    editorCallback: (editor: Editor, view: MarkdownView) => {
        let rangeFrom = editor.getCursor("from");
        let selectedText = editor.getSelection();
        let replacedText = replaceStrings(selectedText, kanaArray, "reverse");
        editor.replaceSelection(replacedText);
        let rangeTo = {line: rangeFrom.line,
            ch: rangeFrom.ch + replacedText.length};
        editor.setSelection(rangeFrom, rangeTo);
    }
});

// 新漢字から旧漢字へ変換(コマンドパレットから)
this.addCommand({
    id: 'kkh-oldkanji',
    name: '旧漢字へ変換',
    editorCallback: (editor: Editor, view: MarkdownView) => {
        let rangeFrom = editor.getCursor("from");
        let selectedText = editor.getSelection();
        let replacedText = replaceStrings(selectedText, kanjiArray, "normal");
        editor.replaceSelection(replacedText);
        let rangeTo = {line: rangeFrom.line,
            ch: rangeFrom.ch + replacedText.length};
        editor.setSelection(rangeFrom, rangeTo);
    }
});

// 旧漢字から新漢字へ変換(コマンドパレットから)
this.addCommand({
    id: 'kkh-newkanji',
    name: '新漢字へ変換',
    editorCallback: (editor: Editor, view: MarkdownView) => {
        let rangeFrom = editor.getCursor("from");
        let selectedText = editor.getSelection();
        let replacedText = replaceStrings(selectedText, kanjiArray, "reverse");
        editor.replaceSelection(replacedText);
        let rangeTo = {line: rangeFrom.line,
            ch: rangeFrom.ch + replacedText.length};
        editor.setSelection(rangeFrom, rangeTo);
    }
});

// 新字新仮名遣いから旧字旧仮名遣いへ変換(コマンドパレットから)
this.addCommand({
    id: 'kkh-tradkana-oldkanji',
    name: '旧字旧仮名遣いへ変換',
    editorCallback: (editor: Editor, view: MarkdownView) => {
        let rangeFrom = editor.getCursor("from");
        let selectedText = editor.getSelection();
        let replaced1Text = replaceStrings(selectedText, kanaArray, "normal");
        let replaced2Text = replaceStrings(replaced1Text, kanjiArray, "normal");
        editor.replaceSelection(replaced2Text);
        let rangeTo = {line: rangeFrom.line,
            ch: rangeFrom.ch + replaced2Text.length};
        editor.setSelection(rangeFrom, rangeTo);
    }
});

// 新字新仮名遣いから旧字旧仮名遣いへ変換(小書き用)(コマンドパレットから)
this.addCommand({
    id: 'kkh-kogaki-tradkana-oldkanji',
    name: '旧字旧仮名遣いへ変換(小書き仮名)',
    editorCallback: (editor: Editor, view: MarkdownView) => {
        let rangeFrom = editor.getCursor("from");
        let selectedText = editor.getSelection();
        let replaced1Text = replaceStrings(selectedText, kogakiKanaArray, "normal");
        let replaced2Text = replaceStrings(replaced1Text, kanjiArray, "normal");
        editor.replaceSelection(replaced2Text);
        let rangeTo = {line: rangeFrom.line,
            ch: rangeFrom.ch + replaced2Text.length};
        editor.setSelection(rangeFrom, rangeTo);
    }
});

// 旧字旧仮名遣いから新字新仮名遣いへ変換(コマンドパレットから)
this.addCommand({
    id: 'kkh-modernkana-newkanji',
    name: '新字新仮名遣いへ変換',
    editorCallback: (editor: Editor, view: MarkdownView) => {
        let rangeFrom = editor.getCursor("from");
        let selectedText = editor.getSelection();
        let replaced1Text = replaceStrings(selectedText, kanjiArray, "reverse");
        let replaced2Text = replaceStrings(replaced1Text, kanaArray, "reverse");
        editor.replaceSelection(replaced2Text);
        let rangeTo = {line: rangeFrom.line,
            ch: rangeFrom.ch + replaced2Text.length};
        editor.setSelection(rangeFrom, rangeTo);
    }
});


// 辞書の大きさをポップアップメッセージに表示(コマンドパレットから)
this.addCommand({
    id: 'kkh-dictionary-info',
    name: '辞書の情報',
    callback: () => {
        const message =
            "かな辞書： " + kanaArray.length +
            "\nかな辞書(小書き)： " + kogakiKanaArray.length +
            "\n漢字辞書： " + kanjiArray.length;
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
                                    let rangeFrom = view.editor.getCursor("from");
                                    let replaced1Text = replaceStrings(selectedText, kanaArray, "normal");
                                    let replaced2Text = replaceStrings(replaced1Text, kanjiArray, "normal");
                                    view.editor.replaceSelection(replaced2Text);
                                    let rangeTo = {line: rangeFrom.line,
                                        ch: rangeFrom.ch + replaced2Text.length};
                                    view.editor.setSelection(rangeFrom, rangeTo);
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
            .setTitle('文章：旧字旧仮名へ変換(小書き仮名)')
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
                                    let rangeFrom = view.editor.getCursor("from");
                                    let replaced1Text = replaceStrings(selectedText, kogakiKanaArray, "normal");
                                    let replaced2Text = replaceStrings(replaced1Text, kanjiArray, "normal");
                                    view.editor.replaceSelection(replaced2Text);
                                    let rangeTo = {line: rangeFrom.line,
                                        ch: rangeFrom.ch + replaced2Text.length};
                                    view.editor.setSelection(rangeFrom, rangeTo);
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
                                    let rangeFrom = view.editor.getCursor("from");
                                    let replaced1Text = replaceStrings(selectedText, kanjiArray, "reverse");
                                    let replaced2Text = replaceStrings(replaced1Text, kanaArray, "reverse");
                                    view.editor.replaceSelection(replaced2Text);
                                    let rangeTo = {line: rangeFrom.line,
                                        ch: rangeFrom.ch + replaced2Text.length};
                                    view.editor.setSelection(rangeFrom, rangeTo);
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
                                    let rangeFrom = view.editor.getCursor("from");
                                    let replacedText = replaceStrings(selectedText, kanaArray, "normal");
                                    view.editor.replaceSelection(replacedText);
                                    let rangeTo = {line: rangeFrom.line,
                                        ch: rangeFrom.ch + replacedText.length};
                                    view.editor.setSelection(rangeFrom, rangeTo);
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
            .setTitle('かな：旧仮名遣いへ変換(小書き仮名)')
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
                                    let rangeFrom = view.editor.getCursor("from");
                                    let replacedText = replaceStrings(selectedText, kogakiKanaArray, "normal");
                                    view.editor.replaceSelection(replacedText);
                                    let rangeTo = {line: rangeFrom.line,
                                        ch: rangeFrom.ch + replacedText.length};
                                    view.editor.setSelection(rangeFrom, rangeTo);
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
                                    let rangeFrom = view.editor.getCursor("from");
                                    let replacedText = replaceStrings(selectedText, kanaArray, "reverse");
                                    view.editor.replaceSelection(replacedText);
                                    let rangeTo = {line: rangeFrom.line,
                                        ch: rangeFrom.ch + replacedText.length};
                                    view.editor.setSelection(rangeFrom, rangeTo);
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
                                    let rangeFrom = view.editor.getCursor("from");
                                    let replacedText = replaceStrings(selectedText, kanjiArray, "normal");
                                    view.editor.replaceSelection(replacedText);
                                    let rangeTo = {line: rangeFrom.line,
                                        ch: rangeFrom.ch + replacedText.length};
                                    view.editor.setSelection(rangeFrom, rangeTo);
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
                                    let rangeFrom = view.editor.getCursor("from");
                                    let replacedText = replaceStrings(selectedText, kanjiArray, "reverse");
                                    view.editor.replaceSelection(replacedText);
                                    let rangeTo = {line: rangeFrom.line,
                                        ch: rangeFrom.ch + replacedText.length};
                                    view.editor.setSelection(rangeFrom, rangeTo);
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
            .setTitle('kkh 辞書の情報')
            .setIcon('')  // モバイル版では表示される
            .onClick(() => {
                const message =
                      "かな辞書： " + kanaArray.length +
                      "\nかな辞書(小書き)： " + kogakiKanaArray.length +
                      "\n漢字辞書： " + kanjiArray.length;
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
                                        let rangeFrom = view.editor.getCursor("from");
                                        let replaced1Text = replaceStrings(selectedText, kanaArray, "normal");
                                        let replaced2Text = replaceStrings(replaced1Text, kanjiArray, "normal");
                                        view.editor.replaceSelection(replaced2Text);
                                        let rangeTo = {line: rangeFrom.line,
                                            ch: rangeFrom.ch + replaced2Text.length};
                                        view.editor.setSelection(rangeFrom, rangeTo);
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
                .setTitle('文章：旧字旧仮名へ変換(小書き仮名)')
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
                                        let rangeFrom = view.editor.getCursor("from");
                                        let replaced1Text = replaceStrings(selectedText, kogakiKanaArray, "normal");
                                        let replaced2Text = replaceStrings(replaced1Text, kanjiArray, "normal");
                                        view.editor.replaceSelection(replaced2Text);
                                        let rangeTo = {line: rangeFrom.line,
                                            ch: rangeFrom.ch + replaced2Text.length};
                                        view.editor.setSelection(rangeFrom, rangeTo);
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
                                        let rangeFrom = view.editor.getCursor("from");
                                        let replaced1Text = replaceStrings(selectedText, kanjiArray, "reverse");
                                        let replaced2Text = replaceStrings(replaced1Text, kanaArray, "reverse");
                                        view.editor.replaceSelection(replaced2Text);
                                        let rangeTo = {line: rangeFrom.line,
                                            ch: rangeFrom.ch + replaced2Text.length};
                                        view.editor.setSelection(rangeFrom, rangeTo);
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
                                        let rangeFrom = view.editor.getCursor("from");
                                        let replacedText = replaceStrings(selectedText, kanaArray, "normal");
                                        view.editor.replaceSelection(replacedText);
                                        let rangeTo = {line: rangeFrom.line,
                                            ch: rangeFrom.ch + replacedText.length};
                                        view.editor.setSelection(rangeFrom, rangeTo);
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
                .setTitle('かな：旧仮名遣いへ変換(小書き仮名)')
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
                                        let rangeFrom = view.editor.getCursor("from");
                                        let replacedText = replaceStrings(selectedText, kogakiKanaArray, "normal");
                                        view.editor.replaceSelection(replacedText);
                                        let rangeTo = {line: rangeFrom.line,
                                            ch: rangeFrom.ch + replacedText.length};
                                        view.editor.setSelection(rangeFrom, rangeTo);
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
                                        let rangeFrom = view.editor.getCursor("from");
                                        let replacedText = replaceStrings(selectedText, kanaArray, "reverse");
                                        view.editor.replaceSelection(replacedText);
                                        let rangeTo = {line: rangeFrom.line,
                                            ch: rangeFrom.ch + replacedText.length};
                                        view.editor.setSelection(rangeFrom, rangeTo);
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
                                        let rangeFrom = view.editor.getCursor("from");
                                        let replacedText = replaceStrings(selectedText, kanjiArray, "normal");
                                        view.editor.replaceSelection(replacedText);
                                        let rangeTo = {line: rangeFrom.line,
                                            ch: rangeFrom.ch + replacedText.length};
                                        view.editor.setSelection(rangeFrom, rangeTo);
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
                                        let rangeFrom = view.editor.getCursor("from");
                                        let replacedText = replaceStrings(selectedText, kanjiArray, "reverse");
                                        view.editor.replaceSelection(replacedText);
                                        let rangeTo = {line: rangeFrom.line,
                                            ch: rangeFrom.ch + replacedText.length};
                                        view.editor.setSelection(rangeFrom, rangeTo);
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
        menu.addItem((item) =>
            item
                .setTitle('kkh 辞書の情報')
                .setIcon('')  // モバイル版では表示される
                .onClick(() => {
                  const message =
                        "かな辞書： " + kanaArray.length +
                        "\nかな辞書(小書き)： " + kogakiKanaArray.length +
                        "\n漢字辞書： " + kanjiArray.length;
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


// class kkhModalInfo extends Modal {
//     constructor(app: App) {
//         super(app);
//     }

//     onOpen() {
//         const {contentEl} = this;
//         const message = "kkh plugin for Obsidian."
//         contentEl.setText(message);
//     }

//     onClose() {
//         const {contentEl} = this;
//         contentEl.empty();
//     }
// }

// 文字列を変換する関数
function replaceStrings(selectedText: string, jisyo: [string, string, string[]][], flag: string): string {
  let buf: string = selectedText;
  for (let i = 0; i < jisyo.length; i++) {
    if (flag === "normal") {
      buf = buf.replaceAll(jisyo[i][0], jisyo[i][1]);
    } else if (flag === "reverse") {
      buf = buf.replaceAll(jisyo[i][1], jisyo[i][0]);
    }
  }
  return buf;
}
