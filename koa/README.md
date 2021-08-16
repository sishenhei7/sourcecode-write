# koa

## 实现

实现一个小型的koa，支持以下功能：

## express架构图

## 比较典型的package和实现

1.[util库](https://www.npmjs.com/package/util)实现了其它平台对 nodejs 的 util 库的兼容性。

## 其它

1.判断一个数是否是整数，使用 Number.isInteger，示例代码如下：

```js
if (Number.isInteger(length)) ctx.length = length
```

2.Record<string, any> 和 Record<string, undefined>有什么不同：[官方解释](https://github.com/microsoft/TypeScript/issues/41746)。官方会把 Record<string, any> 当做 noop 什么也不是。

3.为了兼容 ts 引入，koa 在 application 里面加入了静态 default 方法，代码如下。那么对于 umd 包或者 cjs 包的不匹配，是不是也像这样暴露一个方法出去就可以了？

```js
/**
 * Help TS users comply to CommonJS, ESM, bundler mismatch.
 * @see https://github.com/koajs/koa/issues/1513
 */

static get default() {
  return Application;
}
```

4.nodejs有一个 util 库提供了很多工具函数，比如：util.inspect可以用来返回对象的内部结构的字符串表示。util.format可以用来返回一个标准化的字符串。

5.koa 使用了 [http-assert](https://www.npmjs.com/package/http-assert) 来模仿 node 里面的 assert 模块，只不过当为 false 的时候，抛出的不是一个 AssertionError，而是一个 HttpError（使用[http-errors](https://www.npmjs.com/package/http-errors)来实现）.它还能使用深比较，类似 assert.deepEqual，这个是使用 [deep-euqal](https://www.npmjs.com/package/deep-equal) 实现的，它比 assert.deepEqual 快46倍。值得一提的是，这个深比较库比较了很多东西，包括：map、set、symbol、buffer、error 等。

6.ts 的[条件推断](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions)和[类型预测](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)。如果一个函数的返回值为boolean，则使用类型预测，即 xx is xx；如果一个函数的返回值为 void 或者 undefined，则使用条件推断，即 asserts xx (is xx)。

7.可以使用中括号来获取一个类型下面的某个属性的类型。示例如下：

```ts
// 无法访问“Request.querystring”，因为“Request”是类型，不是命名空间。
// 是否要使用“Request["querystring"]”检索“Request”中“querystring”属性的类型?ts(2713)
querystring?: Request.querystring

// 正确形式
querystring?: Request['querystring']
```


