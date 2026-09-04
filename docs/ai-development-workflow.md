# M2 AI Development Workflow

このドキュメントは、M2 Shopify Themeにおけるタスク登録、作業者投入、並行開発、確認待ち、戻しレポート、PR、完了管理を統一するための運用ルールです。

リポジトリルートの `AGENTS.md` を毎回読む最小ルールとし、Notionの接続情報と状態定義は `docs/notion-task-source.md`、役割分担の詳細は `docs/main-commander-worker-flow.md` を参照します。

## Source Of Truth

- タスクの正本: Notion `M2 タスク一覧`
- コードとブランチの事実: Git / GitHub
- 実装結果と戻しレポート: GitHub Issue
- 仕様と判断: ユーザーの最新指示、対象Figma、承認済みドキュメント
- 直近の引き継ぎ: `docs/codex-handoff.md` と最新の `docs/work-log-*.md`

情報が矛盾する場合は、最新のユーザー指示と安全側のルールを優先し、勝手に情報を上書きせず差分を報告します。

## Roles

### PM / User

- タスクの優先順位と最終仕様を決める
- 停止報告、管理画面変更、外部サービス変更を承認する
- local preview / Shopify previewを目視確認する
- PR作成、merge、本番反映の各ゲートを承認する

### Main Commander

- Notion、作業ログ、Git、GitHub Issue / PRを確認して現在地を整理する
- 依存関係、WIP、競合ファイルを確認して次のタスクを選ぶ
- Notionタスクを作成・更新し、作業者向けプロンプトを作成する
- 作業者の戻しレポートと差分をレビューする
- 問題がなければユーザー確認用プレビューを提示する
- ユーザーOK後に `作業ブランチ -> develop` のPRを作成する
- merge確認後にNotionを `Done` へ更新する

### Worker Session

- 原則1タスク、1ブランチ、1worktreeで調査・実装・検証する
- 対象Notionタスク、プロジェクトルール、最新作業ログ、Git状態を開始前に確認する
- `origin/develop` 起点の作業ブランチでのみファイルを変更する
- 関連変更だけをcommitし、作業ブランチをoriginへpushする
- 必要なTheme Checkとdevelopment themeでのプレビュー確認を行う
- GitHub Issueへ固定形式の戻しレポートを記載する
- PR、merge、本番反映は行わない

同じCodexセッションが指揮官と作業者を兼ねる場合も、Notion更新、作業ブランチ、戻しレビュー、ユーザー確認、PRのゲートは省略しません。

## Worker Sessions And Subagents

- 作業者セッションは、ユーザーが別タスクとして開始したCodexセッションまたは明示的に委任された実装担当です
- サブエージェントは、1つのセッション内で独立した補助調査を行う担当です
- この2つを混同しません
- サブエージェントは、ユーザーまたは実行環境の上位指示で明示的に許可された場合だけ使います
- 並行作業では、同一ファイル、同一section、同一template、共通CSS / JS / 設定ファイルを同時に変更しません

## Standard Flow

1. ユーザーが依頼または号令を出す
2. メイン指揮官がNotion DBで既存タスク、WIP、依存関係を確認する
3. 既存タスクがなければ重複を避けて作成し、仕様不足なら `Backlog` または `Waiting PM`、投入可能なら `Ready` にする
4. メイン指揮官が対象タスクURL、Task ID、ブランチ、停止条件を含む作業者プロンプトを作成する
5. 作業者が開始チェックを行い、Notionを `In Progress` に更新する
6. 起動中の `shopify theme dev` があれば、ブランチ操作前に停止する
7. 最新 `origin/develop` から作業ブランチまたはworktreeを作成する
8. 作業ブランチ上であることを確認してから調査・実装する
9. 差分、Theme Check、必要な機能・表示確認を行う
10. 関連変更だけをcommitし、作業ブランチをoriginへpushする
11. GitHub Issueへ戻しレポートを記載し、PRは作成しない
12. メイン指揮官がIssue、差分、検証結果、停止条件をレビューする
13. ユーザー判断が必要ならNotionを `Waiting PM` にし、具体的な `Next Action` を記録する
14. 問題がなければdevelopment themeでプレビューを提示し、ユーザーへ確認を依頼する
15. ユーザーOK後にPRを作成し、Notionを `Review` に更新する
16. PR merge後にNotionを `Done` に更新する
17. 本番反映、publish、releaseは別タスク・別承認にする

## M2 Project Settings

- Project: M2 Shopify Theme
- Task DB: `docs/notion-task-source.md` に記載した `M2 タスク一覧`
- Base branch: `develop`
- PR target: `develop`
- Branch prefixes: `codex/` / `feature/` / `fix/` / `chore/`
- Store: `m2-test-zyzvnzan.myshopify.com`
- Develop連携テーマ: `187246870819`
- Live theme: `187100430627`
- Local preview: `shopify theme dev --store m2-test-zyzvnzan.myshopify.com --host 127.0.0.1 --port <port>`
- Validation: `shopify theme check`、差分確認、対象画面のPC/SP確認
- Production rule: live themeへのdev / push / edit / publishは禁止

PR前の作業確認では `--theme 187246870819` を指定しません。`develop`連携テーマへの直接push / pull / devは、ユーザーの明示承認がない限り行いません。

## Required Start Declaration

作業者は開始時に以下を短く宣言します。

- Notion Task ID / URL
- Worktree利用: Yes / No と理由
- 作業ブランチ
- 想定変更ファイル
- サブエージェント利用: Yes / No
- 競合・依存関係
- 停止条件の確認結果

## WIP Management

- `In Progress`は原則5件まで
- `Waiting PM`は原則4件まで
- `Waiting PM`が4件以上なら、新規投入より確認待ちの消化を優先する
- 同一ファイルや共通設定に触れるタスクは直列で進める
- 影響範囲が不明な場合は、先に `Investigation` タスクを作る
- 依存関係はNotionの `Dependency` と `Next Action` に記録する

## Return Report

作業者は実装・調査完了後、GitHub Issueへ以下の形式で戻しレポートを記載します。

```text
=== 戻しレポート ===
対象タスク:
- <Task ID> <Task>

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

Issueタイトルは `戻しレポート: <Task ID> <Task>` とします。Task IDは `M2-1` のようにNotionの値をそのまま使います。
チャットにはIssue URLまたは `Issue #番号 に戻しレポート記載済み` と簡潔に返します。

GitHub Issueを作成できない場合は、実施内容を失わないよう同じ形式でチャットへ報告し、Issue未作成の理由を明記します。Issueを作成したと偽ってはいけません。

## Stop Conditions

以下に該当する場合は、実装や外部変更を止めてユーザーへ報告します。

1. live theme、本番反映、`shopify theme publish` に関わる
2. `main` または `develop` で直接編集、commit、pushしようとしている
3. PR前に固定検証テーマ `187246870819` を直接同期先にしようとしている
4. `shopify theme dev` 起動中にcheckout、pull、rebase、mergeしようとしている
5. 決済、配送、税、ドメイン、請求、顧客、注文、権限、課金に関わる
6. Shopify管理画面変更が必要で事前承認がない
7. `config/settings_data.json`、`templates/*.json`、共通layout / CSS / JSを意図せず上書きする可能性がある
8. 既存Metafield / Metaobject、商品、コレクション、ページ運用を壊す可能性がある
9. Notion、作業ログ、Figma、コード、Shopifyの事実が矛盾している
10. ユーザー判断が次工程の成否に関わる
11. WIP上限を超える
12. 別ブランチや別worktreeと変更ファイルが競合する

停止時はNotionを `Blocked` または `Waiting PM` にし、`Blocked Reason` と `Next Action`を具体的に記録します。

## Commands For PM

- `次のタスクをピックアップして`
- `この内容をNotionにタスク化して`
- `作業者向けプロンプトを作って`
- `確認待ちタスクを整理して`
- `止まっているタスクを教えて`
- `Issue #番号の戻しレポートを確認して`
- `プレビューを起動して確認箇所を教えて`
- `OKなのでPRを作成して`
- `マージ済みタスクをDoneにして`

## Do Not Automate

- 本番公開、live themeへの変更、`shopify theme publish`
- `main` / `develop`への直接編集、commit、push、merge
- ユーザーOK前のPR作成
- PR merge前のNotion `Done`
- 決済、配送、税、ドメイン、請求、顧客、注文、権限、アプリ課金の変更
- 別のNotion DBへの書き込み
- Owner、Due、仕様、優先順位の推測設定
