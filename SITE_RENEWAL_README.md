# わたしのつづり帖｜新公式サイト（公開前）

制作ブランチ site-renewal-cpf-20261021 の完成案です。本番公開・main反映は未実施。

新サイトは /site/ 配下、既存rootはmainとバイト完全一致で維持します。サポートとアプリのプライバシーは既存rootへ誘導します。

- [画面一覧・比較・コピー出典・URL検証の監査報告](docs/audit/REPORT.md)
- [保存用レビューHTML](docs/audit/review.html)
- [素材出典](docs/ASSETS.md)
- [GA4とLINE URL候補](docs/ANALYTICS.md)

検証：node tools/verify-site.cjs と node tests/analytics.test.cjs。ルートをHTTP配信して /site/ を開きます。ブラウザ35表示の実測結果は docs/audit/responsive-final.json。noindexとGA4無効を維持。

公開前残作業：専用GA4受信実測、Safari実機、今回案のレビュー、本番公開の明示承認。
