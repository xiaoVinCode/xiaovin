---
# 这是文章的标题
title: 01_Flume之介绍入门
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

## 1. 概述

Flume是一个高可靠、高可用、分布式的用于不同数据源的流式数据采集、收集、聚合系统。flume最简单的数据流模型如下图所示。

Flume是Cloudera提供的一个高可靠、高可用、分布式的用于不同数据源的流式数据采集、收集、聚合系统。

Flume支持在日志系统中定制各类数据发送方，用于收集数据；同时，Flume提供对数据进行简单处理，并写到各种数据接收方（可定制）的能力，一般的采集需求，通过对flume的简单配置即可实现。针对特殊场景也具备良好的自定义扩展能力。因此，flume可以适用于大部分的日常数据采集场景。。

Agent就是一个Java进程，它接收来自外部的数据，并将数据传递到数据中心（如HDFS、HBase等）或下一个Agent。一个Agent有Source、Channel、Sink三大组件组成，通过配置文件可以将组件连接在一起从而形成数据流。

Flume的核心是把数据从数据源(source)收集过来，再将收集到的数据送到指定的目的地(sink)。为了保证输送的过程一定成功，在送到目的地(sink)之前，会先缓存数据(channel), 待数据真正到达目的地(sink)后，flume在删除自己缓存的数据。

当前Flume有两个版本。Flume 0.9X版本的统称Flume OG（original generation），Flume1.X版本的统称Flume NG（next generation）。由于Flume NG经过核心组件、核心配置以及代码架构重构，与Flume OG有很大不同，使用时请注意区分。改动的另一原因是将Flume纳入 apache 旗下，Cloudera Flume 改名为 Apache Flume。

## 2. 基本概念

Client：Client生产数据，运行在一个独立的线程。

Event： 一个数据单元，消息头和消息体组成。（Events可以是日志记录、 avro 对象等。）

Flow： Event从源点到达目的点的迁移的抽象。

Agent： 一个独立的Flume进程，包含组件Source、 Channel、 Sink。（Agent使用JVM 运行Flume。每台机器运行一个agent，但是可以在一个agent中包含多个sources和sinks。）

Source： 数据收集组件。（source从Client收集数据，传递给Channel）

Channel： 中转Event的一个临时存储，保存由Source组件传递过来的Event。（Channel连接 sources 和 sinks ，这个有点像一个队列。）

Sink： 从Channel中读取并移除Event， 将Event传递到FlowPipeline中的下一个Agent（如果有的话）（Sink从Channel收集数据，运行在一个独立线程。）

## 3. 运行机制

Flume系统中核心的角色是**agent**，agent本身是一个Java进程，一般运行在日志收集节点。

![img](https://static-resource-yang.oss-cn-shenzhen.aliyuncs.com/typora_pic/202304151105476.jpeg)

每一个agent相当于一个数据传递员，内部有三个组件：

**Source**：采集源，用于跟数据源对接，以获取数据；

**Sink**：下沉地，采集数据的传送目的，用于往下一级agent传递数据或者往最终存储系统传递数据；

**Channel**：agent内部的数据传输通道，用于从source将数据传递到sink；

在整个数据的传输的过程中，流动的是**event**，它是Flume内部数据传输的最基本单元。event将传输的数据进行封装。如果是文本文件，通常是一行记录，event也是事务的基本单位。event从source，流向channel，再到sink，本身为一个字节数组，并可携带headers(头信息)信息。event代表着一个数据的最小完整单元，从外部数据源来，向外部的目的地去。

Event是Flume数据流传输过程中的一个基本单位，由一个可选的header(键值对)和body组成。header主要用于表示数据属性及路由信息，body部分存储的是byte数组，用于表示数据本身。Event也是事务的基本单位。

## 4. Flume采集系统结构图

### 4.1 简单结构

单个agent采集数据

![image-20230415112317174](https://static-resource-yang.oss-cn-shenzhen.aliyuncs.com/typora_pic/202304151123197.png)

### 4.2 复杂结构

多级agent之间串联

![image-20230415112346336](https://static-resource-yang.oss-cn-shenzhen.aliyuncs.com/typora_pic/202304151123368.png)

## 5. 安装启动

### 5.1 安装包下载安装

- [地址](https://links.jianshu.com/go?to=http%3A%2F%2Farchive.apache.org%2Fdist%2Fflume%2F)：[http://archive.apache.org/dist/flume/](https://links.jianshu.com/go?to=http%3A%2F%2Farchive.apache.org%2Fdist%2Fflume%2F)
- 解压

```bash
[kevin@hadoop112 software]$ tar -zxvf apache-flume-1.9.0-bin.tar.gz -C /opt/module/
```

- 改名

```bash
[kevin@hadoop112 software]$ cd /opt/module/
[kevin@hadoop112 module]$ mv apache-flume-1.9.0-bin flume-1.9.0
```

- 配置

```bash
[kevin@hadoop112 module]$ cd flume-1.9.0/conf/
[kevin@hadoop112 conf]$ mv flume-env.sh.template flume-env.sh
[kevin@hadoop112 conf]$ vim flume-env.sh

export JAVA_HOME=/opt/module/jdk1.8.0_241
# 优化项
export JAVA_OPTS="-Xms1024m -Xmx3072m -Dcom.sun.management.jmxremote"
```

### 5.2 测试--监控端口数据官方案例

- 安装 netcat 工具

```bash
[kevin@hadoop112 flume-1.9.0]$ sudo yum install -y nc
```

- 判断 44444 端口是否被占用

```bash
 [kevin@hadoop112 flume-1.9.0]$ sudo netstat -tunlp | grep 44444
```

- 创建 Flume Agent 配置文件 flume-netcat-logger.conf

```bash
[kevin@hadoop112 flume-1.9.0]$ mkdir jobs
[kevin@hadoop112 flume-1.9.0]$ cd jobs/
[kevin@hadoop112 jobs]$ touch flume-netcat-logger.conf
[kevin@hadoop112 jobs]$ vim flume-netcat-logger.conf
```

- 在 flume-netcat-logger.conf 文件中添加如下内容。

```properties
# Name the components on this agent
a1.sources = r1
a1.sinks = k1
a1.channels = c1

# Describe/configure the source
a1.sources.r1.type = netcat
a1.sources.r1.bind = localhost
a1.sources.r1.port = 44444

# Describe the sink
a1.sinks.k1.type = logger

# Use a channel which buffers events in memory
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 100

# Bind the source and sink to the channel
a1.sources.r1.channels = c1
a1.sinks.k1.channel = c1
```

- 先开启 flume 监听端口

```bash
[kevin@hadoop112 flume-1.9.0]$ bin/flume-ng agent -c conf/ -n a1 -f jobs/flume-netcat-logger.conf -Dflume.root.logger=INFO,console
```

这里成了阻塞进程

> 参数说明：
>
> --conf/-c：表示配置文件存储在 conf/目录
>
> --name/-n：表示给 agent 起名为 a1
>
> --conf-file/-f：flume 本次启动读取的配置文件是在 job 文件夹下的 flume-telnet.conf
>
> 文件。
>
> -Dflume.root.logger=INFO,console ：-D 表示 flume 运行时动态修改 flume.root.logger
>
> 参数属性值，并将控制台日志打印级别设置为 INFO 级别。日志级别包括:log、info、warn、
>
> error。

- 另开一个会话，使用 netcat 工具向本机的 44444 端口发送内容

```shell
[kevin@hadoop112 ~]$ nc localhost 44444

# 然后在这个会话随便输入一些内容，回车，回看上面的阻塞进程是否接收到这里所输入的内容
```

- 退出 Ctrl + C



## 6. 其它笔记：

[Flume的学习笔记_flume checkpoint_白居不易.的博客-CSDN博客](https://blog.csdn.net/weixin_45866849/article/details/125729411)
