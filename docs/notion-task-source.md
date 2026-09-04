# Notion Task Source

M2 Shopify Theme のタスク一覧は、以下の Notion データベースを正本として扱います。
タスク投入、WIP確認、確認待ち確認、停止中タスク確認、PR・完了状況の確認では、作業ログや Git だけでなくこのDBも確認します。

## Database

- Database name: `M2 タスク一覧`
- Database URL: https://app.notion.com/p/9843b44a1ff7457f804b113472261610
- Database ID: `9843b44a1ff7457f804b113472261610`
- Data Source URL: `collection://43ab4097-0d32-4e5a-bd13-936ae0251d07`
- Data Source ID: `43ab4097-0d32-4e5a-bd13-936ae0251d07`

Notionへ読み書きする前に、取得結果の `<parent-data-source>` または `<data-source>` が上記Data Source URLと一致することを確認します。
同名の別データベースへ書き込んではいけません。

## Views

- Default view: `view://58188baf-652a-4868-a7c2-ab7786e0069d`
- Board by Status: `view://3ae51c8e-52dd-8180-8778-000ce7a2ba62`
- Active Tasks: `view://3ae51c8e-52dd-81ae-a040-000c030809e1`
- Waiting PM: `view://3ae51c8e-52dd-81ba-98b8-000c6f173831`
- Due Calendar: `view://3ae51c8e-52dd-8185-9f08-000c110a9772`

## Properties

- `Task`: タスク名
- `Status`: `Backlog` / `Ready` / `In Progress` / `Review` / `Waiting PM` / `Blocked` / `Done`
- `Priority`: `P0` / `P1` / `P2` / `P3`
- `Type`: `Implementation` / `Investigation` / `Review` / `Admin` / `Content` / `Design` / `Release` / `Docs`
- `Area`: 複数選択。現在の選択肢は `Figma` / `HTML` / `CSS` / `JavaScript` / `Liquid` / `Section schema` / `Shopify Admin` / `Metaobject` / `Product` / `Collection` / `Page` / `Header` / `Footer` / `QA` / `Docs` / `Notion`
- `Phase`: `0. Setup` / `1. Design Fit` / `2. Shopify Theme Foundation` / `3. Product Section` / `4. Lower Pages` / `5. QA / Release Prep`
- `Effort`: `S` / `M` / `L` / `XL`
- `Owner`: 担当者
- `Due`: 期限
- `Dependency`: 依存タスク・先行条件
- `Branch`: 作業ブランチ
- `PR URL`: PR URL
- `Preview URL`: プレビューURL
- `Source`: `User Request` / `Work Log` / `PR` / `Issue` / `Notion` / `Figma`
- `Stop Check`: 停止条件確認済みフラグ
- `Blocked Reason`: ブロック理由
- `Next Action`: 次の一手
- `Task ID`: 自動採番

プロパティや選択肢はNotion側で変更される可能性があります。作成・更新時は、必ず最新スキーマをfetchし、この文書との差分があればNotionの実スキーマを確認したうえで文書も更新します。

## Status Definition

- `Backlog`: 依頼は記録済みだが、仕様・依存関係・優先順位の整理が不足している
- `Ready`: 実装・調査プロンプトが確定し、停止条件に該当せず投入可能
- `In Progress`: 作業者が対象ブランチで調査または実装を開始済み
- `Waiting PM`: 方針、管理画面変更、プレビュー、仕様などユーザー判断待ち
- `Review`: 戻しレポート確認済み、またはPR作成後のレビュー・merge待ち
- `Blocked`: 停止条件に該当し、作業を継続できない
- `Done`: PRがmerge済み、またはコード変更を伴わない成果物が明確に完了済み

`Done`は「コードを書いた」「pushした」「PRを作った」だけでは設定しません。

## Read Rule

タスクの投入、開始、レビュー、WIP整理を行う場合は、次の順で確認します。

1. この文書でDB URLとData Source IDを確認する
2. 指定DBをNotion connectorでfetchし、Data Source IDと最新スキーマを確認する
3. Active Tasks、Waiting PM、対象タスク名またはTask IDをqueryまたはsearchする
4. 対象タスクページをfetchし、依頼内容、受け入れ条件、依存関係、Next Actionを読む
5. `AGENTS.md`、作業ログ、Git状態、GitHub Issue / PRと突き合わせる
6. Notionとリポジトリ上の事実が矛盾する場合は、作業を止めて差分をユーザーへ報告する

SQL queryがプランや権限で利用できない場合は、view query、search、fetchの順で代替します。SQLを使えないことだけを理由にNotion確認を省略しません。

## Task Creation Rule

ユーザーが「タスク化」「Notionへ追加」「タスク一覧で管理」と依頼した場合は、次の手順で登録します。

1. 同名・同目的の既存タスクを検索し、重複作成を避ける
2. 依頼内容と実装対象を整理する
3. 不明点が作業開始を妨げる場合は `Backlog` または `Waiting PM` とする
4. 実行可能なプロンプトと受け入れ条件まで確定している場合は `Ready` とする
5. `Priority`、`Type`、`Area`、`Phase`、`Effort`、`Source`、`Next Action`を分かる範囲で設定する
6. 未確定値は推測で埋めず、ページ本文と`Next Action`へ未確認事項を残す

タスク本文には最低限、以下を含めます。

```text
## 背景 / 依頼
-

## 目的
-

## 対応範囲
-

## 対象外
-

## 実装方針
-

## 受け入れ条件
-

## 検証
-

## 依存関係・停止条件
-

## 次の一手
-
```

Figma URL、関連Issue、PR、ファイル、Shopify管理画面作業がある場合は本文にも記載します。

## Write Rule

この運用ルールに基づくM2タスクの作成とライフサイクル更新は、通常のタスク管理作業として行ってよいものとします。

- 実装・調査開始時: `In Progress`へ更新し、`Branch`と`Next Action`を記録する
- ユーザー判断待ち: `Waiting PM`へ更新し、判断事項を`Next Action`へ記録する
- ブロック時: `Blocked`へ更新し、`Blocked Reason`と解除条件を記録する
- 戻しレポート確認済みまたはPR作成後: `Review`へ更新し、`PR URL`や`Preview URL`を記録する
- PR merge後: `Done`へ更新する
- 調査・Docsタスク: 成果物が確認可能な状態になった場合のみ`Done`へ更新する

次の変更はタスク管理の範囲を超えるため、別途ユーザー指示が必要です。

- DBスキーマ、プロパティ、選択肢、ビューの追加・削除・変更
- タスクページの削除・アーカイブ
- 別データベースへの移動
- OwnerやDueの推測設定
- 大量の既存タスクの一括変更

## WIP Rule

- `In Progress`の上限は原則5件
- `Waiting PM`の上限は原則4件
- `Waiting PM`が4件以上の場合、新規投入より確認待ちの消化を優先する
- 同一ファイル、同一section、同一template、共通設定を触るタスクは同時に`In Progress`へしない
- 依存関係がある場合は`Dependency`と`Next Action`へ記録する

## Fallback

Notion connectorが利用できない、認証されていない、または指定DBへ権限がない場合は、次をユーザーへ報告します。

- 参照できなかったDatabase URL
- 実行しようとした読み取りまたは更新内容
- Notion接続・共有権限の確認が必要であること
- Git、作業ログ、Issue / PRから判断できる暫定状況

Notionへ書けなかった場合、書き込み済みと報告してはいけません。
