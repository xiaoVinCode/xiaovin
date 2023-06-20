配置例子

```
# 命名 Agent 上的组件
a_app_info_to_hdfs.sources = s_app_info
a_app_info_to_hdfs.channels = c_app_info
a_app_info_to_hdfs.sinks = k_app_info
#############################################################################

# 数据采集 - Kafka To HDFS
#
# 数据源：
# 类型 = KafkaSource
# Topic = app_info_full
#
# channel：
# 类型 = file
# 记录 = ${FLUME_JOB_CONFIG_PATH}/log_channel_datas/../ app_info_dataDir | app_info_checkpointDir
#
# 数据出口：
# 类型 = HDFSSink
# HDFS Path = hdfs://${hadoopClusterName}/data/origin_data/log/app_info_full/yr=%Y/mon=%m/day=%d/hr=%H
# Hive TableName = app_info_full
# source
a_app_info_to_hdfs.sources.s_app_info.type = org.apache.flume.source.kafka.KafkaSource
a_app_info_to_hdfs.sources.s_app_info.batchSize = 5000
a_app_info_to_hdfs.sources.s_app_info.batchDurationMillis = 2000
# a_app_info_to_hdfs.sources.s_app_info.kafka.bootstrap.servers = ${kafkaCluster}
a_app_info_to_hdfs.sources.s_app_info.kafka.bootstrap.servers = ${kafkaCluster_acl}
a_app_info_to_hdfs.sources.s_app_info.kafka.consumer.security.protocol=SASL_PLAINTEXT
a_app_info_to_hdfs.sources.s_app_info.kafka.consumer.sasl.mechanism = PLAIN
a_app_info_to_hdfs.sources.s_app_info.kafka.consumer.sasl.jaas.config = org.apache.kafka.common.security.plain.PlainLoginModule required username="${kfk_user}" password="${kfk_pwd}" ;
a_app_info_to_hdfs.sources.s_app_info.kafka.topics = app_info_full
a_app_info_to_hdfs.sources.s_app_info.kafka.consumer.group.id = bigdata_flume
a_app_info_to_hdfs.sources.s_app_info.kafka.setTopicHeader = true
a_app_info_to_hdfs.sources.s_app_info.kafka.topicHeader = topic
a_app_info_to_hdfs.sources.s_app_info.interceptors = i1
a_app_info_to_hdfs.sources.s_app_info.interceptors.i1.type= xxx.xxx.xxx.flume.TimestampInterceptor$Builder

# channel
a_app_info_to_hdfs.channels.c_app_info.type = file
a_app_info_to_hdfs.channels.c_app_info.dataDirs = ${exec_log_path}/app_info_dataDir
a_app_info_to_hdfs.channels.c_app_info.checkpointDir = ${exec_log_path}/app_info_checkpointDir
a_app_info_to_hdfs.channels.c_app_info.capacity = 3000000
a_app_info_to_hdfs.channels.c_app_info.transactionCapacity = 20000
a_app_info_to_hdfs.channels.c_app_info.keep-alive = 5

# sink
a_app_info_to_hdfs.sinks.k_app_info.type = hdfs
a_app_info_to_hdfs.sinks.k_app_info.hdfs.path = hdfs://${hadoopClusterName}/data/origin_data/log/%{topic}/yr=%Y/mon=%m/day=%d/hr=%H
a_app_info_to_hdfs.sinks.k_app_info.hdfs.fileSuffix = _${hdfsFileSuffix}.gz
a_app_info_to_hdfs.sinks.k_app_info.hdfs.filePrefix = log_%Y%m%d%H%M
a_app_info_to_hdfs.sinks.k_app_info.hdfs.rollInterval = 0
a_app_info_to_hdfs.sinks.k_app_info.hdfs.rollSize = 125829120
a_app_info_to_hdfs.sinks.k_app_info.hdfs.rollCount = 0
a_app_info_to_hdfs.sinks.k_app_info.hdfs.minBlockReplicas = 1
a_app_info_to_hdfs.sinks.k_app_info.hdfs.round = true
a_app_info_to_hdfs.sinks.k_app_info.hdfs.roundValue = 1
a_app_info_to_hdfs.sinks.k_app_info.hdfs.roundUnit = hour
a_app_info_to_hdfs.sinks.k_app_info.hdfs.idleTimeout = 600
a_app_info_to_hdfs.sinks.k_app_info.hdfs.fileType = CompressedStream
a_app_info_to_hdfs.sinks.k_app_info.hdfs.codeC = gzip
a_app_info_to_hdfs.sinks.k_app_info.hdfs.writeFormat = Text

# source | channel | sink 关联
a_app_info_to_hdfs.sources.s_app_info.channels = c_app_info
a_app_info_to_hdfs.sinks.k_app_info.channel = c_app_info
#############################################################################
```

