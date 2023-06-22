---
# 这是文章的标题
title: 10_拦截器
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

Inteceptor主要用来对event进行过滤和修改，Interceptor可以将处理结果传递给下一个Interceptor从而形成InterceptorChain。多个Interceptor在配置文件中以空格分隔，拦截器的顺序就是event处理的顺序，只有一个拦截器通过之后才会进行到下一个拦截器。Inteceptor相关源码在flume-ng-core的org.apache.flume.interceptor下。

#### 2. 官方自带

flume中自带以下几种Inteceptor，可以实现自定义的拦截器，galaxy-tunnel中实现了DataFlowDest Inteceptor，根据ChannelGroup字段选择不同的数据通道。

- Timestamp Interceptor：该拦截器会在Event Header 中插入一个key是timestamp的KV对，value的值是相关的timestamp。该拦截器可以保护相关的已经存在的timestamp。
- Host Interceptor：该拦截器会在Event Header中插入当前agent运行机器的hostname或者ip，插入KV对
- Static Interceptor：该拦截器允许用户追加静态头部在所有的Event中
- UUIDInterceptor：用于在每个events header中生成一个UUID字符串。
- Searchand Replace Interceptor：该拦截器基于Java正则表达式提供简单的基于字符串的搜索和替换功能，与Java Matcher.replaceAll（）方法中相同的规则
- RegexExtractor Interceptor：通过正则表达式来在header中添加指定的key,value则为正则匹配的部分
- Regex Filtering Interceptor：在日志采集的时候，可能有一些数据是我们不需要的，这样添加过滤拦截器，可以过滤掉不需要的日志，也可以根据需要收集满足正则条件的日志。
- Morphline Interceptor：该拦截器使用Morphline对每个events数据做相应的转换。关于Morphline的使用，可参考http://kitesdk.org/docs/current/morphlines/morphlines-reference-guide.html

#### 3. 自定义拦截器

1. 环境：Java - Maven pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>cn.com.gc</groupId>
    <artifactId>flume-custom-interceptor</artifactId>
    <version>1.11</version>

    <properties>
        <java.version>1.8</java.version>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.apache.flume</groupId>
            <artifactId>flume-ng-core</artifactId>
            <version>1.9.0</version>
            <!--  <scope>provided</scope>  -->
        </dependency>
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>fastjson</artifactId>
            <version>1.2.78</version>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.13.2</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-lang3</artifactId>
            <version>3.3.2</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.8.1</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                    <encoding>UTF-8</encoding>
                </configuration>
            </plugin>
            <!--此工具会将全部依赖打包-->
            <!--            <plugin>-->
            <!--                <groupId>org.apache.maven.plugins</groupId>-->
            <!--                <artifactId>maven-assembly-plugin</artifactId>-->
            <!--                <version>3.3.0</version>-->
            <!--                <configuration>-->
            <!--                    <descriptorRefs>-->
            <!--                        <descriptorRef>jar-with-dependencies</descriptorRef>-->
            <!--                    </descriptorRefs>-->
            <!--                    <archive>-->
            <!--                        <manifest>-->
            <!--                            &lt;!&ndash;通过mainClass标签设置成主类的全类名FQCN&ndash;&gt;-->
            <!--                            &lt;!&ndash;<mainClass></mainClass>&ndash;&gt;-->
            <!--                        </manifest>-->
            <!--                    </archive>-->
            <!--                </configuration>-->
            <!--                <executions>-->
            <!--                    <execution>-->
            <!--                        <id>make-assembly</id>-->
            <!--                        <phase>package</phase>-->
            <!--                        <goals>-->
            <!--                            <goal>single</goal>-->
            <!--                        </goals>-->
            <!--                    </execution>-->
            <!--                </executions>-->
            <!--            </plugin>-->
        </plugins>
    </build>
</project>
```

2. 将数据中的 st 转化成时间戳，写入 header中，HDFSSink使用它来确定时间分区

```java
package xxx.xxx.xxx.flume;

import xxx.xxx.xxx.flume.utils.DateUtil;
import com.alibaba.fastjson.JSONObject;
import com.google.common.collect.Lists;
import org.apache.flume.Context;
import org.apache.flume.Event;
import org.apache.flume.interceptor.Interceptor;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

/**
 * 根据 st 给Event的header信息添加时间戳
 */
public class TimestampInterceptor implements Interceptor {
    @Override
    public void initialize() {
    }

    @Override
    public Event intercept(Event event) {
        try {
            Map<String, String> headers = event.getHeaders();
            String log = new String(event.getBody(), StandardCharsets.UTF_8);
            JSONObject jsonObject = JSONObject.parseObject(log);
            String st = jsonObject.getString("st");
            // Flume HDFSSink要求单位为毫秒
            long timeStamp = DateUtil.getTimeStamp(st, "yyyy-MM-dd HH:mm:ss.SSS");
            headers.put("timestamp", String.valueOf(timeStamp));

            return event;
        } catch (Exception e) {
            e.printStackTrace();
            // TODO 异常数据抛弃。
            return null;
        }
    }

    @Override
    public List<Event> intercept(List<Event> list) {
        List<Event> intercepted = Lists.newArrayListWithCapacity(list.size());
        for (Event event : list) {
            Event interceptedEvent = intercept(event);
            if (interceptedEvent != null) {
                intercepted.add(interceptedEvent);
            }
        }
        return intercepted;
    }

    public static class Builder implements Interceptor.Builder {
        @Override
        public Interceptor build() {
            return new TimestampInterceptor();
        }

        @Override
        public void configure(Context context) {
        }
    }

    @Override
    public void close() {
    }
}
```

3. 打包上传

将打包的jar放到 ${FLUME_HOME}/lib，如果拦截器里面使用其它依赖包，可以将这些包直接打进自定义拦截器的jar中，或者将其下载也放到lib下。

4. 使用

```properties
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

