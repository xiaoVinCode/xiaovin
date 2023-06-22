---
# 这是文章的标题
title: 13_监控
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


#### 1.  介绍

Flume自带的有两种监控方式, http监控和ganglia监控，用户还可以实现自定义的监控。

#### 2. Http监控

使用这种监控方式，只需要在启动flume的时候在启动参数上面加上监控配置，例如：

```plain
bin/flume-ng agent --conf conf --conf-file conf/flume_conf.properties --name a1 -Dflume.monitoring.type=http -Dflume.monitoring.port=34545
```

其中-Dflume.monitoring.type=http表示使用http方式来监控，后面的-Dflume.monitoring.port=34545表示我们需要启动的监控服务的端口号为1234，这个端口号可以自己随意配置。启动flume之后，通过http://ip:1234/metrics就可以得到flume的一个json格式的监控数据。

##### 1. 返回结果示例 :

```json
{
    "CHANNEL.memoryChannel": {
        "ChannelCapacity": "550000",
        "ChannelFillPercentage": "0.18181818181818182",
        "Type": "CHANNEL",
        "ChannelSize": "1000",
        "EventTakeSuccessCount": "33541400",
        "EventTakeAttemptCount": "33541527",
        "StartTime": "1536572886273",
        "EventPutAttemptCount": "33542500",
        "EventPutSuccessCount": "33542500",
        "StopTime": "0"
    },
    "SINK.hdfsSink": {
        "ConnectionCreatedCount": "649",
        "ConnectionClosedCount": "648",
        "Type": "SINK",
        "BatchCompleteCount": "335414",
        "BatchEmptyCount": "27",
        "EventDrainAttemptCount": "33541500",
        "StartTime": "1536572886275",
        "EventDrainSuccessCount": "33541400",
        "BatchUnderflowCount": "0",
        "StopTime": "0",
        "ConnectionFailedCount": "0"
    },
    "SOURCE.avroSource": {
        "EventReceivedCount": "33542500",
        "AppendBatchAcceptedCount": "335425",
        "Type": "SOURCE",
        "EventAcceptedCount": "33542500",
        "AppendReceivedCount": "0",
        "StartTime": "1536572886465",
        "AppendAcceptedCount": "0",
        "OpenConnectionCount": "3",
        "AppendBatchReceivedCount": "335425",
        "StopTime": "0"
    }
}
```

##### 2. 参数定义:

| 字段名称                        | 含义                             | 备注 |
| :------------------------------ | :------------------------------- | :--- |
| SOURCE.OpenConnectionCount      | 打开的连接数                     |      |
| SOURCE.TYPE                     | 组件类型                         |      |
| SOURCE.AppendBatchAcceptedCount | 追加到channel中的批数量          |      |
| SOURCE.AppendBatchReceivedCount | source端刚刚追加的批数量         |      |
| SOURCE.EventAcceptedCount       | 成功放入channel的event数量       |      |
| SOURCE.AppendReceivedCount      | source追加目前收到的数量         |      |
| SOURCE.StartTime(StopTIme)      | 组件开始时间、结束时间           |      |
| SOURCE.EventReceivedCount       | source端成功收到的event数量      |      |
| SOURCE.AppendAcceptedCount      | source追加目前放入channel的数量  |      |
| CHANNEL.EventPutSuccessCount    | 成功放入channel的event数量       |      |
| CHANNEL.ChannelFillPercentage   | 通道使用比例                     |      |
| CHANNEL.EventPutAttemptCount    | 尝试放入将event放入channel的次数 |      |
| CHANNEL.ChannelSize             | 目前在channel中的event数量       |      |
| CHANNEL.EventTakeSuccessCount   | 从channel中成功取走的event数量   |      |
| CHANNEL.ChannelCapacity         | 通道容量                         |      |
| CHANNEL.EventTakeAttemptCount   | 尝试从channel中取走event的次数   |      |
| SINK.BatchCompleteCount         | 完成的批数量                     |      |
| SINK.ConnectionFailedCount      | 连接失败数                       |      |
| SINK.EventDrainAttemptCount     | 尝试提交的event数量              |      |
| SINK.ConnectionCreatedCount     | 创建连接数                       |      |
| SINK.Type                       | 组件类型                         |      |
| SINK.BatchEmptyCount            | 批量取空的数量                   |      |
| SINK.ConnectionClosedCount      | 关闭连接数量                     |      |
| SINK.EventDrainSuccessCount     | 成功发送event的数量              |      |
| SINK.BatchUnderflowCount        | 正处于批量处理的batch数          |      |

> 存在问题，每个任务需要占用一个端口，且需要不停调用端口获取json格式数据。

#### 3. ganglia监控

这种监控方式需要先安装ganglia然后启动ganglia，然后再启动flume的时候加上监控配置，例如：

```bash
bin/flume-ng agent --conf conf --conf-file conf/producer.properties --name a1 -Dflume.monitoring.type=ganglia -Dflume.monitoring.hosts=ip:port
```

其中-Dflume.monitoring.type=ganglia表示使用ganglia的方式来监控，而-Dflume.monitoring.hosts=ip:port表示ganglia安装的ip和启动的端口号。ganglia监控是用界面的方式展示数据，相对比较直观。

![img](https://static-resource-yang.oss-cn-shenzhen.aliyuncs.com/typora_pic/202304102205407.png)

> 首先安装ganglia. 参考地址 [https://blog.csdn.net/yljphp/article/details/90347486](https://blog.csdn.net/yljphp/article/details/90347486)

#### 4. 自定义

采取自定义方式进行监控数据采集，flume支持自定义方式采集[metrics](http://localhost:12345/metrics)信息，可重写flume采集监控部分，将实时监控数据直接发送到自定义数据库（mysql或时序数据库）内，然后根据项目实际需求自定义开发监控组件。



### 监控实现原理

flume启动时会初始化一个jettyServer来提供监控数据的访问服务，把相关的监控指标通过HTTP以JSON形式报告metrics，这些监控数据是用JMX的方式得到的, 通过一个Map<key, AtomicLong>来实现metric的计量。

flume关于监控组件的源码在flume-ng-core中的org.apache.flume.instrumentation包下面，所有的监控组件都会继承MonitoredCounterGroup类并实现xxxCounterMBean接口。MonitoredCounterGroup中定义了一些基本公有的监控属性，xxxCounterMBean定义了获取监控元素的方法接口，具体实现在监控组件xxxCounter中实现，flume自带的监控组件有SourceCounter、SinkCounter、ChannelProcessCounter。监控数据流向为：

![img](https://static-resource-yang.oss-cn-shenzhen.aliyuncs.com/typora_pic/202304102204138.png)

以ThriftSource为例，与监控相关的有SourceCounter、SourceCounterMBean、MonitoredCounterGroup。其中SourceCounter和MonitoredCounterGroup中定义了要监控的元素，SourceCounterMBean中定义了获取元素的方法。SouceCounter获取监控数据的过程为：

1. 启动ThriftSource时初始化一个SourceCounter并启动。
2. 在接收到Event时，调用incrementEventReceivedCount方法，记录event个数；在event处理完成时，调用incrementEventAcceptedCount记录event处理成功的个数。其他计数方式类似。
3. 停止ThriftSource时停止SourceCounter.

如果是自定义监控组件，只需要添加xxxCounter、xxxCounterMBean，以及自定义的xxx组件（source、channel、sink），这里需要注意命名规范的问题，需要严格按照上面的命令规范JMX才能正常识别。galaxy-tunnel中自定义了StatisticsCounter和StatisticsCounterMBean，用于统计各个topic在一个周期内（可配置，目前是1分钟）的Event数量和字节数。

参考源码分析：https://blog.csdn.net/u010670689/article/details/78354681