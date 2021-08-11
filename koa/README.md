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
