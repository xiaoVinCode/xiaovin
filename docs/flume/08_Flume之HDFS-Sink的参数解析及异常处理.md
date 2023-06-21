## 一、配置详解

| 序号 | 参数名                 | 默认值             | 描述                                                         |
| ---- | ---------------------- | ------------------ | ------------------------------------------------------------ |
| 1    | type                   | Sink类型为hdfs     | -                                                            |
| 2    | hdfs.path              | -                  | HDFS存储路径，支持按照时间分区。集群的NameNode名字：单节点：hdfs://主机名(ip):9000/%Y/%m/%d/%H；HA集群：hdfs://nameservice(高可用NameNode服务名称)/%Y/%m/%d/%H |
| 3    | hdfs.filePrefix        | FlumeData          | Event输出到HDFS的文件名前缀                                  |
| 4    | hdfs.fileSuffix        | -                  | Event输出到HDFS的文件名后缀                                  |
| 5    | hdfs.inUsePrefix       | -                  | 临时文件的文件名前缀。Flume首先将Event输出到HDFS指定目录的临时文件中，再根据相关规则重命名为目标文件 |
| 6    | hdfs.inUseSuffix       | .tmp               | 临时文件名后缀。                                             |
| 7    | hdfs.rollInterval      | 30                 | 间隔多久将临时文件滚动成最终目标文件，单位：秒。如果设置为0，则表示不根据时间滚动文件。注：滚动(roll)指的是，HDFS Sink将临时文件重命名成最终目标文件，并新打开一个临时文件来写数据 |
| 8    | hdfs.rollSize          | 1024               | 当临时文件达到该大小时，滚动成目标文件，单位：byte。该值设置为0，则表示文件不根据文件大小滚动生成 |
| 9    | hdfs.rollCount         | 10                 | 当Event数据达到该数量时，将临时文件滚动生成目标文件。该值设置为0，则表示文件不根据Event数滚动生成 |
| 10   | hdfs.idleTimeout       | 0                  | 当目前被打开的临时文件在该参数指定的时间内，没有任何数据写入，则将该临时文件关闭并重命名成目标文件，单位：秒。该值设置为0，则表示禁用此功能，不自动关闭临时文件 |
| 11   | hdfs.round             | false              | 用于HDFS文件按照时间分区，时间戳向下取整                     |
| 12   | hdfs.roundValue        | 1                  | 当round设置为true，配合roundUnit时间单位一起使用，例如roundUnit值为minute。该值设置为1则表示一分钟之内的数据写到一个文件中，相当于每一分钟生成一个文件 |
| 13   | hdfs.roundUnit         | second             | 按时间分区使用的时间单位，可以选择second（秒）、minute（分钟）、hour（小时）三种粒度的时间单位。示例：a1.sinks.k1.hdfs.path = hdfs://nameservice/flume/events/%y/%m/%d/%H/%M；a1.sinks.k1.hdfs.round = true；a1.sinks.k1.hdfs.roundValue = 10；a1.sinks.k1.hdfs.roundUnit = minute；当时间为2022-04-05 17:38:59时候，hdfs.path依然会被解析为：/flume/events/2022/04/05/17/30；因为设置的是舍弃10分钟内的时间，因此，该目录每10分钟新生成一个 |
| 14   | hdfs.batchSize         | 100                | 每个批次刷写到HDFS的Event数量                                |
| 15   | hdfs.codeC             | 不采用压缩         | 文件压缩格式，目前支持的压缩格式有gzip、bzip2、lzo、lzop、snappy |
| 16   | hdfs.fileType          | SequenceFile       | 文件类型，包括：SequenceFile、DataStream、CompressedStream。该值设置为DataStream，则输出的文件不会进行压缩，不需要设置hdfs.codeC指定压缩格式。该值设置为CompressedStream，则对输出的文件进行压缩，需要设置hdfs.codeC指定压缩格式 |
| 17   | hdfs.maxOpenFiles      | 5000               | 最大允许打开的HDFS文件数，当打开的文件数达到该值，则最早打开的文件将会被关闭 |
| 18   | hdfs.minBlockReplicas  | HDFS副本数         | 写入HDFS文件块的最小副本数。该参数会影响文件的滚动配置，一般将该参数配置成1，才可以按照配置正确滚动文件 |
| 19   | hdfs.writeFormat       | Writable           | 文件的格式，目前可以选择Text或者Writable两种格式             |
| 20   | hdfs.callTimeout       | 10000              | 操作HDFS文件的超时时间，如果需要写入HDFS文件的Event数比较大或者发生了打开、写入、刷新、关闭文件超时的问题，可以根据实际情况适当增大超时时间，单位：毫秒 |
| 21   | hdfs.threadsPoolSize   | 10                 | 每个HDFS Sink执行HDFS IO操作打开的线程数                     |
| 22   | hdfs.rollTimerPoolSize | 1                  | HDFS Sink根据时间滚动生成文件时启动的线程数                  |
| 23   | hdfs.timeZone          | Local Time本地时间 | 写入HDFS文件使用的时区                                       |
| 24   | hdfs.useLocalTimeStamp | false              | 是否使用本地时间替换Event头信息中的时间戳                    |
| 25   | hdfs.closeTries        | 0                  | 在发起关闭尝试后，尝试重命名临时文件的次数。如果设置为1，表示重命名一次失败后不再继续尝试重命名操作，此时待处理的文件将处于打开状态，扩展名为．tmp。如果设置为0，表示尝试重命名操作次数不受限制，直到文件最终被重命名成功。如果close调用失败，文件可能仍然会处于打开状态，但是文件中的数据将保持完整，文件会在Flume重启后关闭 |
| 26   | hdfs.retryInterval     | 180 秒             | 连续尝试关闭文件的时间间隔。如果设置为0或小于0的数，第一次尝试关闭文件失败后将不会继续尝试关闭文件，文件将保持打开状态或者以“.tmp”扩展名结尾的临时文件。如果设置为0，表示不尝试，相当于于将hdfs.closeTries设置成1 |
| 27   | serializer             | TEXT               | 序列化方式，可选值有TEXT、avro_event或者实现EventSerializer.Builder接口的类 |
| 28   | kerberosPrincipal      | -                  | HDFS安全认证kerberos配置                                     |
| 29   | kerberosKeytab         | -                  | HDFS安全认证kerberos配置                                     |
| 30   | proxyUser              | -                  | 代理用户                                                     |

> ### round 与 rollInterval 理解有误
>
>  round、roundValue、roundUnit是基于路径path去滚动生成文件夹的，针对文件夹而言
>
>  rollInterval、rollSize、rollCount是基于文件的条件限制滚动生成文件的，基于文件而言的

## 二、简单模板

```properties
agent_name.sources = source_name
agent_name.channels = channel_name
agent_name.sinks = sink_name

# source
agent_name.sources.source_name.type = avro
XXX
XXX

# channel
agent_name.channels.channel_name.type = file
XXX
XXX

# sink
agent_name.sinks.sink_name.type = hdfs
agent_name.sinks.sink_name.hdfs.path = hdfs://${HA_NameNode_Name}/flume_data/yr=%Y/mon=%m/day=%d/hr=%H
agent_name.sinks.sink_name.hdfs.writeFormat = Text
agent_name.sinks.sink_name.hdfs.fileSuffix = _${hdfsFileSuffix}.log
agent_name.sinks.sink_name.hdfs.fileType = DataStream
agent_name.sinks.sink_name.hdfs.filePrefix = %Y%m%d%H%M
agent_name.sinks.sink_name.hdfs.useLocalTimeStamp = true
agent_name.sinks.sink_name.hdfs.rollInterval = 0
agent_name.sinks.sink_name.hdfs.rollSize = 125829120
agent_name.sinks.sink_name.hdfs.rollCount = 0
agent_name.sinks.sink_name.hdfs.minBlockReplicas = 1
agent_name.sinks.sink_name.hdfs.round = true
agent_name.sinks.sink_name.hdfs.roundValue = 1
agent_name.sinks.sink_name.hdfs.roundUnit = hour
agent_name.sinks.sink_name.hdfs.idleTimeout = 600

# source | channel | sink 关联
agent_name.sources.source_name.channels = channel_name
agent_name.sinks.sink_name.channel = channel_name
```

## 三、注意事项及异常

1. idleTimeout 的设置

   - 设置为0，如果flume程序突然宕机，就会导致 hdfs上的 .tmp后缀的文件无法会更改为完成的文件，造成一种假象，以为该文件正在写入。当程序重启时，就会有两个 .tmp文件。

   - 如果idle Timeout有设置值m，当在m秒内没有数据写入，就会把tmp文件改为已完成。后面再有数据过来的时候重新生成.tmp文件。

   - 建议：最好设置一个比较大的值，防止小文件产生，若不设置，宕机的话会有tmp文件

   - 为了能快速查看到数据，可以设置该值较小，没数据进行就滚动，因为临时文件是不能被Hive查询到，但是这样会产生小文件

     

2. round 与 rollInterval 理解有误

   - round、roundValue、roundUnit是基于路径path去滚动生成文件夹的，针对文件夹而言

   - rollInterval、rollSize、rollCount是基于文件的条件限制滚动生成文件的，基于文件而言的



3. 异常：Error while trying to hflushOrSync
   - 问题排查：通过查看不同Flume的Agent日志发现，同名的文件被不同的Flume Agent打开，在文件第二次打开后，先前打开的Agent拥有的token就失效了，因此无法关闭它，就会不断的报错：Error while trying to hflushOrSync!
   - 查看之前的flume配置文件发现，每一个Flume-Agent配置的hdfsSink是完全一样的，每个Flume-Agent读取的source相同，有很大概率会出现多个Fume-Agent同时写同名文件，导致部分Flume-Agent无法继续。
   - 解决方案：不同Flume设置不同的文件后缀名

#### 其它重要点：

1. ##### Flume部署的机器上没有Hadoop环境依赖：

   为了让Flume能够正常地和HDFS进行交互，需要手动添加Hadoop相关的jar包到Flume的classpath中。常见的Hadoop相关的jar包如下：

   - hadoop-common.jar
   - hadoop-hdfs.jar
   - hadoop-auth.jar
   - hadoop-mapreduce-client-core.jar
   - commons-configuration.jar
   - commons-lang.jar
   - commons-collections.jar

   具体来说，如果你使用的是*Hadoop*2.*x*版本，那么在HADOOP_HOME目录下应该有以下目录：

   - $HADOOP_HOME/share/hadoop/common
   - $HADOOP_HOME/share/hadoop/hdfs
   - $HADOOP_HOME/share/hadoop/mapreduce

   你可以将上述目录中的对应jar包复制到Flume的lib目录下，即$FLUME_HOME/lib目录下。

   需要注意的是，这些jar包的版本要和你的Hadoop集群的版本保持一致，否则可能会出现不兼容等问题。建议在添加前先确认好版本信息。

   

2. ##### Hadoop的NameNode是高可用：

- 将Hadoop集群的core-site.xml和hdfs-site.xml文件复制到Flume服务器上的某个目录（/path/to/hadoop/conf）中

  - ```bash
    bin/flume-ng agent --conf-file conf/flume.conf --name a1 -Dhadoop.conf.dir=/path/to/hadoop/conf
    ```

- 在启动Flume时，也可以使用"-conf"参数指定core-site.xml和hdfs-site.xml文件的路径，如下所示：

  - ```bash
    bin/flume-ng agent --conf-file conf/flume.conf --name a1 -conf /path/to/hadoop/conf/core-site.xml -conf /path/to/hadoop/conf/hdfs-site.xml
    ```

- 直接两个两个文件放到 Flume_HOME/conf 目录下



3. ##### 没有权限写入HDFS目录：

- 可以在启动命令中设置"-Duser.name=kevin"参数

- 需要注意的是，kevin用户需要在HDFS上拥有写入目标目录的权限，否则会出现写入失败等问题。因此，在实际使用中，需要对该用户进行独立管理，并按照实际需求进行授权

```bash
./bin/flume-ng agent -n ${agentName} -c ${flumeClient}/conf/ -f ${jobLocation} -Duser.name=kevin
```

