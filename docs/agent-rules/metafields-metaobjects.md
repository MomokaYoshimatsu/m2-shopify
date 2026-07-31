# Metafields And Metaobjects Rules

M2固有のMetafield / Metaobjectは、現時点のリポジトリでは実装を確認できていません。
別プロジェクトの定義を流用せず、M2の要件とShopify管理画面の現状を確認してから設計・追加します。

## Current Verified References

テーマコード内で現在確認できる参照は次のとおりです。

- 商品レビュー表示: `product.metafields.reviews.rating`、`product.metafields.reviews.rating_count`
- 商品ディスクロージャー: `product.metafields.shopify.disclosure`

これらはRise標準テーマ側の参照です。アプリやShopify標準機能との連携を確認せず、namespace、key、型を変更しません。

## Before Adding Definitions

Metafield / Metaobjectの新設前に、次を確認します。

1. 対象ストアが `m2-test-zyzvnzan.myshopify.com` であること
2. Shopify管理画面に同名・同用途の定義がないこと
3. 対象リソースが商品、バリエーション、コレクション、Shop、ページのどれか
4. 単一値かリストか、必須か任意か、並び順が意味を持つか
5. 参照先Metaobjectのtype、各fieldのkeyと型
6. Liquid側の未入力時表示と、既存商品への影響
7. 誰が管理画面で値を更新するか、運用上必要な説明
8. 既存データの移行や一括入力が必要か

設計内容は、実装前にnamespace / key / 型 / 用途 / 参照先 / フォールバックを一覧化し、ユーザー承認を得ます。

## Naming And Liquid Rules

- namespaceは原則 `custom` を候補とするが、既存定義や外部連携がある場合はその設計を優先する。
- keyは英小文字とunderscoreで用途が分かる名前にし、他プロジェクト固有のkeyをコピーしない。
- Metaobject typeとfield keyも同じ基準で命名する。
- `.value` が必要な型、list型、reference型を区別し、Shopifyが返すdropを確認して実装する。
- list型はLiquidでループし、単一参照と取り違えない。
- Metaobjectの全件取得に依存せず、可能な限り対象リソースのMetafield参照から取得する。
- `shop`、`product`、`collection`、`section` などのグローバル名をループ変数に使わない。
- 値が未入力、参照先が削除済み、画像が未設定の場合でもレイアウトとschemaを壊さない。
- リッチテキスト、URL、画像、数値など、型に合うLiquidフィルターと出力方法を使う。

## Admin And API Policy

- 管理画面またはAdmin APIで定義・値を変更する前に、変更内容、対象、影響を説明し、ユーザー承認を得る。
- Admin APIを使う場合も `shopify-safety.md` の管理画面変更と同じ承認条件を適用する。
- Client Secret、アクセストークン、Shopifyセッション情報をGit管理ファイル、作業ログ、commit、チャット出力へ保存しない。
- 認証情報は既存の安全なローカル環境変数またはGit管理外ファイルを使い、値をコマンド出力へ表示しない。
- mutation前に読み取りで対象ストア、定義、対象データを確認する。
- mutation後は `userErrors` を確認し、再度読み取って反映を検証する。
- 定義削除、型変更、listとsingleの変更は既存データを失う可能性があるため、ユーザーの個別承認なしに実行しない。

## Validation And Documentation

- Theme Checkを実行する。
- 値あり、値なし、参照切れ、listが0件・1件・複数件の状態を必要な範囲で確認する。
- 商品やバリエーションに紐づく場合は、複数商品・複数バリエーションで誤参照がないことを確認する。
- 新しい定義を導入したら、このファイルにnamespace / key / 型 / 用途 / Metaobject field構成 / 運用上の注意を追記する。
- 管理画面で追加作業が残る場合は、設定場所、入力内容、注意点、確認方法をユーザーへ渡す。
