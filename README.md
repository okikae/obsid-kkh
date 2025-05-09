# kkh plugin for Obsidian

旧字旧仮名と新字新仮名とを相互に変換するツール [kkh](https://github.com/okikae/kkh) を Obsidian に移植したプラグインです。

## 機能

エディタ上で選択された文字列に対して任意の変換を行います。変換の種類は下記の通りです。

- 文章：旧字旧仮名へ変換
- 文章：新字新仮名へ変換
- かな：旧仮名遣いへ変換
- かな：新仮名遣いへ変換
- 漢字：旧漢字へ変換
- 漢字：新漢字へ変換
- 踊り字：旧仮名の踊り字が使われた文を現代表記へ変換
- 踊り字：現代表記を旧仮名の踊り字を使う文へ変換
- 外来語：昔風のカタカナを今風に変換
- 外来語：カタカナ表記を昔風に変換
- 合略仮名：合略仮名が使われた文を現代表記へ変換
- 合略仮名：現代表記を合略仮名を使う文へ変換
- ヤ行エ：ヤ行エが使われた文を現代表記へ変換
- ヤ行エ：現代表記をヤ行エを使う文へ変換

## 使い方

Obsidian はマルチプラットフォーム・マルチデバイスで利用することができますが、デバイスの種類によって操作方法が若干異なります。

このため、ここでは各デバイスに分けて説明します。なお、動作確認は macOS, iPadOS, iOS でしていますが、Linux, Windows, Android 等も同様な操作になると思います。

### macOS (Linux, Windows)

変換方法は 3 つあります。変換対象の文字列を選択してから

1. 左側のリボンに足跡アイコンがありますので、そこから望む変換を選択します。

2. 左側のリボンからコマンドパレットを呼び出し、"kkh" と入力するとコマンド候補が絞られますので、そこから望む変換を選択します。

3. 右上にあるテキストメニュー(…)から望む変換を選択します。

デスクトップ版では 1. の方法が使いやすいと思います。

### iPadOS (Android)

変換方法は 4 つあります。変換対象の文字列を選択してから

1. 左側のリボンに足跡アイコンがありますので、そこから望む変換を選択します。

2. 左側のリボンからコマンドパレットを呼び出し、"kkh" と入力するとコマンド候補が絞られますので、そこから望む変換を選択します。

3. 右上にあるテキストメニュー(…)から望む変換を選択します。

4. 下側に表示されるツールバーから望む変換を選択します。ただしこれは、ツールバーの設定で kkh の機能を追加した場合です。ツールバーがごちゃごちゃしてしまうので推奨はできません。

タブレット版では 3. の方法が使いやすいと思います。

### iOS (Android)

変換方法は 3 つあります。変換対象の文字列を選択してから

1. 下側のハンバーガーメニュー(≡)から kkh メニューを選択し、そこから望む変換を選択します。キーボードを隠さないとハンバーガーメニューが見えないのでひと手間かかります。

2. 下側のハンバーガーメニュー(≡)からコマンドパレットを呼び出し、"kkh" と入力するとコマンド候補が絞られますので、そこから望む変換を選択します。これもひと手間かかります。

3. 右上にあるテキストメニュー(…)から望む変換を選択します。メニューの下部にあるため、スワイプする手間がかかります。

スマートフォン版では 3. の方法が若干使いやすいと思います。しかし、画面が小さく、また画面の切替はストレスに感じるので、スマートフォンでの利用は推奨はできません。

## インストール方法

### 公式サイトのコミュニティープラグインから

「Preferences...」->「Community Plugins」で Browse ボタンを押すとプラグイン一覧が表示されるので、"kkh" を検索します。結果で表示されるタイルメニューをクリックして Install ボタンを押します。

## その他

内包している辞書データは、[kkh](https://github.com/okikae/kkh) による活動の成果を利用しています。辞書が「キモ」なのです。
