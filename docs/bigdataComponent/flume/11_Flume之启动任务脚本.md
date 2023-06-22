---
# 这是文章的标题
title: 11_启动任务脚本
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


#### 1. 介绍

- 将Flume客户端和真正任务配置的文件夹隔离开
- 通过启动命令指定每个任务的执行日志
- 真正任务配置中的可变参数 均采用传参使用，用于生产开发测试不同环境的不同参数

#### 2. 例子

1. 配置

flume_job_site_conf.properties

```properties
# Kafka 连接地址
kafkaCluster=192.168.xx.x1:9092,192.168.xx.x2:9092,192.168.xx.x3:9092
kafkaCluster_acl=192.168.xx.x1:9092,192.168.xx.x2:9092,192.168.xx.x3:9092
# Kafka SASL加密的账号密码
kfk_user=flume
kfk_pwd=123456
# Flume 服务端IP
flumeServerIP1=192.168.xx.x1
flumeServerIP2=192.168.xx.x1
# HDFS 集群名称
hadoopClusterName=mycluster
hdfsFileSuffix=1
```

2. 父脚本

flume_common.sh

```bash
#!/bin/bash
source /etc/profile

usage="Usage: ./***.sh ( start | stop | status )"

# if no args specified, show usage
if [ $# -eq 0 ]; then
    echo $usage
    exit 1
fi

# Agent 名称
agentName=$2
# Flume 任务配置路径
jobLocation=$3
# 任务日志以及Channel路径
logDir=$4
# 监控端口
monitoringPort=$5

# Flume 客户端路径
flumeClient="${FLUME_HOME}"
# Flume任务相关的连接参数
file="${FLUME_JOB_OEM_CONFIG_PATH}/resources_site/flume_job_site_conf.properties"

if [ ! -f "$file" ]; then
    echo "$file not found."
    exit 1
fi
while IFS='=' read -r key value
do
    key=$(echo $key | tr '.' '_')
    eval ${key}=\${value}
done < "$file"

# Kafka 连接地址
kafkaCluster="${kafkaCluster}"
kafkaCluster_acl="${kafkaCluster_acl}"
kfk_user="${kfk_user}"
kfk_pwd="${kfk_pwd}"
hadoopClusterName="${hadoopClusterName}"
hdfsFileSuffix="${hdfsFileSuffix}"
bdCollectPath="${bdCollectPath}"
bdOEMCollectPath="${bdOEMCollectPath}"

# 参数说明：
# --conf/-c：表示配置文件存储在 conf/目录
# --name/-n：表示给 agent 起名为 a1
# --conf-file/-f：表示任务文件的位置
# -D ：表示 flume 运行时动态修改配置文件
#   -Dflume.root.logger=INFO,console ：动态修改log4j.properties中设置了日志打印级别以及位置
#   -Dflume.log.dir ：动态修改log4j.properties中设置了日志文件存放位置
# {
#   propertiesImplementation=org.apache.flume.node.EnvVarResolverProperties 固定的，
#   是为了将 exec_log_path=$logDir 传进 jobName 文件中使用
#   exec_log_path=$logDir 这个必须写在前面
# }

case $1 in
"start"){
    echo "=================       Agent名为 ${agentName} 的Flume 开始采集       ==============="
    exec_log_path=${logDir} bdCollectPath=${bdCollectPath} bdOEMCollectPath=${bdOEMCollectPath} kafkaCluster=${kafkaCluster} kafkaCluster_acl=${kafkaCluster_acl} kfk_user=${kfk_user} kfk_pwd=${kfk_pwd} hadoopClusterName=${hadoopClusterName} hdfsFileSuffix=${hdfsFileSuffix} nohup ${flumeClient}/bin/flume-ng agent -n ${agentName} -c ${flumeClient}/conf/ -f ${jobLocation} -Dflume.log.dir=${logDir} -Dflume.monitoring.type=http -Dflume.monitoring.port=${monitoringPort} -DpropertiesImplementation=org.apache.flume.node.EnvVarResolverProperties > ${logDir}/run.log 2>&1 &
};;

"stop"){
    echo "=================       Agent名为 ${agentName} 的Flume 停止采集       ==============="
    ps -ef | grep ${jobLocation} | grep -v grep | grep -v "flume_common.sh" | awk '{print $2}' | xargs kill -15
};;

"status"){
  echo "=================       查询 Agent名为 ${agentName} 的Flume 进程       ==============="
  echo `ps -ef | grep ${jobLocation} | grep -v grep | grep -v "flume_common.sh"`
};;

*){
    echo ${usage}
};;
esac
```

3. 启动任务的脚本

flume_app_info_to_hdfs.sh

```bash
#!/bin/bash
source /etc/profile

usage="Usage: ./***.sh ( start | stop | status )"

# if no args specified, show usage
if [ $# -eq 0 ]; then
    echo $usage
    exit 1
fi

# 监控端口
monitoringPort=34551
# Agent 名称
agentName="a_app_info_to_hdfs"
# Flume 任务配置路径
jobLocation="${FLUME_JOB_OEM_CONFIG_PATH}/kafka_to_hdfs/flume_app_info_to_hdfs/flume_app_info_to_hdfs.conf"
# 任务日志以及Channel路径
logDir="${FLUME_JOB_OEM_CONFIG_PATH}/log_channel_datas/${agentName}"

sh ${FLUME_JOB_OEM_CONFIG_PATH}/resources_site/flume_common.sh $1 ${agentName} ${jobLocation} ${logDir} ${monitoringPort}
```
