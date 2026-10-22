# 新公式サイトの計測

2026-10-22: 専用GA4プロパティ／Webストリームはユーザー確認で未作成。接続済みは BASE 用プロパティ 544129987「わたしのつづり帖 BASE」のみ。既存リポジトリ／正本から専用測定IDは見つからず、管理画面は未ログイン。推測したIDやBASEのIDは設定しない。

`site/assets/analytics-config.js` は measurementId 空、enabled=false。確認版・localhostでは外部計測を行わない。新公式サイト専用のWebストリームを用意し、実測を確認してから有効化する。広告連携・Google Signalsは不要。GA4の拡張計測は明示的なイベントと重複しないよう、アウトバウンド自動クリックと履歴変更によるページビューを確認する。

|イベント|内容|
|---|---|
|page_view|同意後1ページにつき1回。send_page_view=falseで自動分を抑止|
|internal_navigation|destination_pathでサイト内の移動先を記録|
|app_store_click|app_name（goshuin/kusabana/sotogohan/pet/bundle）とcta_position|

全イベントにsite_area=official_appsを付与。個人の任意入力、写真、ひとこと、クエリ全文、外部リファラー全文は送らない。同意しない選択でもサイト・購入リンクは動作する。Do Not Trackを尊重し、同意設定はブラウザ内へ保存。GA4 Cookie削除は当サイトのものに限定。

LINEに設定する候補URL（LINE自体の設定変更は未実施）:

- ウェルカム: https://watatsudu.github.io/site/bundle/?utm_source=line&utm_medium=owned&utm_campaign=cpf_followup&utm_content=welcome
- リッチメニュー・セット: https://watatsudu.github.io/site/bundle/?utm_source=line&utm_medium=owned&utm_campaign=cpf_followup&utm_content=richmenu_bundle
- リッチメニュー・アプリ: https://watatsudu.github.io/site/?utm_source=line&utm_medium=owned&utm_campaign=cpf_followup&utm_content=richmenu_apps

CPFはLINE友だち追加の広告。上記は友だち追加後のLINE所有メディアからの遷移であり、通常の検索／ディスプレイ広告によるサイト直接送客には戻さない。サイトからApp Storeへのクリックと、App Store内の購入・インプレッションは別の指標。

公開前: 専用IDを設定 → サイト解析の説明を実状態に更新 → 同意前／拒否後に通信がないことをNetworkで確認 → 同意後のpage_viewと5種類のApp StoreイベントをDebugView/Realtimeで確認。承認前にmainへ反映しない。

コード単体テスト: `node tests/analytics.test.cjs`。これはGA4サーバーでの受信確認を代替しない。
