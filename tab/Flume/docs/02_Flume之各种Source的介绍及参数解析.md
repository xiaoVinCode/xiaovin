## 一、Source介绍

Source用于对接各种数据源，将收集到的事件发送到临时存储Channel中。

常用的source类型有：Avro Source、Exec Source、Kafka Source、TaildirSource、Spooling Directory Source等，其他类型source请查阅Flume-NG官方介绍。

|      | source类型                 | 说明                                                         |
| ---- | -------------------------- | ------------------------------------------------------------ |
| 1    | Thrift Source              | 支持Thrift协议，Thrift Source监听Thrift端口，接收外部Thrift客户端发送过来的Thrift Event数据。在多级流中，Thrift Source可以和前一个Flume Agent的Thrift Sink配对，建立分层收集拓扑。Thrift Source支持基于Kerberos身份验证的安全模式 |
| 2    | Kafka Source               | 从Kafka Topic中读取数据，Kafka Source相当于消息队列的Consumer |
| 3    | Exec Source                | 基于Unix的command在标准输出上生产数据。Exec Source在启动时调用的Unix命令，该命令进程会持续地把标准日志数据输出到Exec Source，如果命令进程关闭，Exec Source也会关闭。Exec Source支持cat [named pipe]或者tail -F [file]命令。Exec Source最大的问题就是数据有可能丢失，因为当Channel接收Exec Source数据出错时或者抛出异常时，Exec Client并不能捕获到该错误 |
| 4    | Spooling Directory Source  | 监控指定目录内数据变更。Spooling Directory Source监听系统上的指定目录，当目录中有新的文件创建时，Spooling Directory Source会把新文件的内容读取并推送到Channel中，并且把已读取的文件重命名成指定格式或者把文件删除。由于数据是以文件的形式存放的系统中，Spooling Directory Source的可靠性非常高，即使是Flume Agent崩溃或者重启，数据也可以恢复。Spool Source有2个注意地方，第一个是拷贝到spool目录下的文件不可以再打开编辑，第二个是spool目录下不可包含相应的子目录Spooling Directory Source适合用于同步新文件，但不适合对实时追加日志的文件进行监听并同步。 |
| 5    | Taildir Source             | Taildir Source是1.7版本的新特性，综合了Spooling Directory Source和Exec Source的优点。Taildir Source可实时监控一批文件，并记录每个文件最新消费位置，agent进程重启后不会有重复消费的问题。使用时建议用1.8.0版本的flume，1.8.0版本中解决了Taildir Source一个可能会丢数据的bug。 |
| 6    | Netcat Source              | 监控某个端口，将流经端口的每一个文本行数据作为Event输入      |
| 7    | HTTP Source                | 基于HTTP POST或GET方式的数据源，支持JSON、BLOB表示形式。其中GET主要用户测试，不建议生产环境使用。HTTP数据通过handler（实现HTTPSourceHandler接口）转换成Event，该handler接收HttpServletRequest并返回Event数组。如果handler出现异常，HTTP Source返回400错误。如果Channel满了或者Channel无法接收Event，HTTP Source返回503错误。 |
| 8    | Syslog Sources             | 读取syslog数据，产生Event，支持UDP和TCP两种协议。这个Source分成三类SyslogTCP Source、Multiport Syslog TCP Source（多端口）与SyslogUDP Source。其中TCP Source为每一个用回车（\ n）来分隔的字符串创建一个新的事件。而UDP Source将整个消息作为一个单一的事件。 |
| 9    | JMS Source                 | 从JMS系统（消息、主题）中读取数据，该Source目前只在ActiveMQ中测试 |
| 10   | Stress Source              | 压力测试用。StressSource 是内部负载生成source的实现，允许用户配置Event有效载荷的大小。 |
| 11   | Twitter 1% firehose Source | 通过API持续下载Twitter数据，试验性质                         |
| 12   | Scribe Source              | Scribe是另一种类型的提取系统。采用现有的Scribe提取系统，Flume应该使用基于Thrift的兼容传输协议的ScribeSource。 |
| 13   | Sequence Generator Source  | 序列生成器数据源，生产序列数据，实验性质                     |
| 14   | Avro Source                | 支持Avro协议（Avro RPC），Avro Source监听Avro端口，接收外部Avro客户端发送过来的Avro Event数据。在多级流中，Avro Source可以和前一个Flume Agent的Avro Sink配对，建立分层收集拓扑 |

### 1、Avro Source

支持Avro协议，接收RPC事件请求。Avro Source通过监听Avro端口接收外部Avro客户端流事件（event），在Flume的多层架构中经常被使用接收上游Sink发送的event。

#### ① 配置参数解析：

| 参数    | 默认值 | 描述                                                         |
| ------- | ------ | ------------------------------------------------------------ |
| type    | avro   | 类型名称                                                     |
| bind    |        | 绑定的IP                                                     |
| port    |        | 监听的端口                                                   |
| threads |        | （重要）接收请求的线程数，当需要接收多个avro客户端的数据流时要设置合适的线程数，否则会造成avro客户端数据流积压。 |

#### ② 简单模板

```properties
# 命名 Agent 上的组件
agent_name.sources = source_name
agent_name.channels = channel_name
agent_name.sinks = sink_name

# source
agent_name.sources.source_name.type = avro
agent_name.sources.source_name.bind = 127.0.0.1
agent_name.sources.source_name.port = 9876
agent_name.sources.source_name.threads= 3

# channel
agent_name.channels.channel_name.type = file
XXX
XXX

# sink
agent_name.sinks.sink_name.type = hdfs
XXX
XXX

# source | channel | sink 关联
agent_name.sources.source_name.channels = channel_name
agent_name.sinks.sink_name.channel = channel_name
```

> 说明：这里设置 avro 启动接收客户端数据流的最大线程数为3。

### 2、Kafka Source

对接分布式消息队列 Kafka，作为 Kafka 的消费者持续从kafka中拉取数据，如果多个 Kafka Source 同时消费kafka中同一个主题（topic），则 Kafka Source 的kafka.consumer.group.id 应该设置成相同的组id，多个 Kafka Source 之间不会消费重复的数据，每一个Source 都会拉取 Topic 下的不同数据。

#### ① 配置参数解析：

| 参数                    | 默认值                                    | 描述                                                         |
| ----------------------- | ----------------------------------------- | ------------------------------------------------------------ |
| type                    | org.apache.flume.source.kafka.KafkaSource | 类型名称                                                     |
| kafka.bootstrap.servers |                                           | Kafka broker列表，格式为ip1:port1,ip2:port2……，建议配置多个值提高容错能力，多个值之间用逗号隔开。 |
| kafka.topics            |                                           | 消费的topic名称。                                            |
| kafka.topics.regex      |                                           | 通过正则表达式匹配一组topic，设置此选项会覆盖kafka.topics选项的设置。 |
| kafka.consumer.group.id | flume                                     | kafka source所属组id                                         |
| batchSize               | 1000                                      | 批量写入channel的最大消息数                                  |
| batchDurationMillis     | 1000                                      | 等待批量写入channel的最长时间，这个参数和batchSize两个参数只要有一个满足都会触发批量写入channel操作，单位：毫秒 |

#### ② 简单模板

```properties
# 命名 Agent 上的组件
agent_name.sources = source_name
agent_name.channels = channel_name
agent_name.sinks = sink_name

# source
agent_name.sources.source_name.type = org.apache.flume.source.kafka.KafkaSource
agent_name.sources.source_name.batchSize = 5000
agent_name.sources.source_name.batchDurationMillis = 2000
agent_name.sources.source_name.kafka.bootstrap.servers = zkServer01:9092,zkServer02:9092
agent_name.sources.source_name.kafka.topics = test_topic
agent_name.sources.source_name.kafka.consumer.group.id = flume_consumer_test

# channel
agent_name.channels.channel_name.type = file
XXX
XXX

# sink
agent_name.sinks.sink_name.type = hdfs
XXX
XXX

# source | channel | sink 关联
agent_name.sources.source_name.channels = channel_name
agent_name.sinks.sink_name.channel = channel_name
```

> 说明：这里设置 Source 批量写入 Channel 的最大消息数为5000，Source  等待批量写入 Channel 的最长时间为2秒，Channel  拉取数据的 Kafka Broker 列表为zkServer01:9092,zkServer02:9092，Source 消费的主题名称为 test_topic ，Source 所属的consumer group id 为 flume_consumer_test。

### 3、Exec Source

支持Linux命令，收集标准输出数据或者通过tail -f file的方式监听指定文件。ExecSource可以实现实时的消息传输，但是它不记录已经读取文件的位置，不支持断点续传，如果Exec Source重启或者挂掉都会造成后续增加的消息丢失，建议只是在测试环境使用。

#### ① 配置参数解析：

| 参数    | 默认值 | 描述      |
| ------- | ------ | --------- |
| type    | exec   | 类型名称  |
| command |        | Linux命令 |

#### ② 简单模板

```properties
# 命名 Agent 上的组件
agent_name.sources = source_name
agent_name.channels = channel_name
agent_name.sinks = sink_name

# source
agent_name.sources.source_name.type = exec
agent_name.sources.source_name.command = tail -F /var/log/test.log

# channel
agent_name.channels.channel_name.type = file
XXX
XXX

# sink
agent_name.sinks.sink_name.type = hdfs
XXX
XXX

# source | channel | sink 关联
agent_name.sources.source_name.channels = channel_name
agent_name.sinks.sink_name.channel = channel_name
```

> 说明：这里设置 Source 通过tail -F命令监听/var/log/test.log文件。

### 4、Spooling Directory Source

监听一个文件夹，收集文件夹下新文件数据，收集完新文件数据会将文件名称的后缀改为．COMPLETED，缺点是不支持老文件新增数据的收集，并且不能够对嵌套文件夹递归监听。

#### ① 配置参数解析：

| 参数          | 默认值      | 描述                                            |
| ------------- | ----------- | ----------------------------------------------- |
| type          | spooldir    | 类型名称                                        |
| spoolDir      |             | source监听的文件夹。                            |
| fileHeader    | false       | 是否添加文件的绝对路径到event的header中         |
| fileHeaderKey | file        | 添加到event header中文件绝对路径的键值          |
| selector.type | replicating | 选择器类型（可选值为replicating或multiplexing） |
| fileSuffix    | COMPLETED   | 收集完新文件数据给文件添加的后缀名称            |

#### ② 简单模板

```properties
# 命名 Agent 上的组件
agent_name.sources = source_name
agent_name.channels = channel_name
agent_name.sinks = sink_name

# source
agent_name.sources.source_name.type = spooldir
agent_name.sources.source_name.spoolDir = /var/log/test.log
agent_name.sources.source_name.fileHeader = true

# channel
agent_name.channels.channel_name.type = file
XXX
XXX

# sink
agent_name.sinks.sink_name.type = hdfs
XXX
XXX

# source | channel | sink 关联
agent_name.sources.source_name.channels = channel_name
agent_name.sinks.sink_name.channel = channel_name
```

> 说明：这里设置 Source 监听的文件夹路径为/usr/local/flume/log，在 event 头信息中添加文件绝对路径信息。

### 5、Taildir Source (建议修改源码，后续补充相关操作文章)

监听一个文件或文件夹，通过正则表达式匹配需要监听的数据源文件，支持文件夹嵌套递归监听（重要source）, Taildir Source将通过监听的文件位置写入到文件中实现断点续传，并且能够保证没有重复数据的读取。

#### ① 配置参数解析：

| 参数                        | 默认值  | 描述                                                         |
| --------------------------- | ------- | ------------------------------------------------------------ |
| type                        | TAILDIR | 类型名称                                                     |
| positionFile                |         | 保存监听文件读取位置的文件路径                               |
| skipToEnd                   | false   | 在位置文件中没有保存监听文件的位置是否直接跳到文件的末尾     |
| idleTimeout                 | 120000  | 关闭空闲文件延迟时间，如果有新的记录添加到已关闭的空闲文件taildir srouce将继续打开该空闲文件，单位：毫秒。 |
| writePosInterval            | 3000    | 向保存读取位置文件中写入读取文件位置的时间间隔（单位：毫秒） |
| batchSize                   | 100     | 批量写入channel最大event数                                   |
| maxBackoffSleep             | 5000    | 每次最后一次尝试没有获取到监听文件最新数据的最大延迟时间，单位：毫秒。 |
| backoffSleepIncrement       | 1000    | 每次最后一次尝试没有获取到监听文件最新数据后增加延迟时间的幅度 |
| cachePatternMatching        | true    | 监听的文件夹下通过正则表达式匹配的文件数量可能会很多，将匹配成功的监听文件列表和读取文件列表的顺序都添加到缓存中可以提高性能 |
| fileHeader                  | false   | 是否添加文件的绝对路径到event的header中                      |
| fileHeaderKey               | file    | 添加到event header中文件绝对路径的键值                       |
| filegroups                  |         | 监听的文件组列表，taildirsource通过文件组监听多个目录或文件  |
| filegroups.\<filegroupName> |         | 表达式路径或者监听指定文件路径                               |

#### ② 简单模板

```properties
# 命名 Agent 上的组件
agent_name.sources = source_name
agent_name.channels = channel_name
agent_name.sinks = sink_name

# source
agent_name.sources.source_name.type = TAILDIR
agent_name.sources.source_name.filegroups = f1 f2
agent_name.sources.source_name.filegroups.f1 = /var/log/test_01.log
agent_name.sources.source_name.filegroups.f2 = /var/log/test_02/*.log*
agent_name.sources.source_name.fileHeader = true
agent_name.sources.source_name.positionFile = /usr/local/flume/position/taildir_position.json

# channel
agent_name.channels.channel_name.type = file
XXX
XXX

# sink
agent_name.sinks.sink_name.type = hdfs
XXX
XXX

# source | channel | sink 关联
agent_name.sources.source_name.channels = channel_name
agent_name.sinks.sink_name.channel = channel_name
```

> 说明：保存监听文件读取位置信息的文件路径为/usr/local/flume/position/taildir_position.json，监听文件列表包含两个监听文件组f1、f2，f1监听指定log文件/var/log/test_01.log ，f2通过正则表达式匹配/var/log/test_02/路径下包含log关键字的所有文件，并且将文件的绝对路径添加到event的头信息中。