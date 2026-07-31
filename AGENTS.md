# M2 Shopify Theme Agent Rules

## Project
- このリポジトリは新規Shopifyストア「M2」のテーマ改修用です。
- 技術スタックは Shopify Theme（Liquid / CSS / JavaScript）です。
- 既存デザイン、Figma、これまでの作業ログ、Shopify管理画面での運用を前提に作業します。
- 本番テーマやストア設定に影響する作業は慎重に扱います。

## Start Of Day Rule
- 1日の作業を始める時は、最初に必ず `AGENTS.md` と作業ログを読む。
- 作業ログは `docs/codex-handoff.md` があれば最優先で読み、あわせて `docs/work-log-*.md` の最新ファイルも確認する。
- 作業ログを読んだうえで、直近の変更内容、未完了タスク、注意点を把握してから作業に入る。
- 作業ログが存在しない場合は、その旨をユーザーに伝え、Git履歴や差分から状況を確認する。

## Store
- ストアURL: `m2-test-zyzvnzan.myshopify.com`
- 検証テーマとして使われてきたテーマID: `187246870819`（m2-shopify/develop）
- 本番テーマへ直接反映しないでください。
- `shopify theme publish` は実行禁止です。

## Branch Rule
- `main` では直接作業しない。
- 作業前に必ず現在のブランチと作業状態を確認する。
- 作業前に必ず `develop` へ移動し、`origin/develop` の最新状態を取得する。
- `develop` から新しい作業ブランチを作成する。
- ブランチ名は `codex/<作業内容>`、`feature/<作業内容>`、`fix/<作業内容>`、`chore/<作業内容>` の形式にする。
- 作業中は作業ブランチ上でこまめにコミットし、作業ブランチを `origin` へ push しておく。
- PRは1タスク1PRとし、タスクが完了してユーザーがOKを出したときだけ作成する。
- PRは必ず `作業ブランチ -> develop` の向きで作成する。
- `main` へ直接 push、直接 merge しない。

## Git Workflow
- 作業中はこまめにコミットしてブランチにpushしておく。
- コミットは1つの作業タスク内で何回してもよい。
- Codexは関連する変更だけをステージし、日本語で変更内容を要約したコミットメッセージで自動的にコミットする。
- コミット後は作業ブランチを `origin` へ push する。
- 1つの作業タスクが完了したら、必ず以下を実行すること。
  1. `git status --short` で変更ファイルを確認する
  2. 必要に応じてテストまたはビルド確認を行う
  3. 変更内容を要約する
  4. 未コミットの関連変更があればコミットしてpushする
  5. `shopify theme dev` でローカルプレビューを起動する
  6. ユーザーに目視確認を依頼する
  7. ユーザーがOKを出したらPRを作成する
- ユーザーから明示的に「コミットしないで」と指示された場合のみ、コミットしない。
- コミットメッセージとPRタイトルは、日本語で変更内容を要約したタイトルにする。
- PRタイトルは短く具体的にし、例として「管理画面作業ルールを追加」「商品ページの表示崩れを修正」のように書く。
- PRはタスク完了時のみ作成する。作業途中のコミットやpushではPRを作成しない。
- PRは原則として通常PR（Draftではない状態）で作成する。
- ユーザーから明示的に「ドラフトで作成して」と指示された場合のみDraft PRとして作成する。
- ローカルプレビューは `shopify theme dev --store m2-test-zyzvnzan.myshopify.com` を基本にする。
- ポートが使用中の場合は別ポートを使う。
- PR本文には以下を含める。
  - 変更内容
  - 変更したファイル
  - 確認したこと
  - Shopify管理画面で追加対応が必要なこと
  - 懸念点

## Shopify Rule
- 本番テーマは直接編集しない。
- 変更後は可能な限り `shopify theme check` を実行する。
- Liquid / JSON template / section schema を壊さない。
- `templates/*.json` と `config/settings_data.json` は、テーマエディター設定や画像設定を上書きしやすいため特に注意する。
- テーマpush時は、コード専用のpush対象に限定し、テーマエディター設定を不用意に上書きしない。
- 不要なアプリ追加はしない。
- 決済、配送、税、ドメイン、請求、顧客、注文、ユーザー権限まわりは変更しない。
- `--allow-live` や本番テーマに関わるコマンドは、意図と対象テーマを確認してから実行する。

## Admin Rule
Shopify管理画面で設定が必要な場合、Codexが作業可能な範囲で対応してよい。
ただし、作業前に変更内容を説明し、ユーザーの承認を得ること。

Codexが直接変更してよい範囲:
- 商品・コレクションのメタフィールド入力
- Metaobject の作成・編集
- ページ作成・テンプレート割り当て
- テーマエディター上の画像・コレクション選択などの表示設定
- FAQ / Shop Entry などのコンテンツ登録

Codexが変更してはいけない範囲:
- 決済
- 配送
- 税
- ドメイン
- 請求
- 顧客
- 注文
- ユーザー権限
- アプリ追加・課金操作
- 本番テーマ publish

Codexが直接作業できない場合、またはログイン・権限・2段階認証などで操作できない場合は、以下を出力する。
- 設定場所
- 入力内容
- 注意点
- 確認方法

## Coding Rule
- CSSは既存設計に合わせる。
- 既存デザインのトンマナを維持する。
- 使っていないコードを勝手に大きく削除しない。
- 既存コードを大きく削除する場合は、事前に理由を説明する。
- セクション追加時は schema も整える。
- レスポンシブ確認を前提に実装する。
- 基本は Mobile First（SPデフォルト、PCは `@media (min-width: 1024px)`、Wideは `@media (min-width: 1200px)`）。
- `mii-product.css` は例外的に PCファースト（SPを `@media (max-width: 1023px)` で上書き）として扱う。
- コンテンツ幅は原則 `max-width: 1200px` を基準にする。
- CSS Gridで可変カラムを組む場合は、必要に応じて `1fr` ではなく `minmax(0, 1fr)` を使う。
- Flex/Grid内でテキストやカードがはみ出す場合は `min-width: 0` を確認する。

## Design Tokens
- 未定

## Theme Structure Notes
- このCodex側リポジトリでは Shopifyテーマファイルがリポジトリルート直下にあります。
- 主なディレクトリ:
  - `layout/`
  - `sections/`
  - `snippets/`
  - `templates/`
  - `assets/`
  - `config/`
  - `locales/`
- 過去資料では `shopify-theme/` 配下の構成が記載されている場合があります。現在のリポジトリ構成を優先してください。
- Shopifyに反映するCSS/JSは `assets/m2-*.css` または `assets/m2-*.js` を基本にする。

## Validation
- 変更後は `git status --short` と差分確認を行う。
- Shopifyテーマとして問題がないか確認する。
- 可能であれば `shopify theme check` を実行する。
- 表示に関わる変更では、ローカルプレビューやShopifyプレビューでPC/SPを確認する。
- 重要な確認幅:
  - 1280px
  - 1024px
  - 375px
  - 320px

## Prohibited Actions
- `main` への直接作業、直接commit、直接push。
- `main` への直接merge。
- 本番テーマへの直接反映。
- `shopify theme publish`。
- 決済、配送、税、ドメイン、請求、顧客、注文、ユーザー権限まわりの変更。
- 不要なアプリ追加や課金操作。
- ユーザー承認なしのShopify管理画面変更。
- テーマエディター設定や画像設定を意図せず上書きするpush。
