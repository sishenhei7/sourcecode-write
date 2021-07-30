# express

## 实现

实现一个小型的express，支持一下功能：

1. 基本的服务器
2. 基本的路由，router和route
3. 基本的中间件
4. res和req的基本功能
5. 设置header

没有这些功能：

1. 基本的错误处理。(所以需要严格按照基本语法来写，不然程序会崩溃)
2. 路由只支持简单的正则和params
3. 不支持async await
4. 不支持解析url里面的params和query

## 比较典型的package和实现

express 源码里面的一些 package 和实现

## 其它

1.扫描 tcp 端口，确认服务已经起来了，使用 nc 命令如下：

``` bash
nc -v -z localhost 2997-3000

输出：
nc: connectx to localhost port 2997 (tcp) failed: Connection refused
nc: connectx to localhost port 2997 (tcp) failed: Connection refused
nc: connectx to localhost port 2998 (tcp) failed: Connection refused
nc: connectx to localhost port 2998 (tcp) failed: Connection refused
nc: connectx to localhost port 2999 (tcp) failed: Connection refused
nc: connectx to localhost port 2999 (tcp) failed: Connection refused
Connection to localhost port 3000 [tcp/hbci] succeeded!
```

2.一般在判断是否为 undefined 的地方去判断是否等于 null 会更好(除非需要要 null 才不使用这种方法)，代码如下：

``` js
var path = getPathname(req);
if (path == null) {
  return done(layerError);
}
```

3.正则匹配路径是很耗性能的，为了提速，预先检测 star 和 slash，当匹配的时候，如果是 star 或者 slash 就不使用正则了。代码如下：

``` js
// set fast path flags
this.regexp.fast_star = path === '*'
this.regexp.fast_slash = path === '/' && opts.end === false

// 匹配代码
if (path != null) {
  // fast path non-ending match for / (any path matches)
  if (this.regexp.fast_slash) {
    this.params = {}
    this.path = ''
    return true
  }

  // fast path for * (everything matched in a param)
  if (this.regexp.fast_star) {
    this.params = {'0': decode_param(path)}
    this.path = path
    return true
  }

  // match the path
  match = this.regexp.exec(path)
}
```

4.express 里面是怎么处理 options 请求的。（待定）

5.处理 url 的时候，要注意转义：

```js
try {
  return decodeURIComponent(val);
} catch (err) {
  if (err instanceof URIError) {
    err.message = 'Failed to decode param \'' + val + '\'';
    err.status = err.statusCode = 400;
  }

  throw err;
}
```

6.增加局部变量来提升性能：

```js
var keys = this.keys;
var params = this.params;

for (var i = 1; i < match.length; i++) {
  var key = keys[i - 1];
  var prop = key.name;
  var val = decode_param(match[i])

  if (val !== undefined || !(hasOwnProperty.call(params, prop))) {
    params[prop] = val;
  }
}
```

7.有一个缺陷，就是使用hash的时候：

```js
this.cache = {};

// 应该用下面的形式
this.cache = Object.create(null)
this.cache = new Map()
```
