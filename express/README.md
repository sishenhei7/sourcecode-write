# express

## 实现

实现一个小型的express，支持一下功能：

1. http服务器：app.get、app.post等
2. 中间件模型：app.use

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
