# Caramel

![Caramel logo](./public/caramel_logo.svg)

Caramel は Pulsate の軽量クライアントで, 最低限の機能のみが実装されています.

- アカウントへのログイン・ログアウト
- タイムラインの取得・表示
- テキスト投稿
- 制限されたリアクション

> [!IMPORTANT]
> 
> Caramel は検証などの限られた用途でのみ使用することをお勧めします. 本番環境での使用は推奨されません.

> [!NOTE]
> 
> 現在 Caramel は開発中です. いくつかの機能が未実装であるか, または不安定である可能性があります.

## セットアップ手順:

必要なソフトウェアをインストールしてください:
- node(miseによるインストールを推奨, 実行/開発に必須)
- Pulsate(動作に必要)

Caramelを動作させるにはpulsate(バックエンド)を起動させておく必要があります。  
Pulsateの起動手順は[pulsate-dev/pulsate](https://github.com/pulsate-dev/pulsate)をご覧ください。  
Pulsateが起動した後に以下のコマンドを実行してフロントエンドサーバー(開発用ビルド)を起動できます。
```bash
pnpm dev
```
Caramelは [http://localhost:5173](http://localhost:5173)で起動します(5173ポートが使用不可の場合は自動的にポート番号が変更された状態で起動します。その場合はコンソール出力を確認してください)。

本番環境用ビルドを起動する場合は
```
pnpm preview
```
を実行してください。
Caramelは [http://localhost:8788](http://localhost:8788)で起動します(ポートが使用不可の場合は自動的にポート番号が変更された状態で起動します)。

アカウント登録を行う必要がある場合、`.dev.vars`ファイルを作成し、以下のように設定してください。
```
TURNSTILE_KEY="0xAAAAAA......AAAA"
```
(Cloudflare Turnstileのサイトキーを取得する必要があります)

その他の設定項目は`wrangler.toml`に記述します(以下はデフォルト値):
```
[vars]
API_BASE_URL = "http://localhost:3000"
INSTANCE_FQDN = "example.com"
```
`API_BASE_URL`: PulsateのAPIエンドポイントのベースURL.
`INSTANCE_FQDN`: インスタンスのFQDN. プロダクション環境の場合は変更不可,`http://`や`/`は含めないでください.

## License

Copyright © 2024 Sho Sakuma & Pulsate Project Team.

Caramel is open source software distributed under Apache License 2.0.
