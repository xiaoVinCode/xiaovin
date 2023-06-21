#### 一、介绍

Flume 1.9.0 版本的 HTTPSource 是一种数据源类型，可以用于接收通过 HTTP 协议传输的数据。这个版本中，HTTPSource 新增了许多参数，并且改进了性能和稳定性。

#### 二、常用参数说明：

| 序号 | 参数                   | 默认值      | 描述                                                         |
| ---- | ---------------------- | ----------- | ------------------------------------------------------------ |
| 1    | type                   | HTTPSource  | 必选参数，指定该数据源类型为 HTTPSource。                    |
| 2    | bind                   | 0.0.0.0     | 可选参数，指定 HTTPServer 绑定的 IP 地址，默认为 0.0.0.0。   |
| 3    | port                   | -           | 必选参数，指定 HTTPServer 监听的端口号。                     |
| 4    | handler                | JSONHandler | 可选参数，指定 HTTP 请求处理类，默认为 org.apache.flume.source.http.JSONHandler。 |
| 5    | handler.maxEvents      | -1          | 可选参数，指定每次 HTTP 请求最大读取事件数，默认为 -1（无限制）。 |
| 6    | handler.defaultCharset | UTF-8       | 可选参数，指定默认字符集，默认为 UTF-8。                     |
| 7    | keep-alive             | true        | 可选参数，指定是否开启 Keep-Alive 功能，默认为 true。        |
| 8    | sslEnabled             | false       | 可选参数，指定是否开启 SSL 加密传输，默认为 false。          |
| 9    | keyStorePath           | -           | 当 `sslEnabled` 设置为 true 时，需要配置这个参数以指定服务端证书的存储路径。 |
| 10   | keyStorePassword       | -           | 当 `sslEnabled` 设置为 true 时，需要配置这个参数以指定服务端证书的密码。 |
| 11   | trustStorePath         | -           | 当 `sslEnabled` 设置为 true 时，需要配置这个参数以指定信任的证书的存储路径。 |
| 12   | trustStorePassword     | -           | 当 `sslEnabled` 设置为 true 时，需要配置这个参数以指定信任的证书的密码。 |
| 13   | excludePattern         | -           | 可选参数，指定不接收的 URL（正则表达式）。                   |
| 14   | channels               | -           | 必选参数，指定数据发送到哪个通道。                           |

以上是 HTTPSource 的常用参数说明，可以根据需求自行定义和添加其他参数。

另外，HTTPSource 还有以下特点：

1. 可以通过 HTTP 协议传输多种类型数据，如文本、JSON、XML、二进制等。
2. 可以将接收到的数据一次性发送到指定的 channel，也可以将数据分割成事件逐个发送到 channel。
3. 可以通过配置 handler 类来指定处理 HTTP 请求的方式，默认提供 JSONHandler 处理类。也可自定义处理类。

[Flume 1.9用户手册中文版](https://flume.liyifeng.org/#http-source)

![image-20230409175908355](https://static-resource-yang.oss-cn-shenzhen.aliyuncs.com/typora_pic/202304091759406.png)

#### 三、更多参数

| 序号 | 参数                   | 默认值  | 描述                                                         |
| ---- | ---------------------- | ------- | ------------------------------------------------------------ |
| 1    | threads                | 10      | 可选参数，指定异步事件处理的线程数，默认为 10。              |
| 2    | maxBatchSize           | -1      | 可选参数，指定每批次最大的事件数量。默认值 -1 表示无限制。   |
| 3    | maxBatchDurationMillis | -1      | 可选参数，指定每批次最大的处理时间。默认值 -1 表示无限制。   |
| 4    | maxRequestSize         | 100MB   | 可选参数，指定每个请求的最大大小。默认值 100MB。             |
| 5    | requestTimeout         | 2000    | 可选参数，指定请求超时时间（毫秒）。默认值 2000 毫秒。       |
| 6    | responseBufferSize     | 16KB    | 可选参数，指定响应缓存区的大小。默认值 16KB。                |
| 7    | customHeaders          | -       | 可选参数，指定自定义的 HTTP 头信息，格式为 K1:V1,K2:V2,...。 |
| 8    | portBinding            | default | 可选参数，指定端口绑定模式，可以是 "default" 或 "exclusive"。 |
| 9    | enableCompression      | false   | 可选参数，指定是否启用 GZIP 压缩传输。默认为 false。         |
| 10   | compressionLevel       | -1      | 可选参数，指定 GZIP 压缩级别。默认为 -1。                    |
| 11   | excludeMethods         | -       | 可选参数，指定不接受的 HTTP 请求方法，如 POST,PUT。默认为空。 |
| 12   | maxHttpHeaderSize      | 8192    | 可选参数，指定 HTTP 请求头最大长度。默认为 8192 字节。       |

#### 四、企业级调优后的 HTTPSource 的案例

1. 配置 IP 地址绑定

如果您的服务器有多个 IP 地址，建议使用 `bind` 参数指定具体的 IP 地址，以避免绑定错误的 IP 地址导致接收不到数据。

```properties
agent.sources.http-source.bind = 192.168.1.100
```

2. 开启 Keep-Alive

开启 Keep-Alive 功能可以减少 TCP 连接的创建和销毁次数，提升性能。

```properties
agent.sources.http-source.keep-alive = true
```

3. 配置 SSL 加密传输

如果需要对传输数据进行加密保护，可以开启 SSL 加密传输功能。需要注意的是，在开启 SSL 加密传输时，需要配置相关的证书信息。

```properties
agent.sources.http-source.sslEnabled = true
agent.sources.http-source.keyStorePath = /path/to/keystore
agent.sources.http-source.keyStorePassword = password
agent.sources.http-source.trustStorePath = /path/to/truststore
agent.sources.http-source.trustStorePassword = password
```

4. 增加异步事件处理线程数

增加异步事件处理线程数可以提高并发性能。

```properties
agent.sources.http-source.threads = 32
```

5. 调整批量发送大小和间隔时间

合理的批量发送大小和间隔时间可以有效减少网络 IO 操作的次数。

```properties
agent.sources.http-source.maxBatchSize = 500
agent.sources.http-source.maxBatchDurationMillis = 1000
```

6. 增加请求超时时间

在处理大流量数据时，可能会出现请求超时的情况。可以适当增加请求超时时间，以避免数据丢失。

```properties
agent.sources.http-source.requestTimeout = 5000
```

7. 开启 GZIP 压缩传输

开启 GZIP 压缩传输可以减少网络传输的数据量，提高传输效率。

```properties
agent.sources.http-source.enableCompression = true
agent.sources.http-source.compressionLevel = 5
```