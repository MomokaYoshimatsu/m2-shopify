# M2 Agent Rules Index

このディレクトリは、M2 Shopifyテーマ開発の詳細ルールをまとめたものです。
作業開始時はリポジトリルートの `AGENTS.md` を最初に読み、タスクに関係する詳細ルールを追加で確認します。

## Always Relevant

- `git-workflow.md`: 作業開始、ブランチ、commit、push、PR
- `shopify-safety.md`: ストア・テーマの安全管理、管理画面、禁止領域
- `coding-validation.md`: 実装方針、デザイン参照、Theme Check、プレビュー確認

## Task Dependent

- `worktree-subagents.md`: worktreeとサブエージェントの利用判断
- `theme-structure.md`: Riseベースの構成、M2用ファイル、ワイヤーフレームの扱い
- `metafields-metaobjects.md`: Metafield / Metaobjectを追加・変更するときの手順

## Related Documents

- `../../AGENTS.md`: 毎回確認するプロジェクト共通ルール
- `../../README.md`: ストア、テーマID、GitHub連携、基本セットアップ
- `../../files/`: M2のワイヤーフレーム。実装済みコードや確定仕様ではなく、デザイン検討資料として扱う
- `../ai-development-workflow.md`: Notion起点のタスク投入、WIP、戻しレポート、PR、完了管理
- `../main-commander-worker-flow.md`: Main Commander / Workerの役割、投入文、Issue戻しレポート
- `../notion-task-source.md`: M2タスクDB、Data Source ID、Status、読み書き方法
- `../codex-handoff.md`: 存在する場合に最優先で読む引き継ぎログ
- `../work-log-*.md`: 存在する場合に最新ファイルを読む作業ログ

現時点では `docs/codex-handoff.md` と `docs/work-log-*.md` は未作成です。
作業ログがない場合は、`AGENTS.md` の指示どおりGit履歴と現在の差分から状況を確認します。

## Rule Priority

ルールが矛盾する場合は、次の順で優先します。

1. 実行環境のシステム・開発者指示
2. ユーザーの明示指示
3. リポジトリルートの `AGENTS.md`
4. このディレクトリの詳細ルール

同じ優先度で矛盾する場合は、本番保護、データ保護、既存変更の保護を優先し、判断が必要ならユーザーへ確認します。

## Rule Maintenance

- ストアURL、テーマID、ブランチ運用を変更した場合は、`AGENTS.md`、`README.md`、このディレクトリの記述を同時に確認する。
- 未実装の機能、未作成のMetafield / Metaobject、未導入のアプリを「既存前提」として書かない。
- Figma、ワイヤーフレーム、管理画面の状態が食い違う場合は、勝手に一方を正として実装せず、差分を整理してユーザーへ確認する。
- 絶対禁止や毎回必要なルールは `AGENTS.md` に置き、詳細手順や長い一覧はこのディレクトリに置く。
- Notion DBのスキーマやviewが変わった場合は、実データソースをfetchしてから `docs/notion-task-source.md` を更新する。
