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
2. 路由不支持正则或者变量
3. 不支持async await

## 比较典型的package和实现

express 源码里面的一些 package 和实现

## 其它

1.扫描 tcp 端口，确认服务已经起来了，使用 nc 命令如下：

```
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
