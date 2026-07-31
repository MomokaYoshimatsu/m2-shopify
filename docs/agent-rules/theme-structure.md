# Theme Structure And Page Rules

## Theme Structure

このリポジトリは Shopify公式テーマ Rise `15.5.0` をベースにしており、Shopifyテーマファイルはリポジトリルート直下にあります。

主なディレクトリ:

- `layout/`
- `sections/`
- `snippets/`
- `templates/`
- `assets/`
- `config/`
- `locales/`
- `files/`: M2のワイヤーフレーム。Shopifyへ配信されるテーマファイルではない

現在のリポジトリ構成を優先し、存在しない `shopify-theme/` 配下を前提にしません。

M2固有のCSS / JavaScriptは `assets/m2-*.css` または `assets/m2-*.js` を基本にします。
現時点では `assets/m2-*` の実装ファイルはまだありません。

## Current Implementation Status

- テーマコードはRise標準のセクション、スニペット、テンプレートが中心。
- M2固有のTOP、商品詳細、PDRN特設、ABOUT、FAQはワイヤーフレームがあるが、テーマ実装済みとはみなさない。
- M2固有のFAQテンプレート、FAQ Metaobject、Shoplist Metaobject、PRODUCTドロップダウン、Wishlistアプリ連携は、現時点のコードでは確認できない。
- 通常ページは `templates/page.json`、問い合わせは `templates/page.contact.json` を利用できる。
- 商品、コレクション、ブログ、記事、カート、検索、顧客アカウントなどはRise標準テンプレートが存在する。
- 機能を追加するときは、標準Riseのschema・section group・locale・アクセシビリティ挙動を壊さない。

## Wireframes

現在の参照資料:

- `files/m2_wf_01_top.html`: TOP
- `files/m2_wf_02_product_detail.html`: 商品詳細
- `files/m2_wf_03_pdrn_page.html`: PDRN特設ページ
- `files/m2_wf_04_about.html`: ABOUT
- `files/m2_wf_05_faq.html`: FAQ

扱い:

- ワイヤーフレームはレイアウト・情報設計の参考資料であり、Shopifyテーマの実装コードではない。
- ワイヤーフレーム内の文言、商品名、価格、成分量、認証、効果表現、人物素材の解禁時期、営業時間、配送・返品条件などを確定情報とみなさない。
- 「確定待」「近日」などの注記がある項目は、ユーザー確認なしに公開用コンテンツへ入れない。
- インラインCSSをそのままコピーせず、M2用CSSへ整理し、レスポンシブ・アクセシビリティ・テーマエディター運用を考慮する。
- Figmaが実装対象として指定された場合は、`coding-validation.md` の参照優先度に従う。

## Template And Section Rules

- 新規ページは、既存テンプレートで対応できるかを確認してから専用template / sectionを追加する。
- 新しいsectionには有効な `{% schema %}`、preset、必要なsetting / block定義を用意する。
- section IDは一意である前提でDOM IDやJavaScript selectorを設計する。
- header、drawer、accordion、modalでは `aria-expanded`、`aria-hidden`、`inert`、`hidden`、focus制御などRise標準のアクセシビリティ挙動を維持する。
- `templates/*.json` はテーマエディターのセクション構成を保持するため、必要なキーだけを変更する。
- `sections/header-group.json` と `sections/footer-group.json` は全ページへ影響するため、個別ページ変更より広い影響範囲で確認する。
- `config/settings_data.json` は管理画面設定で自動更新される。画像参照やセクション設定を含む不要差分をcommitしない。

## Admin Content Setup

- M2固有ページのhandle、template名、Metafield / Metaobject運用は、現時点ではコード上で確定していない。
- ページ作成やtemplate割り当てが必要な場合は、候補URL、template、入力内容、既存ページとの重複を確認し、ユーザー承認後に管理画面を変更する。
- 利用規約、プライバシーポリシー、特定商取引法表示を通常ページとShopify標準ポリシーのどちらで運用するかは未確認。既存ストア設定を調べずに決めない。
- 商品・成分・健康に関する表現、法定表示、配送・返品条件はテーマ都合で書き換えず、承認済み原稿を使用する。
