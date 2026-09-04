# Worktree And Sub-Agent Rules

## Basic Policy

- 通常は、最新 `origin/develop` から作成した1つの作業ブランチで1タスクを完結させる。
- worktreeは、同時並行タスクの分離、長時間作業の隔離、既存作業ツリーを保持する必要がある場合に使う。
- 変更ファイル数だけを理由にworktreeやサブエージェントを必須にしない。競合可能性、独立性、確認コストで判断する。
- サブエージェントは、ユーザーまたは有効な上位指示が明示的に依頼・許可した場合だけ使う。
- worktreeやサブエージェントを使う場合は、目的、担当範囲、ブランチ、重複編集を避ける方法を作業開始時に説明する。

## Worker Session And Sub-Agent

- Worker Sessionは、Notionの1タスクを担当する別Codexセッションまたは明示的に委任された実装担当を指す。
- Sub-Agentは、1つのセッション内で独立した補助調査を行う担当を指す。
- Worker Sessionの役割と戻し方は `docs/main-commander-worker-flow.md` に従う。
- Worker Session数とSub-Agent数を混同しない。
- 別セッションやSub-Agentを自動で作成せず、ユーザーまたは実行環境の上位指示が明示した場合だけ利用する。
- 複数Workerを使う場合は、Notionの `Dependency`、`Branch`、`Status`、`Next Action`を更新し、同一ファイルを同時編集させない。

## Worktree Recommended

以下の場合はworktreeを検討する。

- 別タスクの未コミット変更が現在の作業ツリーにある
- 複数タスクを同時に進める必要がある
- 長時間の新機能開発や大規模リファクタリング
- Shopifyテーマ構造に広く影響する変更
- Figmaの複数画面を独立して実装する
- 実験的な調査と本実装を分離したい
- ブランチ切り替えが頻繁に発生する見込みがある

## Worktree Optional

以下の場合は、現在の作業ツリーで専用ブランチを作ればよい。

- 文言修正
- 軽微なCSS修正
- 画像差し替え
- コメント修正
- ドキュメント整備
- 影響範囲が限定され、並行作業がない変更
- 明確な修正指示があり、影響範囲が限定的な軽微作業

## Sub-Agent Policy

- ユーザーが明示的にサブエージェント利用を依頼していない場合は、Codex本体で対応する。
- 明示的な依頼がある場合も、互いに独立した具体的なサブタスクへ限定する。
- 同じファイルを複数エージェントへ同時に編集させない。
- ストア操作、管理画面変更、commit、push、PR作成の責任主体を曖昧にしない。
- 最終担当は各成果物の差分と検証結果を確認し、未確認事項を統合してユーザーへ報告する。
- 本番保護、管理画面の事前承認、ブランチ規則は、サブエージェント利用時も緩和されない。

## Worktree Workflow

1. `AGENTS.md` 確認
2. `docs/notion-task-source.md` と対象Notionタスク確認
3. `docs/codex-handoff.md` と最新作業ログ確認
4. Git状態確認
5. 起動中の `shopify theme dev` があれば停止
6. `origin/develop` を最新化
7. Notionを `In Progress` に更新し、branchとNext Actionを記録
8. `git worktree add <path> -b <作業ブランチ> origin/develop`
9. worktree内で変更・検証
10. 関連変更だけをcommitしてpush
11. 元の作業ツリーから差分、commit、push状態を確認
12. WorkerはGitHub Issueへ戻しレポートを記載
13. Main Commanderが戻しレポートと差分をレビュー
14. 必要なローカルプレビューを起動
15. ユーザー確認
16. ユーザーOK後にMain Commanderが `作業ブランチ -> develop` のPRを作成
17. PR merge後にNotionを `Done` に更新

## Cleanup

- PR作成やmergeだけを理由に、worktreeを自動削除しない。未コミット変更と必要なログがないことを確認する。
- 削除する場合は対象パスとブランチを明示し、広いパスや未解決の変数を削除対象にしない。
- worktree削除後もブランチ削除は別操作として扱い、ユーザー指示または運用ルールに従う。
