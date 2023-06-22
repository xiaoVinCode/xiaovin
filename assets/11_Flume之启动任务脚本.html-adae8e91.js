import{_ as s}from"./plugin-vue_export-helper-c27b6911.js";import{o as a,c as n,f as e}from"./app-06e284b9.js";const l={},t=e(`<h4 id="_1-介绍" tabindex="-1"><a class="header-anchor" href="#_1-介绍" aria-hidden="true">#</a> 1. 介绍</h4><ul><li>将Flume客户端和真正任务配置的文件夹隔离开</li><li>通过启动命令指定每个任务的执行日志</li><li>真正任务配置中的可变参数 均采用传参使用，用于生产开发测试不同环境的不同参数</li></ul><h4 id="_2-例子" tabindex="-1"><a class="header-anchor" href="#_2-例子" aria-hidden="true">#</a> 2. 例子</h4><ol><li>配置</li></ol><p>flume_job_site_conf.properties</p><div class="language-properties line-numbers-mode" data-ext="properties"><pre class="language-properties"><code><span class="token comment"># Kafka 连接地址</span>
<span class="token key attr-name">kafkaCluster</span><span class="token punctuation">=</span><span class="token value attr-value">192.168.xx.x1:9092,192.168.xx.x2:9092,192.168.xx.x3:9092</span>
<span class="token key attr-name">kafkaCluster_acl</span><span class="token punctuation">=</span><span class="token value attr-value">192.168.xx.x1:9092,192.168.xx.x2:9092,192.168.xx.x3:9092</span>
<span class="token comment"># Kafka SASL加密的账号密码</span>
<span class="token key attr-name">kfk_user</span><span class="token punctuation">=</span><span class="token value attr-value">flume</span>
<span class="token key attr-name">kfk_pwd</span><span class="token punctuation">=</span><span class="token value attr-value">123456</span>
<span class="token comment"># Flume 服务端IP</span>
<span class="token key attr-name">flumeServerIP1</span><span class="token punctuation">=</span><span class="token value attr-value">192.168.xx.x1</span>
<span class="token key attr-name">flumeServerIP2</span><span class="token punctuation">=</span><span class="token value attr-value">192.168.xx.x1</span>
<span class="token comment"># HDFS 集群名称</span>
<span class="token key attr-name">hadoopClusterName</span><span class="token punctuation">=</span><span class="token value attr-value">mycluster</span>
<span class="token key attr-name">hdfsFileSuffix</span><span class="token punctuation">=</span><span class="token value attr-value">1</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>父脚本</li></ol><p>flume_common.sh</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token shebang important">#!/bin/bash</span>
<span class="token builtin class-name">source</span> /etc/profile

<span class="token assign-left variable">usage</span><span class="token operator">=</span><span class="token string">&quot;Usage: ./***.sh ( start | stop | status )&quot;</span>

<span class="token comment"># if no args specified, show usage</span>
<span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token variable">$#</span> <span class="token parameter variable">-eq</span> <span class="token number">0</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span>
    <span class="token builtin class-name">echo</span> <span class="token variable">$usage</span>
    <span class="token builtin class-name">exit</span> <span class="token number">1</span>
<span class="token keyword">fi</span>

<span class="token comment"># Agent 名称</span>
<span class="token assign-left variable">agentName</span><span class="token operator">=</span><span class="token variable">$2</span>
<span class="token comment"># Flume 任务配置路径</span>
<span class="token assign-left variable">jobLocation</span><span class="token operator">=</span><span class="token variable">$3</span>
<span class="token comment"># 任务日志以及Channel路径</span>
<span class="token assign-left variable">logDir</span><span class="token operator">=</span><span class="token variable">$4</span>
<span class="token comment"># 监控端口</span>
<span class="token assign-left variable">monitoringPort</span><span class="token operator">=</span><span class="token variable">$5</span>

<span class="token comment"># Flume 客户端路径</span>
<span class="token assign-left variable">flumeClient</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${FLUME_HOME}</span>&quot;</span>
<span class="token comment"># Flume任务相关的连接参数</span>
<span class="token assign-left variable">file</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${FLUME_JOB_OEM_CONFIG_PATH}</span>/resources_site/flume_job_site_conf.properties&quot;</span>

<span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-f</span> <span class="token string">&quot;<span class="token variable">$file</span>&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span>
    <span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable">$file</span> not found.&quot;</span>
    <span class="token builtin class-name">exit</span> <span class="token number">1</span>
<span class="token keyword">fi</span>
<span class="token keyword">while</span> <span class="token assign-left variable"><span class="token environment constant">IFS</span></span><span class="token operator">=</span><span class="token string">&#39;=&#39;</span> <span class="token builtin class-name">read</span> <span class="token parameter variable">-r</span> key value
<span class="token keyword">do</span>
    <span class="token assign-left variable">key</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> $key <span class="token operator">|</span> <span class="token function">tr</span> <span class="token string">&#39;.&#39;</span> <span class="token string">&#39;_&#39;</span><span class="token variable">)</span></span>
    <span class="token builtin class-name">eval</span> <span class="token variable">\${key}</span><span class="token operator">=</span><span class="token punctuation">\\</span><span class="token variable">\${value}</span>
<span class="token keyword">done</span> <span class="token operator">&lt;</span> <span class="token string">&quot;<span class="token variable">$file</span>&quot;</span>

<span class="token comment"># Kafka 连接地址</span>
<span class="token assign-left variable">kafkaCluster</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${kafkaCluster}</span>&quot;</span>
<span class="token assign-left variable">kafkaCluster_acl</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${kafkaCluster_acl}</span>&quot;</span>
<span class="token assign-left variable">kfk_user</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${kfk_user}</span>&quot;</span>
<span class="token assign-left variable">kfk_pwd</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${kfk_pwd}</span>&quot;</span>
<span class="token assign-left variable">hadoopClusterName</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${hadoopClusterName}</span>&quot;</span>
<span class="token assign-left variable">hdfsFileSuffix</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${hdfsFileSuffix}</span>&quot;</span>
<span class="token assign-left variable">bdCollectPath</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${bdCollectPath}</span>&quot;</span>
<span class="token assign-left variable">bdOEMCollectPath</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${bdOEMCollectPath}</span>&quot;</span>

<span class="token comment"># 参数说明：</span>
<span class="token comment"># --conf/-c：表示配置文件存储在 conf/目录</span>
<span class="token comment"># --name/-n：表示给 agent 起名为 a1</span>
<span class="token comment"># --conf-file/-f：表示任务文件的位置</span>
<span class="token comment"># -D ：表示 flume 运行时动态修改配置文件</span>
<span class="token comment">#   -Dflume.root.logger=INFO,console ：动态修改log4j.properties中设置了日志打印级别以及位置</span>
<span class="token comment">#   -Dflume.log.dir ：动态修改log4j.properties中设置了日志文件存放位置</span>
<span class="token comment"># {</span>
<span class="token comment">#   propertiesImplementation=org.apache.flume.node.EnvVarResolverProperties 固定的，</span>
<span class="token comment">#   是为了将 exec_log_path=$logDir 传进 jobName 文件中使用</span>
<span class="token comment">#   exec_log_path=$logDir 这个必须写在前面</span>
<span class="token comment"># }</span>

<span class="token keyword">case</span> <span class="token variable">$1</span> <span class="token keyword">in</span>
<span class="token string">&quot;start&quot;</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token builtin class-name">echo</span> <span class="token string">&quot;=================       Agent名为 <span class="token variable">\${agentName}</span> 的Flume 开始采集       ===============&quot;</span>
    <span class="token assign-left variable">exec_log_path</span><span class="token operator">=</span><span class="token variable">\${logDir}</span> <span class="token assign-left variable">bdCollectPath</span><span class="token operator">=</span><span class="token variable">\${bdCollectPath}</span> <span class="token assign-left variable">bdOEMCollectPath</span><span class="token operator">=</span><span class="token variable">\${bdOEMCollectPath}</span> <span class="token assign-left variable">kafkaCluster</span><span class="token operator">=</span><span class="token variable">\${kafkaCluster}</span> <span class="token assign-left variable">kafkaCluster_acl</span><span class="token operator">=</span><span class="token variable">\${kafkaCluster_acl}</span> <span class="token assign-left variable">kfk_user</span><span class="token operator">=</span><span class="token variable">\${kfk_user}</span> <span class="token assign-left variable">kfk_pwd</span><span class="token operator">=</span><span class="token variable">\${kfk_pwd}</span> <span class="token assign-left variable">hadoopClusterName</span><span class="token operator">=</span><span class="token variable">\${hadoopClusterName}</span> <span class="token assign-left variable">hdfsFileSuffix</span><span class="token operator">=</span><span class="token variable">\${hdfsFileSuffix}</span> <span class="token function">nohup</span> <span class="token variable">\${flumeClient}</span>/bin/flume-ng agent <span class="token parameter variable">-n</span> <span class="token variable">\${agentName}</span> <span class="token parameter variable">-c</span> <span class="token variable">\${flumeClient}</span>/conf/ <span class="token parameter variable">-f</span> <span class="token variable">\${jobLocation}</span> <span class="token parameter variable">-Dflume.log.dir</span><span class="token operator">=</span><span class="token variable">\${logDir}</span> <span class="token parameter variable">-Dflume.monitoring.type</span><span class="token operator">=</span>http <span class="token parameter variable">-Dflume.monitoring.port</span><span class="token operator">=</span><span class="token variable">\${monitoringPort}</span> <span class="token parameter variable">-DpropertiesImplementation</span><span class="token operator">=</span>org.apache.flume.node.EnvVarResolverProperties <span class="token operator">&gt;</span> <span class="token variable">\${logDir}</span>/run.log <span class="token operator"><span class="token file-descriptor important">2</span>&gt;</span><span class="token file-descriptor important">&amp;1</span> <span class="token operator">&amp;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span><span class="token punctuation">;</span>

<span class="token string">&quot;stop&quot;</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token builtin class-name">echo</span> <span class="token string">&quot;=================       Agent名为 <span class="token variable">\${agentName}</span> 的Flume 停止采集       ===============&quot;</span>
    <span class="token function">ps</span> <span class="token parameter variable">-ef</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token variable">\${jobLocation}</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-v</span> <span class="token function">grep</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-v</span> <span class="token string">&quot;flume_common.sh&quot;</span> <span class="token operator">|</span> <span class="token function">awk</span> <span class="token string">&#39;{print $2}&#39;</span> <span class="token operator">|</span> <span class="token function">xargs</span> <span class="token function">kill</span> <span class="token parameter variable">-15</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span><span class="token punctuation">;</span>

<span class="token string">&quot;status&quot;</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
  <span class="token builtin class-name">echo</span> <span class="token string">&quot;=================       查询 Agent名为 <span class="token variable">\${agentName}</span> 的Flume 进程       ===============&quot;</span>
  <span class="token builtin class-name">echo</span> <span class="token variable"><span class="token variable">\`</span><span class="token function">ps</span> <span class="token parameter variable">-ef</span> <span class="token operator">|</span> <span class="token function">grep</span> $<span class="token punctuation">{</span>jobLocation<span class="token punctuation">}</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-v</span> <span class="token function">grep</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-v</span> <span class="token string">&quot;flume_common.sh&quot;</span><span class="token variable">\`</span></span>
<span class="token punctuation">}</span><span class="token punctuation">;</span><span class="token punctuation">;</span>

*<span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token builtin class-name">echo</span> <span class="token variable">\${usage}</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span><span class="token punctuation">;</span>
<span class="token keyword">esac</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3"><li>启动任务的脚本</li></ol><p>flume_app_info_to_hdfs.sh</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token shebang important">#!/bin/bash</span>
<span class="token builtin class-name">source</span> /etc/profile

<span class="token assign-left variable">usage</span><span class="token operator">=</span><span class="token string">&quot;Usage: ./***.sh ( start | stop | status )&quot;</span>

<span class="token comment"># if no args specified, show usage</span>
<span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token variable">$#</span> <span class="token parameter variable">-eq</span> <span class="token number">0</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span>
    <span class="token builtin class-name">echo</span> <span class="token variable">$usage</span>
    <span class="token builtin class-name">exit</span> <span class="token number">1</span>
<span class="token keyword">fi</span>

<span class="token comment"># 监控端口</span>
<span class="token assign-left variable">monitoringPort</span><span class="token operator">=</span><span class="token number">34551</span>
<span class="token comment"># Agent 名称</span>
<span class="token assign-left variable">agentName</span><span class="token operator">=</span><span class="token string">&quot;a_app_info_to_hdfs&quot;</span>
<span class="token comment"># Flume 任务配置路径</span>
<span class="token assign-left variable">jobLocation</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${FLUME_JOB_OEM_CONFIG_PATH}</span>/kafka_to_hdfs/flume_app_info_to_hdfs/flume_app_info_to_hdfs.conf&quot;</span>
<span class="token comment"># 任务日志以及Channel路径</span>
<span class="token assign-left variable">logDir</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${FLUME_JOB_OEM_CONFIG_PATH}</span>/log_channel_datas/<span class="token variable">\${agentName}</span>&quot;</span>

<span class="token function">sh</span> <span class="token variable">\${FLUME_JOB_OEM_CONFIG_PATH}</span>/resources_site/flume_common.sh <span class="token variable">$1</span> <span class="token variable">\${agentName}</span> <span class="token variable">\${jobLocation}</span> <span class="token variable">\${logDir}</span> <span class="token variable">\${monitoringPort}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,12),p=[t];function o(i,c){return a(),n("div",null,p)}const u=s(l,[["render",o],["__file","11_Flume之启动任务脚本.html.vue"]]);export{u as default};
