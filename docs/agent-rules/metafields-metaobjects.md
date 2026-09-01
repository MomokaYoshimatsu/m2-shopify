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

## M2 Product Page Content Contract

ステータス: テーマ実装・検証ストアへのコンテンツ登録・対象商品へのテンプレート割り当てまで完了。

2026-09-01 Admin API反映状況:

- 対象ストア: `m2-test-zyzvnzan.myshopify.com`
- `m2_product_page` と子Metaobject定義5種を作成し、Storefront accessを `PUBLIC_READ` に設定済み。
- 商品Metafield定義 `custom.product_page_content` を作成し、参照先を `m2_product_page` に固定済み。
- Figma記載テキストを子エントリー19件と対象商品用ルートエントリーへ登録済み。
- Figma指定画像8点をShopify Filesへアップロードし、各子Metaobjectへ設定済み。
- 対象商品に `custom.product_page_content` を紐付け、商品テンプレート `product.m2` を割り当て済み。
- 追加商品用の最小ルートエントリーを作成して商品へ紐付け、対象商品の `related_products` に設定済み。追加商品の商品ページテンプレートは標準のまま。

商品側Metafield:

| namespace / key | 型 | 値 | 用途 | Liquid | 未入力時 |
|---|---|---|---|---|---|
| `custom.product_page_content` | `metaobject_reference` | 単一・任意 | 商品とルートMetaobjectを紐付ける | `product.metafields.custom.product_page_content.value` | M2固有コンテンツを非表示。Rise標準の商品メインと購入フォームは表示 |

### `m2_product_page`（M2 商品ページ）

| field key | データ型 | 値 | 必須 | 用途 / Liquid | 未入力時 |
|---|---|---|---|---|---|
| `name` | `single_line_text_field` | 単一 | 必須 | 管理画面のエントリー表示名（画面には出力しない） | 定義上必須 |
| `badge` | `single_line_text_field` | 単一 | 任意 | 商品メインのラベル / `page_content.badge.value` | 非表示 |
| `card_badge` | `multi_line_text_field` | 単一 | 任意 | 関連商品カードの円形訴求 / `related_page_content.card_badge.value` | 非表示 |
| `card_description` | `multi_line_text_field` | 単一 | 任意 | 関連商品カードの説明文 / `related_page_content.card_description.value` | 商品説明を短縮表示。商品説明も空なら非表示 |
| `package_summary` | `single_line_text_field` | 単一 | 任意 | 内容数などの補足 / `page_content.package_summary.value` | 非表示 |
| `purchase_notes` | `list.single_line_text_field` | リスト | 任意 | 購入欄下の補足 / `page_content.purchase_notes.value` | リスト非表示 |
| `overview_eyebrow` | `single_line_text_field` | 単一 | 任意 | 商品紹介の英字見出し | 見出し行を非表示 |
| `overview_heading` | `single_line_text_field` | 単一 | 任意 | 商品紹介の和文見出し | 見出し行を非表示 |
| `overview_badge` | `single_line_text_field` | 単一 | 任意 | 商品紹介の強調ラベル | 非表示 |
| `overview_lead` | `single_line_text_field` | 単一 | 任意 | 商品紹介のリード見出し | 非表示 |
| `tags` | `list.single_line_text_field` | リスト | 任意 | タイプ・フレーバー等のタグ | リスト非表示 |
| `overview_body` | `rich_text_field` | 単一 | 任意 | 商品紹介本文 / `page_content.overview_body | metafield_tag` | 非表示 |
| `recommended_heading` | `single_line_text_field` | 単一 | 任意 | おすすめ対象の見出し | 見出しのみ非表示 |
| `recommended_items` | `list.single_line_text_field` | リスト | 任意 | おすすめ対象 | ボックス非表示 |
| `features_eyebrow` | `single_line_text_field` | 単一 | 任意 | 特徴セクション英字見出し | 見出し行を非表示 |
| `features_heading` | `single_line_text_field` | 単一 | 任意 | 特徴セクション和文見出し | 見出し行を非表示 |
| `features` | `list.metaobject_reference` → `m2_product_feature` | リスト | 任意 | 成分・特徴カード / `page_content.features.value` | 特徴セクション非表示 |
| `support_eyebrow` | `single_line_text_field` | 単一 | 任意 | 補足訴求の英字見出し | 見出し行を非表示 |
| `support_heading` | `single_line_text_field` | 単一 | 任意 | 補足訴求の和文見出し | 見出し行を非表示 |
| `support_items` | `list.metaobject_reference` → `m2_product_support_item` | リスト | 任意 | WHY THIS FORMULAカード / `page_content.support_items.value` | 補足訴求を非表示 |
| `free_formula_eyebrow` | `single_line_text_field` | 単一 | 任意 | フリー処方英字見出し | 見出し行を非表示 |
| `free_formula_heading` | `multi_line_text_field` | 単一 | 任意 | フリー処方和文見出し | 見出し行を非表示 |
| `free_formula_items` | `list.single_line_text_field` | リスト | 任意 | フリー処方項目 | セクション非表示 |
| `how_to_eyebrow` | `single_line_text_field` | 単一 | 任意 | 使用方法英字見出し | 見出し行を非表示 |
| `how_to_heading` | `single_line_text_field` | 単一 | 任意 | 使用方法和文見出し | 見出し行を非表示 |
| `how_to_items` | `list.metaobject_reference` → `m2_product_how_to` | リスト | 任意 | 使用シーン / `page_content.how_to_items.value` | セクション非表示 |
| `specs_eyebrow` | `single_line_text_field` | 単一 | 任意 | 仕様英字見出し | 見出し行を非表示 |
| `specs_heading` | `single_line_text_field` | 単一 | 任意 | 仕様和文見出し | 見出し行を非表示 |
| `specs` | `list.metaobject_reference` → `m2_product_spec` | リスト | 任意 | 仕様表 / `page_content.specs.value` | 仕様表を非表示 |
| `notice_heading` | `single_line_text_field` | 単一 | 任意 | 注意事項見出し | 見出しのみ非表示 |
| `notice_body` | `rich_text_field` | 単一 | 任意 | 注意事項本文 | 注意事項を非表示 |
| `faq_eyebrow` | `single_line_text_field` | 単一 | 任意 | FAQ英字見出し | 見出し行を非表示 |
| `faq_heading` | `single_line_text_field` | 単一 | 任意 | FAQ和文見出し | 見出し行を非表示 |
| `faqs` | `list.metaobject_reference` → `m2_product_faq` | リスト | 任意 | FAQ / `page_content.faqs.value` | FAQセクション非表示 |
| `related_eyebrow` | `single_line_text_field` | 単一 | 任意 | 関連商品英字見出し | 見出し行を非表示 |
| `related_heading` | `single_line_text_field` | 単一 | 任意 | 関連商品和文見出し | 見出し行を非表示 |
| `related_products` | `list.product_reference` | リスト | 任意 | 関連商品 / `page_content.related_products.value` | 関連商品セクション非表示 |

### 子Metaobject

| type / 表示名 | field key | データ型 | 値 | 必須 | 用途 / 未入力時 |
|---|---|---|---|---|---|
| `m2_product_feature` / 商品特徴 | `number` | `single_line_text_field` | 単一 | 任意 | 連番。未入力なら非表示 |
|  | `heading` | `single_line_text_field` | 単一 | 任意 | 特徴見出し。未入力なら見出し非表示 |
|  | `body` | `rich_text_field` | 単一 | 任意 | 本文。未入力なら本文非表示 |
|  | `image` | `file_reference`（画像） | 単一 | 任意 | 訴求画像。未入力なら画像枠非表示 |
|  | `image_alt` | `single_line_text_field` | 単一 | 任意 | 代替テキスト。未入力なら画像ファイルのaltを使用 |
| `m2_product_support_item` / 商品補足訴求 | `number` | `single_line_text_field` | 単一 | 任意 | 連番。未入力なら非表示 |
|  | `heading` | `single_line_text_field` | 単一 | 任意 | カード見出し。未入力なら非表示 |
|  | `image` | `file_reference`（画像） | 単一 | 任意 | カード画像。未入力なら画像枠非表示 |
|  | `image_alt` | `single_line_text_field` | 単一 | 任意 | 代替テキスト。未入力なら画像ファイルのaltを使用 |
|  | `lead` | `single_line_text_field` | 単一 | 任意 | 本文前の強調文。未入力なら非表示 |
|  | `body` | `rich_text_field` | 単一 | 任意 | 本文。未入力なら非表示 |
| `m2_product_how_to` / 使用方法 | `name` | `single_line_text_field` | 単一 | 必須 | 管理画面のエントリー表示名（画面には出力しない） |
|  | `image` | `file_reference`（画像） | 単一 | 任意 | 使用シーン画像。未入力なら画像枠非表示 |
|  | `image_alt` | `single_line_text_field` | 単一 | 任意 | 代替テキスト。未入力なら画像ファイルのaltを使用 |
|  | `body` | `rich_text_field` | 単一 | 任意 | 説明。未入力なら本文非表示 |
| `m2_product_spec` / 商品仕様 | `label` | `single_line_text_field` | 単一 | 必須 | 仕様項目名。label/valueのどちらかが空なら行を非表示 |
|  | `value` | `rich_text_field` | 単一 | 必須 | 仕様値。label/valueのどちらかが空なら行を非表示 |
|  | `emphasis` | `boolean` | 単一 | 任意 | アレルギー等を赤字強調。未入力は通常色 |
| `m2_product_faq` / 商品FAQ | `question` | `single_line_text_field` | 単一 | 必須 | 質問。未入力なら項目非表示 |
|  | `answer` | `rich_text_field` | 単一 | 任意 | 回答。未入力でも質問は閉じた状態で表示 |

運用上の注意:

- 商品名、価格、比較価格、バリエーション、在庫、商品メディア、販売可否、購入フォームは商品オブジェクトを正とし、Metaobjectへ複製しない。
- 商品メディアはRise標準ギャラリーで表示し、紹介セクションの製品画像も `product.featured_image` を使用する。
- 参照リストの順序が画面の表示順になる。
- Metaobject定義、エントリー、商品Metafieldの作成・更新は管理画面変更にあたるため、ユーザー承認後に行う。
