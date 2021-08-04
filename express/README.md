# express

## 实现

实现一个小型的express，支持一下功能：

1. 基本的服务器
2. 基本的路由，router 和 route
3. 基本的中间件
4. res 和 req 的基本功能
5. 设置 header，支持 etag

没有这些功能：

1. 基本的错误处理。(所以需要严格按照基本语法来写，不然程序会崩溃)
2. 路由只支持简单的正则和params
3. 不支持 async await
4. 不支持解析 url 里面的 params 和 query
5. 不支持 mount 子 express 实例
6. 不支持设置各种 request 头，包括 etag 等
7. 不支持模板引擎和相关的 header、link 等配置
8. 不支持 proxy

## 比较典型的package和实现

express 源码里面的一些 package 和实现

1.[etag 库](https://www.npmjs.com/package/etag)。里面判断是一个 fs.Stats 对象还是一个实体，如果是一个 fs.Stats 对象，则使用文件信息中的 size 和 mtime进行拼接；如果是一个实体，则使用 crypto 库取摘要等信息。（其中 toString(16) 好像很奇妙，但是目前我还不知道是什么意思）

```js
// 主要代码
var tag = isStats
  ? stattag(entity)
  : entitytag(entity)

function stattag (stat) {
  var mtime = stat.mtime.getTime().toString(16)
  var size = stat.size.toString(16)

  return '"' + size + '-' + mtime + '"'
}

function entitytag (entity) {
  if (entity.length === 0) {
    // fast-path empty
    return '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"'
  }

  // compute hash of entity
  var hash = crypto
    .createHash('sha1')
    .update(entity, 'utf8')
    .digest('base64')
    .substring(0, 27)

  // compute length of entity
  var len = typeof entity === 'string'
    ? Buffer.byteLength(entity, 'utf8')
    : entity.length

  return '"' + len.toString(16) + '-' + hash + '"'
}
```

2.[safe-buffer](https://www.npmjs.com/package/safe-buffer)。这个库是用来在各个版本的 nodejs 里面兼容 buffer api的。它会判断 nodejs 里面的 buffer api 是否已经有相关方法，如果有则直接使用这个 buffer api；如果没有则使用这个库的 pollyfill。代码如下：

```js
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}
```

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

8.express里面router有一层layer，route也有一层layer，其中router那层的layer是处理url匹配的，route那层的layer是处理method匹配，并处理callback数组的。

9.express 在初始化的时候会自己初始化两个中间件，一个中间件把 query 绑到 res 上面去，一个中间件把自己定义的 request 和 response 分别绑到 req 和 res 上面去：

```js
module.exports = function query(options) {
  var opts = merge({}, options)
  var queryparse = qs.parse;

  if (typeof options === 'function') {
    queryparse = options;
    opts = undefined;
  }

  if (opts !== undefined && opts.allowPrototypes === undefined) {
    // back-compat for qs module
    opts.allowPrototypes = true;
  }

  return function query(req, res, next){
    if (!req.query) {
      var val = parseUrl(req).query;
      req.query = queryparse(val, opts);
    }

    next();
  };
}

exports.init = function(app){
  return function expressInit(req, res, next){
    if (app.enabled('x-powered-by')) res.setHeader('X-Powered-By', 'Express');
    req.res = res;
    res.req = req;
    req.next = next;

    setPrototypeOf(req, app.request)
    setPrototypeOf(res, app.response)

    res.locals = res.locals || Object.create(null);

    next();
  };
}
```


