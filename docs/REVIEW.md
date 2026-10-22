# わたしのつづり帖｜制作完成案 2026-10-22

制作ブランチ: site-renewal-cpf-20261021。mainへ未反映／本番未公開。

10/21の初稿を基に、トップ、4アプリ紹介、Bundle、ブランドの考え方を改修。正式素材、原典の4色、Noto Serif JP（ローカル配信）、スマホで常時使えるナビゲーションを実装。仮のUI画像は撤去。

## 保全

- about/、既存 goshuin/・kusabana/・sotogohan/・pet/、robots.txt、既存sitemap.xml、Google所有権確認ファイルは変更なし。
- 本番旧トップ全文を support/index.html に保全。App StoreのPrivacy Policy URLがルートなので、旧プライバシー本文は新トップ内にも全文保全。/#privacy-heading から展開可能。
- BASE、アプリ内BASE帰着先、ASC、LINE、広告設定は変更なし。

## 販売情報

2026-10-22 日本App Storeで4単品各400円、Bundle ID6821220289の4アプリ収録と700円表示を確認。実購入は行っていない。ユーザーのApple ID別購入可否・コンプリート価格は実機表示を優先。

## 確認方法

静的サイト。リポジトリルートをHTTPサーバーで配信する。ビルドや有料サービスは不要。ルート相対URLを使うためfile://直開きは対象外。確認例: `python -m http.server 8765 --bind 127.0.0.1`。

制作確認では noindex,follow を維持。SEO title/description/canonical/OGP/構造化データは実装。既存sitemapは承認前に変更せず、新ページの検索登録は公開時にまとめて行う。

## 検証

- 7ページ×375/390/430/768/1280 CSS px、計35表示で横はみ出し・画像欠落なし。ブラウザ内同一オリジンiframeで幅を実測。iPhone実機Safariでの確認は未実施。
- 内部リンク・アンカー・画像・見出し・保全チェック、計測コード単体テスト合格。
- 画像はWebP・遅延読み込み・width/height指定。画像ファイル計約1.2MB、フォント約258KB。実回線でのCore Web Vitalsは公開後の検証対象。ローカルの読み込み時間を本番速度と混同しない。
- GA4は専用設定未作成のため無効。イベント処理・同意管理は実装、GA4受信の実測は未完了。

詳細は ASSETS.md、ANALYTICS.md を参照。

## 公開前に残る作業

1. 完成案をユーザーが確認し、修正を終える。
2. 専用GA4 Webストリームの作成・測定ID確認・同意後の実測検証。
3. iPhone Safari実機で文字拡大・タップ・App Store起動を確認。
4. 本番公開の明示承認。
5. 承認された公開作業時にnoindexをindexへ、新ページをsitemapへ追加。旧URL・Google確認ファイルを保全したままmainへ反映。
6. 公開URLの画像・OGP・全購入リンク・実回線性能・GA4を再確認してから、別途承認されたLINE切替／CPFへ進む。
