# M2 Shopify Theme Agent Rules

## Project
- このリポジトリは新規Shopifyストア「M2」のテーマ改修用です。
- 技術スタックは Shopify Theme（Liquid / CSS / JavaScript）です。
- 既存デザイン、Figma、これまでの作業ログ、Shopify管理画面での運用を前提に作業します。
- 本番テーマやストア設定に影響する作業は慎重に扱います。

## Rule Documents
- `AGENTS.md` は毎回読む最小ルールです。
- 詳細ルールの索引は `docs/agent-rules/README.md` を参照します。
- AI開発の全体フローは `docs/ai-development-workflow.md` に従います。
- Main Commander / Workerの役割分担は `docs/main-commander-worker-flow.md` に従います。
- NotionタスクDBの接続先、スキーマ、Status定義、読み書きルールは `docs/notion-task-source.md` に従います。
- ルールが矛盾する場合は、実行環境の上位指示、ユーザーの最新指示、このファイル、詳細ルールの順で優先し、同順位では本番・データ・既存変更の保護を優先します。

## Start Of Day Rule
- 1日の作業を始める時は、最初に必ず `AGENTS.md` と作業ログを読む。
- 作業ログは `docs/codex-handoff.md` があれば最優先で読み、あわせて `docs/work-log-*.md` の最新ファイルも確認する。
- タスク投入、実装開始、WIP確認、確認待ち確認、戻しレビューでは `docs/notion-task-source.md` を読み、Notionの `M2 タスク一覧` と対象タスクを確認する。
- 対象タスクがある場合は、Task ID、タスクURL、Status、Dependency、Next Actionを確認する。
- 作業ログを読んだうえで、直近の変更内容、未完了タスク、注意点を把握してから作業に入る。
- 作業ログが存在しない場合は、その旨をユーザーに伝え、Git履歴や差分から状況を確認する。
- Notion、作業ログ、Git、Issue / PR、Figma、Shopifyの事実が矛盾する場合は、実装を開始せず差分をユーザーへ報告する。

## Notion Task Rule
- タスクの正本はNotionの `M2 タスク一覧` とする。
- Database URL: `https://app.notion.com/p/9843b44a1ff7457f804b113472261610`
- Data Source URL: `collection://43ab4097-0d32-4e5a-bd13-936ae0251d07`
- ユーザーが「タスク化」「Notionへ追加」「タスク一覧で管理」と依頼した場合は、既存タスクを検索して重複を避けたうえで作成・更新してよい。
- 実装開始時は `In Progress`、ユーザー判断待ちは `Waiting PM`、ブロックは `Blocked`、PR作成後は `Review`、PR merge後は `Done` を基本とする。
- Status更新時は `Branch`、`PR URL`、`Preview URL`、`Blocked Reason`、`Next Action`も実態に合わせて更新する。
- `Done` はPR merge済み、またはコード変更を伴わない成果物が明確に完了した場合だけ設定する。
- DBスキーマ、プロパティ、ビュー、既存タスクの一括変更、削除・アーカイブは、ユーザーの個別指示なしに行わない。
- Notionへ接続できない場合は、接続できなかったDB、実行予定だった操作、暫定判断を報告し、書き込み済みと扱わない。

## Main Commander / Worker Rule
- Main CommanderはNotion、作業ログ、Git、GitHub Issue / PRを確認し、タスク選定、投入文、戻しレビュー、ユーザー確認、PR作成、Done更新を担当する。
- Workerは原則1タスク、1branch、1worktreeで調査、実装、検証、commit、pushを担当する。
- WorkerはPR、merge、本番反映を行わず、完了時にGitHub Issueへ戻しレポートを記載する。
- Main Commanderは戻しレポートと実差分をレビューし、ユーザーへdevelopment themeのプレビューを提示する。ユーザーOK後にだけPRを作成する。
- 単一セッションが両役割を兼ねる場合も、Notion更新、作業branch、戻しレビュー、ユーザー確認、PRのゲートを省略しない。
- 別の作業者セッションやサブエージェントは、ユーザーまたは実行環境の上位指示が明示した場合だけ利用する。
- `In Progress`は原則5件、`Waiting PM`は原則4件までとし、確認待ちが上限に達したら新規投入より確認消化を優先する。

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
- Worker運用では、commit / push後にGitHub Issueへ `戻しレポート: <Task ID> <タスク名>` の形式で戻しレポートを記載し、PRを作成せずMain Commanderへ返す。Task IDは `M2-1` のようにNotionの自動採番値をそのまま使う。
- 戻しレポートにはNotionタスクURL、branch、base commit、commit、push状態、変更ファイル、検証結果、Preview URL、未確認事項、次の一手を含める。
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

Shopifyストアの読み取り・更新作業は、原則としてShopify GraphQL Admin APIを第一選択とする。

- ブラウザで管理画面を操作する前に、Admin APIで対応可能かを公式ドキュメント、GraphQL schema、読み取りqueryで確認する。
- APIで対応可能な作業は、ブラウザ操作に切り替えない。
- APIで対応できないことが確認できた場合のみ、理由、ブラウザで行う操作、対象、影響を説明し、ユーザー承認後にブラウザ操作を行う。
- 実装が難しい、手作業の方が早い、1回のAPIエラーが出た、という理由だけでブラウザ操作へ切り替えない。
- API操作前に読み取りqueryで対象ストア、対象ID、現在値、権限scopeを確認し、mutation後は `userErrors` と再読み取りで結果を検証する。
- APIで行った変更も管理画面変更と同様に扱い、事前承認、本番保護、禁止領域のルールを維持する。

Admin APIの認証情報は次のルールで扱う。

- Client IDとClient Secretは、Git管理外の安全な環境変数またはシークレットマネージャーから読み込む。
- 認証情報の実値をリポジトリ内ファイル、コマンド文字列、標準出力、作業ログ、commit、PR本文、チャット出力へ含めない。
- Dev DashboardアプリのClient ID / Secretを使う場合は、必要時にclient credentials grantでアクセストークンを取得する。トークンはファイルへ永続保存せず、有効期限切れの場合は再取得する。
- APIリクエストではアクセストークンを `X-Shopify-Access-Token` ヘッダーで送信し、ヘッダーやレスポンスの認証情報を出力しない。
- 認証失敗時は認証情報を出力せず、HTTP status、Shopifyのサニタイズ済みエラー、必要scopeだけを報告する。

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
- ユーザー指示なしのNotion DBスキーマ、プロパティ、ビュー、既存タスクの一括変更、削除・アーカイブ。
- PR merge前にNotionタスクを `Done` にすること。
