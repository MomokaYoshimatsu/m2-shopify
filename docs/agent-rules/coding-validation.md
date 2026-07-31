# Coding And Validation Rules

## Coding

- ベーステーマは Shopify公式の Rise `15.5.0`。標準機能を変更するときは、既存のLiquid構造、テーマ設定、アクセシビリティ属性を維持する。
- CSSは既存設計に合わせる。
- 既存デザインのトンマナを維持する。
- 使っていないコードを勝手に大きく削除しない。
- 既存コードを大きく削除する場合は、事前に理由を説明する。
- セクション追加時は schema も整える。
- レスポンシブ確認を前提に実装する。
- 基本は Mobile First（SPデフォルト、PCは `@media (min-width: 1024px)`、Wideは `@media (min-width: 1200px)`）。
- コンテンツ幅は原則 `max-width: 1200px` を基準にする。
- CSS Gridで可変カラムを組む場合は、必要に応じて `1fr` ではなく `minmax(0, 1fr)` を使う。
- Flex/Grid内でテキストやカードがはみ出す場合は `min-width: 0` を確認する。
- M2固有のCSS / JavaScriptを新規作成する場合は、原則 `assets/m2-*.css` / `assets/m2-*.js` とする。
- Rise標準ファイルを変更する場合は、M2固有ファイルへの分離が可能かを先に検討し、標準テーマの更新を妨げる変更範囲を最小限にする。
- Liquid出力は適切な `escape`、`image_url`、`image_tag` などのフィルターを使用し、未入力データのフォールバックを用意する。
- JavaScript変更では、テーマエディターのセクション再読み込みと複数セクション配置を考慮する。

## Design Tokens

- M2の正式なデザイントークンは未確定。
- `config/settings_data.json` の現在値はRiseの初期設定を含むため、M2の確定ブランドカラーとはみなさない。
- `files/m2_wf_*.html` 内の色・フォント・余白はワイヤーフレーム上の参考値であり、承認済みトークンとして一括展開しない。
- Figmaやユーザーの明示指定で値が確定したら、重複したハードコードを避け、テーマ設定またはM2用CSSカスタムプロパティへ集約する。
- トークンを確定・変更する場合は、名称、値、用途、PC/SP差、テーマエディターで変更可能にするかを記録する。

## Design Source Priority

実装時の参照優先度は次のとおりとする。

1. ユーザーの最新の明示指示
2. ユーザーが実装対象として指定したFigma
3. `files/m2_wf_*.html` の該当ワイヤーフレーム
4. 現在のShopifyテーマ実装

参照間に差がある場合や、ワイヤーフレームに「確定待」「近日」などの注記がある場合は、確定情報として実装せずユーザーへ確認する。

## Validation

- 変更後は `git status --short` と差分確認を行う。
- Shopifyテーマとして問題がないか確認する。
- 可能であれば `shopify theme check` を実行する。
- 表示に関わる変更では、ローカルプレビューやShopifyプレビューでPC/SPを確認する。
- PR前プレビューでは、GitHub連携済みの固定検証テーマ `187246870819` を同期先にしない。
- `shopify theme dev` 起動中はローカル変更がストア側テーマへリアルタイム同期されるため、ブランチ切り替えやpull前に必ず停止する。
- 重要な確認幅:
  - `1280px`
  - `1024px`
  - `375px`
  - `320px`
- Liquid / JSON / schema変更では、Theme Checkに加えて対象テンプレートがテーマエディターで読み込めることを確認する。
- JavaScript変更では、初期表示、操作後、戻る・進む、セクション再読み込み、エラー時の挙動を必要な範囲で確認する。
- `templates/*.json` または `config/settings_data.json` を変更した場合は、意図した設定だけが差分に含まれることを行単位で確認する。
- ドキュメントだけの変更では Theme Check の対象外であることを報告する。ローカルプレビューの実施可否は `AGENTS.md` とユーザー指示を優先する。

## Preview

- PR前のローカルプレビューは、作業者ごとのdevelopment themeを使う。
- 基本コマンドは `shopify theme dev --store m2-test-zyzvnzan.myshopify.com --host 127.0.0.1 --port <port>` とし、`--theme 187246870819` は付けない。
- PR作成前に、ユーザーが変更箇所を確認できるlocal preview URLとShopify preview URLを提示する。
- ユーザーが明示的にプレビュー不要またはPR作成優先を指示しない限り、表示変更の目視確認を省略しない。
- 固定検証テーマ `187246870819` を使うpreview、push、pullは、ユーザーの明示承認がある場合に限る。
- ポートが使用中の場合は別ポートを使う。
- ブランチ切り替え、pull、checkout、rebase、merge、別タスク作業へ移る前に、起動中の `shopify theme dev` を `Ctrl-C` で停止する。
- 目視確認依頼には、確認URL、対象ページ、変更箇所、PC/SPの確認観点、ユーザーOK後にPR作成へ進むことを含める。
