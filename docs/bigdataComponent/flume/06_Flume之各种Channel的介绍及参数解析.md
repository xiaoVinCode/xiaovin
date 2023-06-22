---
# 这是文章的标题
title: 06_各种Channel的介绍及参数解析
# 这是页面的图标
# icon: fab fa-markdown
# 这是侧边栏的顺序
order: 1
# 设置作者
author: xiaovin
# 设置写作时间
date: 2023-04-01
# 是否原创
# isOriginal: true
# 一个页面可以有多个分类
category:
  - 数据集成
# 一个页面可以有多个标签
# tag:
#   - Flume
# 此页面会在文章列表置顶
sticky: true
# 此页面会出现在文章收藏中
star: true
---

## 一、Channel介绍

Channel被设计为Event中转临时缓冲区，存储Source收集并且没有被Sink读取的Event，为平衡Source收集和Sink读取数据的速度，可视为Flume内部的消息队列。Channel线程安全并且具有事务性，支持source写失败重复写和sink读失败重复读等操作。

常用的Channel类型有Memory Channel、File Channel、KafkaChannel等。

| Channel类型              | 说明                                                         |
| ------------------------ | ------------------------------------------------------------ |
| MemoryChannel            | 基于内存的channel，实际就是将event存放于内存中一个固定大小的队列中。其优点是速度快，缺点是agent挂掉时会丢失数据。 |
| FileChannel              | 基于文件的Channel, 在磁盘上指定一个目录用于存放event，同时也可以指定目录的大小。优点是数据可恢复，相对于memory channel来说缺点是要频繁的读取磁盘，速度较慢。 |
| Spillable Memory Channel | Event存放在内存和磁盘上，内存作为主要存储，当内存达到一定临界点的时候会溢写到磁盘上，兼具Memory Channel和File Channel的优势，但不稳定，不建议生产环境使用，并且性能不佳。 |
| JDBC Channel             | 将event存放于一个支持JDBC连接的数据库中，目前官方推荐的是Derby库，其优点是数据可以恢复，速度比FileChannel慢 |
| Kafka Channel            | 将events存储在Kafka集群中。Kafka提供高可用性和高可靠性，所以当agent或者kafka broker 崩溃时，events能马上被其他sinks可用。Kafka channel可以被多个场景使用：<br/>    Flume source和sink - 它为events提供可靠和高可用的channel；<br/>    Flume source和interceptor，但是没sink - 它允许写Flume evnets到Kafka topic；<br/>    Flume sink，但是没source - 这是一种低延迟，容错的方式从Kafka发送events到Flume sinks |

### 1、Memory Channel

对比Channel, Memory Channel读写速度快，但是存储数据量小，Flume进程挂掉、服务器停机或者重启都会导致数据丢失。部署Flume Agent的线上服务器内存资源充足、不关心数据丢失的场景下可以使用。

#### ① 配置参数解析：

| 配置参数                     | 默认值           | 描述                                                         |
| ---------------------------- | ---------------- | ------------------------------------------------------------ |
| type                         | memory           | 类型名称                                                     |
| capacity                     | 100              | channel中存储的最大event数                                   |
| transactionCapacity          | 100              | 每一次事务中写入和读取的event最大数                          |
| keep-alive                   | 3                | 在Channel中写入或读取event等待完成的超时时间，单位：秒       |
| byteCapacityBufferPercentage | 20               | 缓冲空间占Channel容量（byteCapacity）的百分比，为event中的头信息保留了空间，单位：百分比 |
| byteCapacity                 | Flume堆内存的80% | 允许的最大总**字节**作为此通道中所有事件的总和。 实现只计算Event`body`，这也是提供`byteCapacityBufferPercentage`配置参数的原因。 默认为计算值，等于JVM可用的最大内存的80％（即命令行传递的-Xmx值的80％）。 请注意，如果在单个JVM上有多个内存通道，并且它们碰巧保持相同的物理事件（即，如果您使用来自单个源的复制通道选择器），那么这些事件大小可能会因为通道byteCapacity目的而被重复计算。 将此值设置为“0”将导致此值回退到大约200 GB的内部硬限制。 |

配置 capacity 和 	值 。默认配置规则为:

channels.capacity >= channels.transactionCapacity >= source.batchSize

```properties
官方channels配置示例
a1.channels = c1
a1.channels.c1.type = memory
a1.channels.c1.capacity = 10000
a1.channels.c1.transactionCapacity = 10000
a1.channels.c1.byteCapacityBufferPercentage = 20
a1.channels.c1.byteCapacity = 800000
本案例修改之后的channels 配置
agent.channels.c1.type = memory
agent.channels.c1.capacity=550000
agent.channels.c1.transactionCapacity=520000
```

> 提示
>
> 举2个例子来帮助理解最后两个参数吧：
>
> 两个例子都有共同的前提，假设JVM最大的可用内存是100M（或者说JVM启动时指定了-Xmx=100m）。
>
> - 例子1： *byteCapacityBufferPercentage* 设置为20， *byteCapacity* 设置为52428800（就是50M），此时内存中所有 Event body 的总大小就被限制为50M *（1-20%）=40M，内存channel可用内存是50M。
>
> - 例子2： *byteCapacityBufferPercentage* 设置为10， *byteCapacity* 不设置，此时内存中所有 Event body 的总大小就被限制为100M * 80% *（1-10%）=72M，内存channel可用内存是80M。

#### ② 简单模板

```properties
# 命名 Agent 上的组件
agent_name.sources = source_name
agent_name.channels = channel_name
agent_name.sinks = sink_name

# source
agent_name.sources.source_name.type = avro
XXX
XXX

# channel
# channel中存储的最大event数为3000000，一次事务中可读取或添加的event数为20000
agent_name.channels.channel_name.type = memory
agent_name.channels.channel_name.capacity = 10000
agent_name.channels.channel_name.transactionCapacity = 10000

# sink
agent_name.sinks.sink_name.type = hdfs
XXX
XXX

# source | channel | sink 关联
agent_name.sources.source_name.channels = channel_name
agent_name.sinks.sink_name.channel = channel_name
```

### 2、File Channel

#### 介绍：

1. 将 event 写入磁盘文件，与 Memory Channel 相比存储容量大，无数据丢失风险。
2. File Channle 数据存储路径可以配置多磁盘文件路径，通过磁盘并行写入提高FileChannel 性能。
3. Flume 将 Event 顺序写入到 File Channel 文件的末尾，在配置文件中通过设置 maxFileSize 参数配置数据文件大小，当被写入的文件大小达到上限时 Flume 会重新创建新的文件存储写入的 Event。
4. 当然数据文件数量也不会无限增长，当一个已关闭的只读数据文件中的 Event 被读取完成，并且 Sink 已经提交读取完成的事务，则 Flume 将删除存储该数据的文件。
5. Flume 通过设置检查点和备份检查点实现在 Agent 重启之后快速将 File Channle 中的数据按顺序回放到内存中，保证在 Agent 失败重启后仍然能够快速安全地提供服务。

#### ① 配置参数解析：

| 配置参数             | 默认值                        | 描述                                                         |
| -------------------- | ----------------------------- | ------------------------------------------------------------ |
| type                 | file                          | 类型名称                                                     |
| checkpointDir        | 默认在启动flume用户目录下创建 | 检查点目录，建议单独配置磁盘路径                             |
| useDualCheckpoints   | false                         | 是否开启备份检查点，<br/>建议设置为true开启备份检查点，备份检查点的作用是当Agent意外出错导致写入检查点文件异常，在重新启动File Channel时通过备份检查点将数据回放到内存中，<br/>如果不开启备份检查点，在数据回放的过程中发现检查点文件异常会对所有数据进行全回放，全回放的过程相当耗时 |
| backupCheckpointDir  |                               | 备份检查点目录，最好不要和检查点目录（checkpointDir）在同一块磁盘上 |
| checkpointInterval   | 30000                         | 每次写检查点的时间间隔，单位：毫秒                           |
| dataDirs             |                               | 存储event信息磁盘存储路径，建议配置多块盘的多个路径，通过磁盘的并行写入来提高file channel性能，多个磁盘路径用逗号隔开 |
| transactionCapacity  | 10000                         | 一次事务中写入和读取的event最大数                            |
| maxFileSize          | 2146435071                    | 每个数据文件的最大大小，单位：字节                           |
| minimumRequiredSpace |                               | 磁盘路径最小剩余空间，如果磁盘剩余空间小于设置值，则不再写入数据 |
| capacity             |                               | filechannel可容纳的最大event数                               |
| keep-alive           | 3                             | 在Channel中写入或读取event等待完成的超时时间，单位：秒       |

#### ② 简单模板

```properties
# 命名 Agent 上的组件
agent_name.sources = source_name
agent_name.channels = channel_name
agent_name.sinks = sink_name

# source
agent_name.sources.source_name.type = avro
XXX
XXX

# channel
# channel中存储的最大event数为3000000，一次事务中可读取或添加的event数为20000
# 检查点路径为/usr/local/flume/checkpoint，数据存放路径为/data1, /data2，开启备份检查点，备份检查点路径为/data/flume/backup/checkpoint
agent_name.channels.channel_name.type = file
agent_name.channels.channel_name.dataDirs = ${log_path}/dataDir1, ${log_path}/dataDir2
agent_name.channels.channel_name.checkpointDir = ${exec_log_path}/stat_info_checkpointDir
agent_name.channels.channel_name.useDualCheckpoints = true 
agent_name.channels.channel_name.backupCheckpointDir = /data/flume/backup/checkpoint
agent_name.channels.channel_name.capacity = 3000000
agent_name.channels.channel_name.transactionCapacity = 20000
agent_name.channels.channel_name.keep-alive = 5

# sink
agent_name.sinks.sink_name.type = hdfs
XXX
XXX

# source | channel | sink 关联
agent_name.sources.source_name.channels = channel_name
agent_name.sinks.sink_name.channel = channel_name
```

### 3、Kafka Channel

将Kafka作为Channel存储，Kafka是分布式、可扩展、高容错、高吞吐的分布式系统，Kafka通过优秀的架构设计充分利用磁盘顺序特性，在廉价的硬件条件下完成高效的消息发布和订阅。

Memory Channel在使用的过程中受内存容量的限制不能缓存大量的消息，并且如果Memory Channel中的消息没来得及写入Sink，此时Agent出现故障就会造成数据丢失。File Channel虽然能够缓存更多的消息，但如果缓存下来的消息还没有写入Sink，此时Agent出现故障则File Channel中的消息不能被继续使用，直到该Agent重新恢复才能够继续使用File Channel中的消息。Kafka Channel相对于Memory Channel和File Channel存储容量更大、容错能力更强，弥补了其他两种Channel的短板，如果合理利用Kafka的性能，能够达到事半功倍的效果。

有了Kafka Channel可以在日志收集层只配置Source组件和Kafka Channel组件，不需要再配置Sink组件，减少了日志收集层启动的进程数并且有效降低服务器内存、磁盘等资源使用率，日志汇聚层可以只配置Kafka Channel和Sink，不需要再配置Source，减少日志汇聚层的进程数，这样的配置既能降低服务器的资源使用率又能减少Event在网络之间的传输，有效提高日志采集系统的性能。

#### ① 配置参数解析：

| 参数                             | 默认值                                      | 描述                                                         |
| -------------------------------- | ------------------------------------------- | ------------------------------------------------------------ |
| type                             | org.apache.flume.channel.kafka.KafkaChannel | 类型名称                                                     |
| kafka.bootstrap.servers          |                                             | Kafka broker列表，格式为ip1:port1,ip2:port2…，建议配置多个值提高容错能力，多个值之间用逗号隔开 |
| kafka.topic                      | flume-channel                               | topic名称                                                    |
| kafka.consumer.group.id          | flume                                       | Consumer组id, Kafka Channel使用 consumer.group.id 注册到Kafka，该值是连接kafka集群的唯一值，同一组内可以有多个Consumer，多个Consumer之间是互不干扰的，一个主题下的一条消息只能被同一组内的一个Consumer消费，其中的一个Consumer消费失败其他的Consumer会继续消费<br/>基于这个特性，可以有多个Agent的KafkaChannel使用相同的consumer.group.id，当一个Agent运行失败则其他Agent可以继续消费，很容易地提高了消息的容错能力 |
| parseAsFlumeEvent                | true                                        | 是否以Avro FlumeEvent模式写入到Kafka Channel中<br/>如果写入到Kafka Channel中主题的Producer只有Flume Source，则该参数应该设置为true<br/>如果有其他Producer也同时在向同一主题写数据则该参数应该设置为false<br/>Flume Source写入到Kafka的消息在Kafka外部需要使用flume-ng-sdk提供的org.apache. flume.source.avro.AvroFlumeEvent类解析 |
| migrateZookeeperOffsets          | true                                        | 是否迁移Zookeeper中存储的Consumer消费的偏移量到Kafka中，主要是为了兼容Kafka0.9以下版本的Kafka<br/>    Kafka 0.9以下版本Consumer消费的偏移量保存在Zookeeper中<br/>    Kafka 0.9之后的版本开始将偏移量保存到Kafka的一个主题中 |
| pollTimeout                      | 500毫秒                                     | 轮询超时时间                                                 |
| kafka.consumer.auto.offset.reset | latest                                      | 当Kafka中没有Consumer消费的初始偏移量或者当前偏移量在Kafka中不存在（比如数据已经被删除）情况下，Consumer选择从Kafka拉取消息的方式<br/>    earliest表示从最早的偏移量开始拉取<br/>    latest表示从最新的偏移量开始拉取<br/>    none表示如果没有发现该Consumer组之前拉取的偏移量则抛出异常 |
| kafka.enable.auto.commit         | alse                                        | Consumer是否自动提交偏移量                                   |

Kafka Channel相关操作在org.apache.flume.channel.kafka包的KafkaChannel类定义，
kafka相关参数的默认值在org.apache.kafka.clients.CommonClientConfigs包中的KafkaChannel-Configuration中。
Kafka的通用配置参数在配置文件中都以“kafka.”为前缀，针对Producer或者Consumer的相关配置以“kafka.producer. ”或者“kafka.consumer. ”为前缀，
源码 KafkaChannelConfiguration 中相关默认配置参数定义如下：

```properties
KAFKA_PREFIX = "kafka.";
KAFKA_CONSUMER_PREFIX = KAFKA_PREFIX + "consumer.";
KAFKA_PRODUCER_PREFIX = KAFKA_PREFIX + "producer.";
DEFAULT_ACKS = "all";
DEFAULT_KEY_SERIALIZER ="org.apache.kafka.common.serialization.StringSerializer";
DEFAULT_VALUE_SERIAIZER ="org.apache.kafka.common.serialization.ByteArraySerializer";
DEFAULT_KEY_DESERIALIZER ="org.apache.kafka.common.serialization.StringDeserializer";
DEFAULT_VALUE_DESERIAIZER ="org.apache.kafka.common.serialization.ByteArrayDeserializer";
TOPIC_CONFIG = KAFKA_PREFIX + "topic";
BOOTSTRAP_SERVERS_CONFIG =KAFKA_PREFIX + CommonClientConfigs.BOOTSTRAP_SERVERS_CONFIG;
DEFAULT_TOPIC = "flume-channel";
DEFAULT_GROUP_ID = "flume";
POLL_TIMEOUT = KAFKA_PREFIX + "pollTimeout";
DEFAULT_POLL_TIMEOUT = 500;
KEY_HEADER = "key";
DEFAULT_AUTO_OFFSET_RESET = "earliest";
PARSE_AS_FLUME_EVENT = "parseAsFlumeEvent";
DEFAULT_PARSE_AS_FLUME_EVENT = true;
PARTITION_HEADER_NAME = "partitionIdHeader";
STATIC_PARTITION_CONF = "defaultPartitionId";
MIGRATE_ZOOKEEPER_OFFSETS = "migrateZookeeperOffsets";
public static final boolean DEFAULT_MIGRATE_ZOOKEEPER_OFFSETS = true;/＊＊＊ Flume1.7以前版本默认参数＊＊＊＊/
BROKER_LIST_KEY = "metadata.broker.list";
REQUIRED_ACKS_KEY = "request.required.acks";
BROKER_LIST_FLUME_KEY = "brokerList";
//TOPIC = "topic";
GROUP_ID_FLUME = "groupId";
AUTO_COMMIT_ENABLED = "auto.commit.enable";
ZOOKEEPER_CONNECT = "zookeeper.connect";
ZOOKEEPER_CONNECT_FLUME_KEY = "zookeeperConnect";
TIMEOUT = "timeout";
DEFAULT_TIMEOUT = "100";
CONSUMER_TIMEOUT = "consumer.timeout.ms";
READ_SMALLEST_OFFSET = "readSmallestOffset";
DEFAULT_READ_SMALLEST_OFFSET = false;
```

#### ② 简单模板

```properties
# 命名 Agent 上的组件
agent_name.channels = channel_name
agent_name.sinks = sink_name

# channel
agent_name.channels.channel_name.type = org.apache.flume.channel.kafka.KafkaChannel
agent_name.channels.channel_name.kafka.bootstrap.servers = zkServer01:9092, zkServer02:9092 
agent_name.channels.channel_name.kafka.topic = test_channel
agent_name.channels.channel_name.kafka.consumer.group.id = test-consumer

# sink
agent_name.sinks.sink_name.type = hdfs
XXX
XXX

# source | channel | sink 关联
agent_name.sources.source_name.channels = channel_name
agent_name.sinks.sink_name.channel = channel_name
```

说明：agent_name 没有配置Source，只配置了Channel和Sink，使用的Channel类型为Kafka Channel，主题名称为“test_channel”, consumer组id为“test-consumer”, Sink类型为 hdfs 滚动生成文件，对接的Channel为KafkaChannel channel_name。