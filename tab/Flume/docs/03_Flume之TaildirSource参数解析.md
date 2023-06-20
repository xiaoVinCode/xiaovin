#### 一、介绍

TaildirSource是一种常用的数据源类型，可以实时监控指定目录下新增或修改的文件，并将其发送到Flume的Channel中供后续处理或转发。

TaildirSource最大的优点在于兼容多种格式和编码的日志文件，非常适合用于实时采集和分析系统日志和应用日志等场景。

#### 二、特性

- 实时监控指定目录下新增的文件
- 支持文件通配符配置（如 `*.log`）
- 支持对指定文件夹递归搜索
- 支持对文件进行正则匹配和过滤
- 支持多线程异步处理，提高并发性能
- 支持多种文件读取方式，包括 Tail、Exec、Polling

#### 二、参数

为了帮助您更好地理解TaildirSource的特性和使用方法，下面对它的各个参数进行一一解析和介绍：

| 序号 | 参数                     | 默认值                                        | 描述                                                         |
| ---- | ------------------------ | --------------------------------------------- | ------------------------------------------------------------ |
| 1    | channels                 | -                                             | 该参数指定 TaildirSource 所连接的 Channel 名称，可以是单个 Channel 或多个 Channel 组成的列表。 |
| 2    | type                     | org.apache.flume.source.taildir.TaildirSource | 该参数指定 TaildirSource 的类型。                            |
| 3    | filegroups               | -                                             | 该参数指定需要监控的文件路径和文件名格式，可以是单个文件或多个文件组成的列表。每个文件组都需要包含一个 dir 和一个 filePattern 参数，用于指定目录和文件名的正则表达式。 |
| 4    | fileSuffix               | 空                                            | 文件的后缀名，为空表示所有类型文件都接收，支持多种类型的配置，如 *.log,*.txt。 |
| 5    | recursiveDirectorySearch | false                                         | 是否递归搜索子目录，默认为 false。                           |
| 6    | deserializer             | TaildirEventDeserializer                      | 该参数指定文件中的数据格式和编码方式，例如 Avro、Protobuf、JSON 等。如果不指定，则默认使用 TaildirEventDeserializer，它支持处理文本日志。 |
| 7    | batchSize                | 100                                           | 该参数指定从 TaildirSource 读取数据的批次大小，即一次读取的最大行数，默认值为 100。 |
| 8    | maxBatchCount            | -                                             | 控制从同一文件连续读取的行数。 如果数据来源是通过tail多个文件的方式，并且其中一个文件的写入速度很快，则它可能会阻止其他文件被处理，因为这个繁忙文件将被无休止地读取。 在这种情况下，可以调低此参数来避免被一直读取一个文件。 |
| 9    | bufferMaxLineLength      | 5000                                          | 该参数指定每行日志数据的最大长度。如果一行数据超过了这个长度，将会被拆分成多个 Event 发送到 Channel。默认值为 5000。 |
| 10   | deletePolicy             | never                                         | 该参数指定 TaildirSource 处理完一个文件后是否删除该文件。可选值为 never、immediate 和 delay。never 表示永远不删除文件；immediate 表示立即删除文件；delay 表示在文件被处理 delaySeconds 秒后再删除。默认值为 never。 |
| 11   | delayMillis              | 5000                                          | 该参数指定 TaildirSource 轮询文件的间隔时间，即检查是否有新文件需要读取的时间间隔。默认值为 5 秒。 |
| 12   | fileHeader               | true                                          | 该参数指定是否在 Event Header 中添加文件名等信息。默认值为 true。 |
| 13   | fileHeaderKey            | file                                          | 指定文件路径存储在 Event Header 中的 key 名称，默认为 "file"。 |
| 14   | headersPrefix            | 空                                            | 该参数指定在 Event Header 中添加文件信息时的前缀。默认为空字符串。 |
| 15   | positionFile             | /var/lib/flume/taildir_position.json          | 该参数指定保存位置信息的文件路径。位置信息用于记录每个文件已经读取到的位置，避免重复读取或漏读。默认值为 "/var/lib/flume/taildir_position.json"。 |
| 16   | idleTimeout              | 120                                           | 若一个文件在一段时间内没有新内容可读，则认为该文件已经读完，默认为 120 秒。当然也可以设置为 -1 表示永不超时（除非文件被删除）。 |
| 17   | ignorePattern            | -                                             | 该参数指定哪些文件名不应该被读取。可以使用正则表达式匹配文件名，例如 ^.*\.gz$ 表示不读取后缀为 .gz 的文件。 |
| 18   | addByteOffset            | true                                          | 该参数指定是否在 Event Header 中添加字节偏移量信息，即当前行数据在文件中的起始位置。默认值为 true。 |
| 19   | fileHeaderKey            | file                                          | 指定文件路径存储在 Event Header 中的 key 名称，默认为 "file"。 |

[Flume 1.9用户手册中文版](https://flume.liyifeng.org/#taildir-source)

![image-20230409175720559](https://static-resource-yang.oss-cn-shenzhen.aliyuncs.com/typora_pic/202304162122643.png)

#### 三、其它可选参数。

##### 1. 文件打开方式相关参数

- `fileHeaderKey`：指定文件路径存储在 Event Header 中的 key 名称，默认为 "file"
- `startFromEnd`：是否从文件末尾开始读取，默认为 false，表示从文件头部开始读取
- `positionFile`: 存储文件读取位置信息的文件路径，默认值是 `${sys:flume.conf.dir}/taildir_positions.json`。
- `preserveExisting`：当一个文件重启后是否保持之前的 Offset 位置。如果设为 false，则从 Taildir Source 启动后，该 Source 只会处理新增的文件，而已经存在的文件将被忽略。默认为 true。

##### 2. 目录扫描方式相关参数

- `recursiveDirectorySearch`：是否递归搜索子目录，默认为 false
- `fileGroups`：定义多个目录或者多个目录下的文件。例如，可以配置多个 directory，每个directory都可以包含多个 filegroup，每个filegroup可以定义多个目录或者多个目录下的文件。示例：`agent.sources.taildir-source.filegroups.f1 = /var/log/f1/*.log,/var/log/f1*.log, /var/log/f2/`。
- `groupMapping`：定义文件名与 group（即 fileGroup）的映射关系。示例：`agent.sources.taildir-source.groupMapping.Washington = f1,f2,f3; agent.sources.taildir-source.groupMapping.Hamilton = f3`。

##### 3. 文件过滤和重命名参数

- `filters`：定义使用哪些 Filter 对文件进行过滤。如果该参数未设置，则默认为“不进行过滤”。
- `filter.<filter-name>.type`：定义要使用的 Filter 的类型，其中 filter-name 表示 Filter 的名称。
- `filter.<filter-name>.<filter-specific-parameter>`：以 filter-specific-parameter 为参数配置 Filter 的具体参数（如 regex）。

##### 4. 多线程异步处理参数

- `deserializer.maxLineLength`：设置解析每行数据的最大长度，默认为 2048 字节。
- `numWorkerThreads`：用于读取文件的线程数，默认为 1。
- `batchSize`：每次读取的数据批次大小，默认为 1000。
- `decompressBufferMaxLen`：解压缩数据的最大长度，默认为 10 MB。

#### 四、配置示例

该例子监控 `/var/log` 目录下所有以 `.log` 后缀的文件，并将其发送到 channel。

```properties
复制代码agent.sources.taildir-source.channels = channel-1
agent.sources.taildir-source.type = org.apache.flume.source.taildir.TaildirSource
agent.sources.taildir-source.positionFile = /var/tmp/taildir_positions.json
agent.sources.taildir-source.fileHeader = true
agent.sources.taildir-source.basenameHeader = true
agent.sources.taildir-source.fileSuffix = .log
agent.sources.taildir-source.recursiveDirectorySearch = true
agent.sources.taildir-source.batchSize = 1000
agent.sources.taildir-source.idleTimeout = 120
agent.sources.taildir-source.ignorePattern = ^(.)*\.(gz|bz2)$
agent.sources.taildir-source.deletePolicy = immediate
agent.sources.taildir-source.headerTable.file = headers.filepath
agent.sources.taildir-source.headerTable.size = headers.filesize
agent.sources.taildir-source.headerTable.type = headers.filetype
agent.sources.taildir-source.fileHeaderKey = file
agent.sources.taildir-source.startFromEnd = false
agent.sources.taildir-source.fileGroups = f1
agent.sources.taildir-source.filegroups.f1 = /var/log
```

需要注意的是，如果 `startFromEnd` 参数设置为 true，则在配置文件中指定的 `positionFile` 应该存储最后一行已经读取的位置信息。

#### 五、实操

```properties
agent1.sources.tail_source.type = TAILDIR
agent1.sources.tail_source.positionFile = ${exec_log_path}/position.json
agent1.sources.tail_source.filegroups = f1 f2
agent1.sources.tail_source.filegroups.f1 = /data/gather_service/logs/stat_info/collect-info.log
agent1.sources.tail_source.filegroups.f2 = /data/gather_service/logs/stat_info/collect-info.log.*[^g][^z]$
agent1.sources.tail_source.maxBatchCount = 5000
agent1.sources.tail_source.selector.type = replicating
```

