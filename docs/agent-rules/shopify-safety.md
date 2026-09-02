# Shopify Safety Rules

## Store

- ストアURL: `m2-test-zyzvnzan.myshopify.com`
- 検証テーマID: `187246870819`（`m2-shopify/develop` とGitHub連携済みの下書きテーマ）
- 本番テーマID: `187100430627`（ライブテーマ `Rise`）
- 本番テーマへ直接反映しない。
- `shopify theme publish` は実行禁止。

## Theme Safety

- 本番テーマは直接編集しない。
- PR前の実装確認で、GitHub連携済みの検証テーマ `187246870819` を同期先にしない。
- ローカル確認は、原則として `--theme` を指定しない `shopify theme dev` でdevelopment theme（一時開発テーマ）を使う。
- `shopify theme dev --theme 187246870819`、`shopify theme push --theme 187246870819`、`shopify theme pull --theme 187246870819` は、ユーザーの明示承認なしに実行しない。
- 検証テーマ `187246870819` は `develop` へのmergeで自動同期される前提とし、通常の開発フローで直接pushしない。
- 本番テーマ `187100430627` へのdev、push、コード編集、publishは実行しない。
- `shopify theme dev` は起動中のローカルファイル変更をストア側テーマへリアルタイム同期する。起動中にブランチ切り替え、pull、checkout、rebase、mergeをしない。
- ブランチ切り替えや別タスク作業へ移る前に、起動中の `shopify theme dev` を必ず `Ctrl-C` で停止する。
- `--allow-live` や本番テーマに関わるコマンドは、意図と対象テーマを確認してから実行する。
- Liquid / JSON template / section schema を壊さない。
- `templates/*.json` と `config/settings_data.json` はテーマエディター設定や画像設定を上書きしやすいため特に注意する。
- テーマpush時はコード専用のpush対象に限定し、テーマエディター設定を不用意に上書きしない。
- 不要なアプリ追加はしない。
- `shopify.theme.toml` の `production` 環境は本番テーマIDを参照しているため、`--environment production` を含むコマンドを通常の確認用途で使わない。
- `shopify theme pull` はローカルファイルを上書きし得る。実行前にブランチ、作業ツリー、対象テーマ、取得目的を確認し、ユーザー変更を保護する。

## Preview Themes

PR前のプレビューはdevelopment themeを使う。

基本コマンド:

```sh
shopify theme dev --store m2-test-zyzvnzan.myshopify.com --host 127.0.0.1 --port <port>
```

ルール:

- `--theme 187246870819` を付けない。
- 同時に複数のプレビューを起動する場合は別ポートを使う。
- ユーザー確認時はlocal preview URLとShopify preview URLを記載する。
- development themeを使えない、またはCLIが固定テーマIDを要求する場合は停止し、ユーザーへ報告する。
- PR前に長期間残る共有プレビューが必要な場合は、ユーザー承認を得たうえで一時的なunpublished themeを使う。GitHub連携済みの検証テーマは使わない。

## Prohibited Areas

以下は変更しない。

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
- ライブテーマへの直接push
- ユーザー承認なしのテーマエディター変更
- ユーザー承認なしの検証テーマへの直接push / pull / dev

## Admin Work

Shopify管理画面で設定が必要な場合、Codexが作業可能な範囲で対応してよい。
ただし、作業前に変更内容を説明し、ユーザーの承認を得る。

ストアの読み取り・更新はShopify GraphQL Admin APIを第一選択とし、管理画面のブラウザ操作はAPIで対応できない場合のフォールバックとする。

Codexが直接変更してよい範囲:

- 商品・コレクションのメタフィールド入力
- Metaobject の作成・編集
- Metafield / Metaobject の定義追加・編集・値更新
- ページ作成・テンプレート割り当て
- テーマエディター上の画像・コレクション選択などの表示設定
- FAQなど、ユーザーが承認したコンテンツ登録

## API First Workflow

Shopifyストアの読み取り・更新作業は、次の順番で行う。

1. 変更対象、想定影響、必要な管理画面またはAPI操作を説明し、ユーザー承認を得る。
2. Shopify公式ドキュメントとGraphQL schemaで、対象機能のAdmin API対応可否と必要scopeを確認する。
3. 読み取りqueryで対象ストア、対象ID、現在値、重複定義の有無を確認する。
4. APIで対応できる場合は、必要最小限のmutationを実行する。
5. mutationの `userErrors`、HTTP status、GraphQL errorsを確認し、再読み取りで反映結果を検証する。
6. APIで対応できない場合のみ、その根拠、ブラウザで行う操作、対象、影響、確認方法を説明し、別途ユーザー承認を得る。
7. ブラウザ操作後も、APIまたは管理画面の再読み取りで結果を検証する。

API非対応と判断できる主な条件:

- 公式ドキュメントまたはGraphQL schema上に対象のquery / mutationが存在しない。
- 対象操作が管理画面専用であることをShopifyの公式仕様で確認できた。
- アプリに必要scopeがなく、scopeの追加・アプリ再インストール等の外部変更が必要で、その変更が未承認である。
- 正しいID、入力、scope、APIバージョンで再確認しても、Shopifyが対象操作をAPI経由で許可しないことがエラーと公式仕様の両方から確認できた。

次の理由だけではAPI非対応とみなさない:

- ブラウザ操作の方が早い。
- mutationの設計やIDの取得が必要である。
- 1回の認証エラー、入力エラー、scopeエラーが発生した。
- ブラウザのログイン済みセッションが利用できる。

## Admin API Authentication

Shopifyストアの読み取り・更新が必要な場合、CodexはShopify GraphQL Admin APIで作業する。
API操作も管理画面変更と同じ扱いのため、作業前に変更内容、対象ストア、対象定義・対象データ、想定影響を説明し、ユーザー承認を得る。

Dev Dashboardアプリが自社組織内のストアを操作する場合は、client credentials grantを使う。

- 必要な環境変数は `SHOPIFY_SHOP`、`SHOPIFY_CLIENT_ID`、`SHOPIFY_CLIENT_SECRET` とする。
- client credentials grantの実行前に、アプリが対象ストアと同じShopify組織に属し、対象ストアへインストール済みであることを確認する。
- Client IDとClient Secretは認証用プロセスが環境変数から読み込み、ソースコード、Git管理下の `.env`、コマンド文字列へ直接記載しない。
- 必要時に `POST https://{shop}.myshopify.com/admin/oauth/access_token` へ `grant_type=client_credentials` を送信し、アクセストークンを取得する。
- 取得したトークンはファイルへ永続保存せず、実行プロセス内のみで保持する。
- client credentials grantのトークンは約24時間の有効期限があるため、失効時はClient ID / Secretから再取得する。
- 取得時に返されるscopeを確認し、対象操作に必要な権限だけが付与されていることを確認する。
- APIバージョンは実行時点でサポートされているstable版を明示し、未承認で `unstable` を使わない。
- GraphQL Admin API呼び出し時は `X-Shopify-Access-Token` ヘッダーを使用する。

API作業時の安全条件:

- Client Secret とアクセストークンの実値をGit管理ファイルへ保存しない。
- 認証情報は既存の安全なローカル環境変数またはシークレットマネージャーから読み込む。
- ユーザーからチャット等で提供された認証情報も、ドキュメント、コマンド文字列、標準出力、作業ログ、commit、PR本文へ転記しない。
- 認証情報をコマンド引数として直接渡さず、環境変数を読み込むローカルプロセスから利用する。
- トークンやsecretを標準出力、作業ログ、commit、PR本文へ出さない。
- 作業完了後、実行プロセス内のトークンを破棄し、一時保存が不可避だった場合は権限を制限したGit管理外ファイルを削除する。
- 実行前に読み取りクエリで対象ストアと権限を確認する。
- GraphQL mutation 実行後は `userErrors` を確認する。
- 変更後は読み取りクエリで反映結果を確認する。
- 決済、配送、税、ドメイン、請求、顧客、注文、ユーザー権限、アプリ追加、課金操作、本番テーマ publish には触れない。

## Browser Fallback

ブラウザ操作は、`API First Workflow` でAPI非対応と確認できた場合のみ行う。

- ブラウザ操作に切り替える前に、確認したAPI、必要scope、非対応と判断した根拠、ブラウザで行う手順を報告する。
- ブラウザ操作の対象ストア、テーマ、リソース、変更値を操作前に確定する。
- ユーザーがブラウザ操作を承認するまで、フォーム送信、保存、削除、公開操作を行わない。
- 操作中に本番テーマ、禁止領域、追加課金、権限変更が表示された場合は停止する。
- 操作後は管理画面の再読み取りに加え、APIで読み取り可能な値はAPIでも検証する。

Codexが直接作業できない場合、またはログイン・権限・2段階認証などで操作できない場合は以下を出力する。

- 設定場所
- 入力内容
- 注意点
- 確認方法

## Concurrent Shopify Changes

- Shopify管理画面上のテーマコード編集はGitHubの `develop` にcommitされるため、ローカル作業と同時編集しない。
- テーマエディターで設定を変更する前に、対象テーマが本番ではなく承認済みの下書きテーマであることを確認する。
- 管理画面変更後は、必要に応じてGitHub側の新しいcommitとローカル差分を確認し、意図しない設定変更が混ざっていないことを検証する。
