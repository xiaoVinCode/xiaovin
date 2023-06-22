import{_ as a}from"./plugin-vue_export-helper-c27b6911.js";import{o as n,c as s,f as e}from"./app-10c864ca.js";const p={},t=e(`<h2 id="配置例子" tabindex="-1"><a class="header-anchor" href="#配置例子" aria-hidden="true">#</a> 配置例子</h2><div class="language-properties line-numbers-mode" data-ext="properties"><pre class="language-properties"><code><span class="token comment"># 命名 Agent 上的组件</span>
<span class="token key attr-name">a_app_info_to_hdfs.sources</span> <span class="token punctuation">=</span> <span class="token value attr-value">s_app_info</span>
<span class="token key attr-name">a_app_info_to_hdfs.channels</span> <span class="token punctuation">=</span> <span class="token value attr-value">c_app_info</span>
<span class="token key attr-name">a_app_info_to_hdfs.sinks</span> <span class="token punctuation">=</span> <span class="token value attr-value">k_app_info</span>
<span class="token comment">#############################################################################</span>

<span class="token comment"># 数据采集 - Kafka To HDFS</span>
<span class="token comment">#</span>
<span class="token comment"># 数据源：</span>
<span class="token comment"># 类型 = KafkaSource</span>
<span class="token comment"># Topic = app_info_full</span>
<span class="token comment">#</span>
<span class="token comment"># channel：</span>
<span class="token comment"># 类型 = file</span>
<span class="token comment"># 记录 = \${FLUME_JOB_CONFIG_PATH}/log_channel_datas/../ app_info_dataDir | app_info_checkpointDir</span>
<span class="token comment">#</span>
<span class="token comment"># 数据出口：</span>
<span class="token comment"># 类型 = HDFSSink</span>
<span class="token comment"># HDFS Path = hdfs://\${hadoopClusterName}/data/origin_data/log/app_info_full/yr=%Y/mon=%m/day=%d/hr=%H</span>
<span class="token comment"># Hive TableName = app_info_full</span>
<span class="token comment"># source</span>
<span class="token key attr-name">a_app_info_to_hdfs.sources.s_app_info.type</span> <span class="token punctuation">=</span> <span class="token value attr-value">org.apache.flume.source.kafka.KafkaSource</span>
<span class="token key attr-name">a_app_info_to_hdfs.sources.s_app_info.batchSize</span> <span class="token punctuation">=</span> <span class="token value attr-value">5000</span>
<span class="token key attr-name">a_app_info_to_hdfs.sources.s_app_info.batchDurationMillis</span> <span class="token punctuation">=</span> <span class="token value attr-value">2000</span>
<span class="token comment"># a_app_info_to_hdfs.sources.s_app_info.kafka.bootstrap.servers = \${kafkaCluster}</span>
<span class="token key attr-name">a_app_info_to_hdfs.sources.s_app_info.kafka.bootstrap.servers</span> <span class="token punctuation">=</span> <span class="token value attr-value">\${kafkaCluster_acl}</span>
<span class="token key attr-name">a_app_info_to_hdfs.sources.s_app_info.kafka.consumer.security.protocol</span><span class="token punctuation">=</span><span class="token value attr-value">SASL_PLAINTEXT</span>
<span class="token key attr-name">a_app_info_to_hdfs.sources.s_app_info.kafka.consumer.sasl.mechanism</span> <span class="token punctuation">=</span> <span class="token value attr-value">PLAIN</span>
<span class="token key attr-name">a_app_info_to_hdfs.sources.s_app_info.kafka.consumer.sasl.jaas.config</span> <span class="token punctuation">=</span> <span class="token value attr-value">org.apache.kafka.common.security.plain.PlainLoginModule required username=&quot;\${kfk_user}&quot; password=&quot;\${kfk_pwd}&quot; ;</span>
<span class="token key attr-name">a_app_info_to_hdfs.sources.s_app_info.kafka.topics</span> <span class="token punctuation">=</span> <span class="token value attr-value">app_info_full</span>
<span class="token key attr-name">a_app_info_to_hdfs.sources.s_app_info.kafka.consumer.group.id</span> <span class="token punctuation">=</span> <span class="token value attr-value">bigdata_flume</span>
<span class="token key attr-name">a_app_info_to_hdfs.sources.s_app_info.kafka.setTopicHeader</span> <span class="token punctuation">=</span> <span class="token value attr-value">true</span>
<span class="token key attr-name">a_app_info_to_hdfs.sources.s_app_info.kafka.topicHeader</span> <span class="token punctuation">=</span> <span class="token value attr-value">topic</span>
<span class="token key attr-name">a_app_info_to_hdfs.sources.s_app_info.interceptors</span> <span class="token punctuation">=</span> <span class="token value attr-value">i1</span>
<span class="token key attr-name">a_app_info_to_hdfs.sources.s_app_info.interceptors.i1.type</span><span class="token punctuation">=</span> <span class="token value attr-value">xxx.xxx.xxx.flume.TimestampInterceptor$Builder</span>

<span class="token comment"># channel</span>
<span class="token key attr-name">a_app_info_to_hdfs.channels.c_app_info.type</span> <span class="token punctuation">=</span> <span class="token value attr-value">file</span>
<span class="token key attr-name">a_app_info_to_hdfs.channels.c_app_info.dataDirs</span> <span class="token punctuation">=</span> <span class="token value attr-value">\${exec_log_path}/app_info_dataDir</span>
<span class="token key attr-name">a_app_info_to_hdfs.channels.c_app_info.checkpointDir</span> <span class="token punctuation">=</span> <span class="token value attr-value">\${exec_log_path}/app_info_checkpointDir</span>
<span class="token key attr-name">a_app_info_to_hdfs.channels.c_app_info.capacity</span> <span class="token punctuation">=</span> <span class="token value attr-value">3000000</span>
<span class="token key attr-name">a_app_info_to_hdfs.channels.c_app_info.transactionCapacity</span> <span class="token punctuation">=</span> <span class="token value attr-value">20000</span>
<span class="token key attr-name">a_app_info_to_hdfs.channels.c_app_info.keep-alive</span> <span class="token punctuation">=</span> <span class="token value attr-value">5</span>

<span class="token comment"># sink</span>
<span class="token key attr-name">a_app_info_to_hdfs.sinks.k_app_info.type</span> <span class="token punctuation">=</span> <span class="token value attr-value">hdfs</span>
<span class="token key attr-name">a_app_info_to_hdfs.sinks.k_app_info.hdfs.path</span> <span class="token punctuation">=</span> <span class="token value attr-value">hdfs://\${hadoopClusterName}/data/origin_data/log/%{topic}/yr=%Y/mon=%m/day=%d/hr=%H</span>
<span class="token key attr-name">a_app_info_to_hdfs.sinks.k_app_info.hdfs.fileSuffix</span> <span class="token punctuation">=</span> <span class="token value attr-value">_\${hdfsFileSuffix}.gz</span>
<span class="token key attr-name">a_app_info_to_hdfs.sinks.k_app_info.hdfs.filePrefix</span> <span class="token punctuation">=</span> <span class="token value attr-value">log_%Y%m%d%H%M</span>
<span class="token key attr-name">a_app_info_to_hdfs.sinks.k_app_info.hdfs.rollInterval</span> <span class="token punctuation">=</span> <span class="token value attr-value">0</span>
<span class="token key attr-name">a_app_info_to_hdfs.sinks.k_app_info.hdfs.rollSize</span> <span class="token punctuation">=</span> <span class="token value attr-value">125829120</span>
<span class="token key attr-name">a_app_info_to_hdfs.sinks.k_app_info.hdfs.rollCount</span> <span class="token punctuation">=</span> <span class="token value attr-value">0</span>
<span class="token key attr-name">a_app_info_to_hdfs.sinks.k_app_info.hdfs.minBlockReplicas</span> <span class="token punctuation">=</span> <span class="token value attr-value">1</span>
<span class="token key attr-name">a_app_info_to_hdfs.sinks.k_app_info.hdfs.round</span> <span class="token punctuation">=</span> <span class="token value attr-value">true</span>
<span class="token key attr-name">a_app_info_to_hdfs.sinks.k_app_info.hdfs.roundValue</span> <span class="token punctuation">=</span> <span class="token value attr-value">1</span>
<span class="token key attr-name">a_app_info_to_hdfs.sinks.k_app_info.hdfs.roundUnit</span> <span class="token punctuation">=</span> <span class="token value attr-value">hour</span>
<span class="token key attr-name">a_app_info_to_hdfs.sinks.k_app_info.hdfs.idleTimeout</span> <span class="token punctuation">=</span> <span class="token value attr-value">600</span>
<span class="token key attr-name">a_app_info_to_hdfs.sinks.k_app_info.hdfs.fileType</span> <span class="token punctuation">=</span> <span class="token value attr-value">CompressedStream</span>
<span class="token key attr-name">a_app_info_to_hdfs.sinks.k_app_info.hdfs.codeC</span> <span class="token punctuation">=</span> <span class="token value attr-value">gzip</span>
<span class="token key attr-name">a_app_info_to_hdfs.sinks.k_app_info.hdfs.writeFormat</span> <span class="token punctuation">=</span> <span class="token value attr-value">Text</span>

<span class="token comment"># source | channel | sink 关联</span>
<span class="token key attr-name">a_app_info_to_hdfs.sources.s_app_info.channels</span> <span class="token punctuation">=</span> <span class="token value attr-value">c_app_info</span>
<span class="token key attr-name">a_app_info_to_hdfs.sinks.k_app_info.channel</span> <span class="token punctuation">=</span> <span class="token value attr-value">c_app_info</span>
<span class="token comment">#############################################################################</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2),o=[t];function i(l,c){return n(),s("div",null,o)}const r=a(p,[["render",i],["__file","12_Flume之连接ACL的Kafka.html.vue"]]);export{r as default};
