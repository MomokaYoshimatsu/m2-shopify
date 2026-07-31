# M2 Shopify Theme

Shopifyストア `m2-test-zyzvnzan.myshopify.com` のテーマ開発用リポジトリです。

- ベーステーマ: Rise 15.5.0
- ライブテーマID: `187100430627`
- GitHubの既定ブランチ: `main`
- 開発ブランチ: `develop`
- ワイヤーフレーム: `files/`

## セットアップ

1. Shopify CLIをインストールします。
2. このリポジトリをcloneし、`develop` をcheckoutします。
3. ストアのテーマ権限を持つShopifyアカウントでログインします。
4. 開発サーバーを起動します。

```sh
git clone https://github.com/MomokaYoshimatsu/m2-shopify.git
cd m2-shopify
git switch develop
shopify theme dev
```

`shopify theme dev` は一時的な開発テーマを作成するため、ライブテーマを直接上書きしません。

## よく使うコマンド

```sh
# Liquidとテーマ構成を検証
shopify theme check

# 開発テーマでプレビュー
shopify theme dev

# ライブテーマの最新状態をローカルへ取得
shopify theme pull --environment production
```

ライブテーマへの直接pushは行わず、通常は `develop` で開発・確認し、Pull Request経由で `main` に反映します。

## ディレクトリ

- `assets/`: CSS、JavaScript、画像など
- `config/`: テーマ設定
- `layout/`: 全体レイアウト
- `locales/`: 翻訳
- `sections/`: セクション
- `snippets/`: 再利用可能なLiquid
- `templates/`: ページテンプレート
- `files/`: デザイン確認用の静的HTML
