# API 関数設計仕様書

## 目的

`/app/lib/api/` 配下のモジュールでは, Pulsate の API と Caramel のフロントエンド API をつなぐ関数群を定義している. これらの関数が処理に失敗したときに返すエラーの形式は, 関数によって異なっているとハンドリングが統一できず不具合を招きやすい. この文書では, それらの関数が返す正常系の戻り値型に対して, 型が衝突しないようにエラーの型を明示するための仕様を定義する.

## 定義

型 `ApiResult<T, E>` は, 次のフィールドを持つ 2 種類のオブジェクトの discriminant union として定める.

1. 成功の場合:
   - `ok`: `true` リテラル型.
   - `data`: `T` 型. 成功した際のペイロード.
2. 失敗の場合:
   - `ok`: `false` リテラル型.
   - `err`: `E` 型. 失敗した際のエラー型を表す文字列.

`/app/lib/api/` 配下のモジュールの Pulsate の API を呼び出す関数すべては, `ApiResult` の `T` にレスポンスの型を, `E` に適切なエラー型を適用したものでなけらばならない.

型引数のうち `E` は, `SHOUT_CASE` な文字列のリテラル型またはその直和型でなければならない. 提供できるエラーが無いものは `E` を空文字列リテラル型 `""` にしてもよい. 参考実装として, 文字列が `SHOUT_CASE` かどうかは次のようにして判定できる.

```ts
type UpperAlphabetSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

type StrToUnion<S> = S extends `${infer X}${infer XS}`
  ? X | StrToUnion<XS>
  : never;

type UpperAlphabet = StrToUnion<UpperAlphabetSet>;

type IsShoutCase<S> = S extends `${infer X}${infer XS}`
  ? X extends UpperAlphabet | "_"
    ? IsShoutCase<XS>
    : false
  : S extends ""
    ? true
    : false;
```
