# Main Commander / Worker Operation Flow

このドキュメントは、M2 Shopify Themeのタスク管理、実装、レビュー、PR作成を役割ごとに分離するためのルールです。

## Purpose

- Notionタスク、実装、戻しレビュー、ユーザー確認、PRを別ゲートとして扱う
- 作業者が自己判断でPR、merge、本番反映まで進むことを防ぐ
- 複数タスクを扱う場合に、ブランチと変更ファイルの衝突を防ぐ
- Main CommanderがNotion、Issue、Git差分から次の判断を一元化する

## Role Boundaries

### PM / User

- 優先順位、仕様、承認が必要な変更を判断する
- プレビューを目視確認する
- PR作成、merge、本番反映をそれぞれ承認する

### Main Commander

- `M2 タスク一覧`、作業ログ、Git状態、Issue / PRを確認する
- タスクの重複、依存関係、WIP、競合ファイルを確認する
- 作業者へ渡す実行可能なプロンプトを作る
- 戻しレポート、branch、commit、差分、検証結果をレビューする
- ユーザー確認用のdevelopment themeプレビューを提示する
- ユーザーOK後にPRを作成する
- merge確認後にNotionを `Done` にする

### Worker Session

- 指定された1タスクの調査、実装、検証、commit、pushを行う
- 対象Notionタスクを読み、`In Progress`へ更新する
- `origin/develop`から専用branch / worktreeを作る
- 既存の未コミット変更や別タスクを混在させない
- development themeで必要な表示確認を行う
- GitHub Issueへ戻しレポートを残す
- PR、merge、本番反映、Notion `Done`への更新は行わない

単一セッション運用では、同じCodexがMain CommanderとWorkerを兼ねても構いません。ただし、各ゲートの確認内容と責任は分離します。

## Standard Flow

1. PM / Userがタスク化または実装を依頼する
2. Main CommanderがNotion DBを読み、既存タスクとWIPを確認する
3. 既存タスクがあれば更新し、なければ新規作成する
4. 仕様不足なら `Backlog` / `Waiting PM`、投入可能なら `Ready` にする
5. Main CommanderがTask ID、URL、branch、依存関係、停止条件を含むプロンプトを作る
6. Workerが開始チェックを行い、Notionを `In Progress` にする
7. Workerが専用branch / worktreeで調査・実装する
8. Workerが差分、Theme Check、PC/SP、機能状態を検証する
9. Workerが関連変更だけをcommit / pushする
10. WorkerがGitHub Issueへ戻しレポートを記載する
11. Main CommanderがIssueと実差分をレビューする
12. 不備があれば同じNotionタスクの追加対応としてWorkerへ戻す
13. ユーザー判断が必要ならNotionを `Waiting PM` にする
14. 問題がなければMain CommanderがPR前プレビューを提示する
15. PM / UserがOKしたらMain Commanderが `作業ブランチ -> develop` のPRを作成する
16. Notionを `Review` にし、PR URLを記録する
17. merge後にNotionを `Done` にする

## Parallel Work

- `In Progress`は原則5件まで
- `Waiting PM`は原則4件まで
- 同一ファイル、同一section、同一template、共通layout、共通CSS / JS、`config/settings_data.json`を触る可能性があるタスクは同時投入しない
- 競合しそうなタスクは、先行タスクのmerge後に次を `Ready` / `In Progress`へ進める
- Figma、Admin API、Metaobject、テーマコードが密接に関連する場合は、1タスクにまとめるか依存順を明記する
- 不明な依存関係は `Investigation` タスクで先に解消する

別の作業者セッションやサブエージェントを自動で作成しません。ユーザーまたは上位指示が明示した場合のみ、利用可能な機能と上限の範囲で行います。

## Main Commander Start Checklist

- `AGENTS.md`
- `docs/notion-task-source.md`
- `docs/ai-development-workflow.md`
- `docs/codex-handoff.md` と最新作業ログ
- `git status --short --branch`
- NotionのActive Tasks / Waiting PM / Blocked
- 対象タスクのTask ID、URL、Status、Dependency、Next Action
- 関連Issue / PR
- 起動中の `shopify theme dev`

## Worker Start Checklist

- 対象Notionタスクの本文とプロパティ
- プロジェクトルールとタスク依存の詳細ルール
- 最新作業ログ
- `git status --short --branch`
- `origin/develop`の最新状態
- 対象コードと既存変更
- 別branch / worktreeとの競合可能性
- Shopify停止条件
- 必要な管理画面変更と承認の有無

## Task Prompt Template

Main Commanderは、作業者向けプロンプトを次の形式で作成します。

```text
あなたはM2 Shopify Themeの作業者です。
Main Commanderからの依頼として、Notionタスク <TASK_ID> を担当してください。

タスクURL:
<TASK_URL>

タスク:
<TASK_TITLE>

Status / Priority / Phase / Effort:
<STATUS> / <PRIORITY> / <PHASE> / <EFFORT>

作業ブランチ:
<BRANCH_NAME>

依存関係:
<DEPENDENCY>

依頼内容:
<USER_REQUEST>

対応方針:
- 作業開始前にAGENTS.md、Notionタスク、最新作業ログ、git status、関連ルールを確認してください。
- 起動中のshopify theme devがあれば、ブランチ操作前に停止してください。
- origin/developを最新化し、origin/develop起点で専用branch / worktreeを作成してください。
- 作業ブランチ上であることをgit status --short --branchで確認してから編集してください。
- develop / main上で直接編集、commit、pushしないでください。
- NotionをIn Progressへ更新し、BranchとNext Actionを記録してください。
- <SPECIFIC_IMPLEMENTATION_NOTES>
- 管理画面変更は事前承認後、Shopify GraphQL Admin APIを第一選択にしてください。
- live theme、本番反映、publish、直接mergeは行わないでください。

検証:
- git diff
- git status --short
- shopify theme check
- <TASK_SPECIFIC_VALIDATION>
- 1280px / 1024px / 375px / 320pxを必要な範囲で確認してください。
- 横スクロール、console error、表示崩れを確認してください。

完了時:
- 関連変更だけをcommitし、作業branchをoriginへpushしてください。
- PRは作成しないでください。
- GitHub Issueに固定形式の戻しレポートを記載してください。
- development themeを使い、固定検証テーマ187246870819を直接同期先にしないでください。
- 戻しレポートにTask ID / URL、branch、base commit、commit、push、変更ファイル、検証結果、Preview URL、未確認事項、次の一手を書いてください。
- ユーザー判断待ちはNotionをWaiting PM、ブロックはBlockedへ更新してください。
- チャットにはIssue URLまたは「Issue #番号 に戻しレポート記載済み」と簡潔に返してください。
```

## GitHub Issue Return Report

Issueタイトル:

```text
戻しレポート: <Task ID> <Task>
```

Issue本文:

```text
=== 戻しレポート ===
対象タスク:
-

NotionタスクURL:
-

Branch:
-

Base branch / base commit:
-

Commit / Push:
-

Preview URL:
-

結果区分:
- 実装完了 / 調査完了 / ブロック / PR未作成

実施内容:
-

変更ファイル:
-

確認結果:
-

触っていない範囲:
-

未確認・ブロック:
-

懸念点:
-

次の一手:
-
```

## Main Commander Review Checklist

- Issueが対象Notionタスクに紐づいている
- branch、base commit、commit、push状態が明記されている
- 変更ファイルがタスク範囲内である
- 不要差分、認証情報、テーマ設定の意図しない変更がない
- 必要なTheme Checkと機能・表示確認が実行されている
- Preview URLが対象branchのdevelopment themeである
- 未確認事項が次工程を妨げない
- Shopify禁止領域と停止条件に該当しない
- NotionのStatus、Branch、Preview URL、Next Actionが実態と一致している

レビューOKだけでPRを作成せず、ユーザーがプレビューを確認してOKを出すまで待ちます。

## Status Update Rules

- タスク作成、仕様整理済み: `Ready`
- Worker開始: `In Progress`
- 仕様・承認・プレビュー判断待ち: `Waiting PM`
- 継続不能: `Blocked`
- ユーザーOK後、PR作成またはPRレビュー中: `Review`
- PR merge済み: `Done`

Statusを更新するときは、必ず `Next Action`も現在の状態に合わせます。

## Non-Negotiable Rules

- WorkerはPRを作成しない
- WorkerはNotionを `Done` にしない
- Main CommanderはユーザーOK前にPRを作成しない
- PR作成とmerge、本番反映は別の承認ゲートにする
- `develop` / `main`へ直接編集、commit、push、mergeしない
- live themeへdev / push / edit / publishしない
- 高リスクなShopify設定を自己判断で変更しない
- Notion、Git、Issueの状態を実態と異なる内容に更新しない
