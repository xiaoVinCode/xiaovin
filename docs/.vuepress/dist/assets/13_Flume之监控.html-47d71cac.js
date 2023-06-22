import{_ as o}from"./plugin-vue_export-helper-c27b6911.js";import{r as l,o as p,c as i,a as t,b as n,d as s,f as a}from"./app-242a2990.js";const r={},c=a(`<h4 id="_1-介绍" tabindex="-1"><a class="header-anchor" href="#_1-介绍" aria-hidden="true">#</a> 1. 介绍</h4><p>Flume自带的有两种监控方式, http监控和ganglia监控，用户还可以实现自定义的监控。</p><h4 id="_2-http监控" tabindex="-1"><a class="header-anchor" href="#_2-http监控" aria-hidden="true">#</a> 2. Http监控</h4><p>使用这种监控方式，只需要在启动flume的时候在启动参数上面加上监控配置，例如：</p><div class="language-plain line-numbers-mode" data-ext="plain"><pre class="language-plain"><code>bin/flume-ng agent --conf conf --conf-file conf/flume_conf.properties --name a1 -Dflume.monitoring.type=http -Dflume.monitoring.port=34545
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>其中-Dflume.monitoring.type=http表示使用http方式来监控，后面的-Dflume.monitoring.port=34545表示我们需要启动的监控服务的端口号为1234，这个端口号可以自己随意配置。启动flume之后，通过http://ip:1234/metrics就可以得到flume的一个json格式的监控数据。</p><h5 id="_1-返回结果示例" tabindex="-1"><a class="header-anchor" href="#_1-返回结果示例" aria-hidden="true">#</a> 1. 返回结果示例 :</h5><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
    <span class="token property">&quot;CHANNEL.memoryChannel&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">&quot;ChannelCapacity&quot;</span><span class="token operator">:</span> <span class="token string">&quot;550000&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;ChannelFillPercentage&quot;</span><span class="token operator">:</span> <span class="token string">&quot;0.18181818181818182&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;Type&quot;</span><span class="token operator">:</span> <span class="token string">&quot;CHANNEL&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;ChannelSize&quot;</span><span class="token operator">:</span> <span class="token string">&quot;1000&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;EventTakeSuccessCount&quot;</span><span class="token operator">:</span> <span class="token string">&quot;33541400&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;EventTakeAttemptCount&quot;</span><span class="token operator">:</span> <span class="token string">&quot;33541527&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;StartTime&quot;</span><span class="token operator">:</span> <span class="token string">&quot;1536572886273&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;EventPutAttemptCount&quot;</span><span class="token operator">:</span> <span class="token string">&quot;33542500&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;EventPutSuccessCount&quot;</span><span class="token operator">:</span> <span class="token string">&quot;33542500&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;StopTime&quot;</span><span class="token operator">:</span> <span class="token string">&quot;0&quot;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token property">&quot;SINK.hdfsSink&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">&quot;ConnectionCreatedCount&quot;</span><span class="token operator">:</span> <span class="token string">&quot;649&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;ConnectionClosedCount&quot;</span><span class="token operator">:</span> <span class="token string">&quot;648&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;Type&quot;</span><span class="token operator">:</span> <span class="token string">&quot;SINK&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;BatchCompleteCount&quot;</span><span class="token operator">:</span> <span class="token string">&quot;335414&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;BatchEmptyCount&quot;</span><span class="token operator">:</span> <span class="token string">&quot;27&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;EventDrainAttemptCount&quot;</span><span class="token operator">:</span> <span class="token string">&quot;33541500&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;StartTime&quot;</span><span class="token operator">:</span> <span class="token string">&quot;1536572886275&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;EventDrainSuccessCount&quot;</span><span class="token operator">:</span> <span class="token string">&quot;33541400&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;BatchUnderflowCount&quot;</span><span class="token operator">:</span> <span class="token string">&quot;0&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;StopTime&quot;</span><span class="token operator">:</span> <span class="token string">&quot;0&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;ConnectionFailedCount&quot;</span><span class="token operator">:</span> <span class="token string">&quot;0&quot;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token property">&quot;SOURCE.avroSource&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">&quot;EventReceivedCount&quot;</span><span class="token operator">:</span> <span class="token string">&quot;33542500&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;AppendBatchAcceptedCount&quot;</span><span class="token operator">:</span> <span class="token string">&quot;335425&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;Type&quot;</span><span class="token operator">:</span> <span class="token string">&quot;SOURCE&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;EventAcceptedCount&quot;</span><span class="token operator">:</span> <span class="token string">&quot;33542500&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;AppendReceivedCount&quot;</span><span class="token operator">:</span> <span class="token string">&quot;0&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;StartTime&quot;</span><span class="token operator">:</span> <span class="token string">&quot;1536572886465&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;AppendAcceptedCount&quot;</span><span class="token operator">:</span> <span class="token string">&quot;0&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;OpenConnectionCount&quot;</span><span class="token operator">:</span> <span class="token string">&quot;3&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;AppendBatchReceivedCount&quot;</span><span class="token operator">:</span> <span class="token string">&quot;335425&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;StopTime&quot;</span><span class="token operator">:</span> <span class="token string">&quot;0&quot;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="_2-参数定义" tabindex="-1"><a class="header-anchor" href="#_2-参数定义" aria-hidden="true">#</a> 2. 参数定义:</h5><table><thead><tr><th style="text-align:left;">字段名称</th><th style="text-align:left;">含义</th><th style="text-align:left;">备注</th></tr></thead><tbody><tr><td style="text-align:left;">SOURCE.OpenConnectionCount</td><td style="text-align:left;">打开的连接数</td><td style="text-align:left;"></td></tr><tr><td style="text-align:left;">SOURCE.TYPE</td><td style="text-align:left;">组件类型</td><td style="text-align:left;"></td></tr><tr><td style="text-align:left;">SOURCE.AppendBatchAcceptedCount</td><td style="text-align:left;">追加到channel中的批数量</td><td style="text-align:left;"></td></tr><tr><td style="text-align:left;">SOURCE.AppendBatchReceivedCount</td><td style="text-align:left;">source端刚刚追加的批数量</td><td style="text-align:left;"></td></tr><tr><td style="text-align:left;">SOURCE.EventAcceptedCount</td><td style="text-align:left;">成功放入channel的event数量</td><td style="text-align:left;"></td></tr><tr><td style="text-align:left;">SOURCE.AppendReceivedCount</td><td style="text-align:left;">source追加目前收到的数量</td><td style="text-align:left;"></td></tr><tr><td style="text-align:left;">SOURCE.StartTime(StopTIme)</td><td style="text-align:left;">组件开始时间、结束时间</td><td style="text-align:left;"></td></tr><tr><td style="text-align:left;">SOURCE.EventReceivedCount</td><td style="text-align:left;">source端成功收到的event数量</td><td style="text-align:left;"></td></tr><tr><td style="text-align:left;">SOURCE.AppendAcceptedCount</td><td style="text-align:left;">source追加目前放入channel的数量</td><td style="text-align:left;"></td></tr><tr><td style="text-align:left;">CHANNEL.EventPutSuccessCount</td><td style="text-align:left;">成功放入channel的event数量</td><td style="text-align:left;"></td></tr><tr><td style="text-align:left;">CHANNEL.ChannelFillPercentage</td><td style="text-align:left;">通道使用比例</td><td style="text-align:left;"></td></tr><tr><td style="text-align:left;">CHANNEL.EventPutAttemptCount</td><td style="text-align:left;">尝试放入将event放入channel的次数</td><td style="text-align:left;"></td></tr><tr><td style="text-align:left;">CHANNEL.ChannelSize</td><td style="text-align:left;">目前在channel中的event数量</td><td style="text-align:left;"></td></tr><tr><td style="text-align:left;">CHANNEL.EventTakeSuccessCount</td><td style="text-align:left;">从channel中成功取走的event数量</td><td style="text-align:left;"></td></tr><tr><td style="text-align:left;">CHANNEL.ChannelCapacity</td><td style="text-align:left;">通道容量</td><td style="text-align:left;"></td></tr><tr><td style="text-align:left;">CHANNEL.EventTakeAttemptCount</td><td style="text-align:left;">尝试从channel中取走event的次数</td><td style="text-align:left;"></td></tr><tr><td style="text-align:left;">SINK.BatchCompleteCount</td><td style="text-align:left;">完成的批数量</td><td style="text-align:left;"></td></tr><tr><td style="text-align:left;">SINK.ConnectionFailedCount</td><td style="text-align:left;">连接失败数</td><td style="text-align:left;"></td></tr><tr><td style="text-align:left;">SINK.EventDrainAttemptCount</td><td style="text-align:left;">尝试提交的event数量</td><td style="text-align:left;"></td></tr><tr><td style="text-align:left;">SINK.ConnectionCreatedCount</td><td style="text-align:left;">创建连接数</td><td style="text-align:left;"></td></tr><tr><td style="text-align:left;">SINK.Type</td><td style="text-align:left;">组件类型</td><td style="text-align:left;"></td></tr><tr><td style="text-align:left;">SINK.BatchEmptyCount</td><td style="text-align:left;">批量取空的数量</td><td style="text-align:left;"></td></tr><tr><td style="text-align:left;">SINK.ConnectionClosedCount</td><td style="text-align:left;">关闭连接数量</td><td style="text-align:left;"></td></tr><tr><td style="text-align:left;">SINK.EventDrainSuccessCount</td><td style="text-align:left;">成功发送event的数量</td><td style="text-align:left;"></td></tr><tr><td style="text-align:left;">SINK.BatchUnderflowCount</td><td style="text-align:left;">正处于批量处理的batch数</td><td style="text-align:left;"></td></tr></tbody></table><blockquote><p>存在问题，每个任务需要占用一个端口，且需要不停调用端口获取json格式数据。</p></blockquote><h4 id="_3-ganglia监控" tabindex="-1"><a class="header-anchor" href="#_3-ganglia监控" aria-hidden="true">#</a> 3. ganglia监控</h4><p>这种监控方式需要先安装ganglia然后启动ganglia，然后再启动flume的时候加上监控配置，例如：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>bin/flume-ng agent <span class="token parameter variable">--conf</span> conf --conf-file conf/producer.properties <span class="token parameter variable">--name</span> a1 <span class="token parameter variable">-Dflume.monitoring.type</span><span class="token operator">=</span>ganglia <span class="token parameter variable">-Dflume.monitoring.hosts</span><span class="token operator">=</span>ip:port
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>其中-Dflume.monitoring.type=ganglia表示使用ganglia的方式来监控，而-Dflume.monitoring.hosts=ip:port表示ganglia安装的ip和启动的端口号。ganglia监控是用界面的方式展示数据，相对比较直观。</p><figure><img src="https://static-resource-yang.oss-cn-shenzhen.aliyuncs.com/typora_pic/202304102205407.png" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>`,16),u={href:"https://blog.csdn.net/yljphp/article/details/90347486",target:"_blank",rel:"noopener noreferrer"},d=t("h4",{id:"_4-自定义",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#_4-自定义","aria-hidden":"true"},"#"),n(" 4. 自定义")],-1),g={href:"http://localhost:12345/metrics",target:"_blank",rel:"noopener noreferrer"},k=a('<h3 id="监控实现原理" tabindex="-1"><a class="header-anchor" href="#监控实现原理" aria-hidden="true">#</a> 监控实现原理</h3><p>flume启动时会初始化一个jettyServer来提供监控数据的访问服务，把相关的监控指标通过HTTP以JSON形式报告metrics，这些监控数据是用JMX的方式得到的, 通过一个Map&lt;key, AtomicLong&gt;来实现metric的计量。</p><p>flume关于监控组件的源码在flume-ng-core中的org.apache.flume.instrumentation包下面，所有的监控组件都会继承MonitoredCounterGroup类并实现xxxCounterMBean接口。MonitoredCounterGroup中定义了一些基本公有的监控属性，xxxCounterMBean定义了获取监控元素的方法接口，具体实现在监控组件xxxCounter中实现，flume自带的监控组件有SourceCounter、SinkCounter、ChannelProcessCounter。监控数据流向为：</p><figure><img src="https://static-resource-yang.oss-cn-shenzhen.aliyuncs.com/typora_pic/202304102204138.png" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>以ThriftSource为例，与监控相关的有SourceCounter、SourceCounterMBean、MonitoredCounterGroup。其中SourceCounter和MonitoredCounterGroup中定义了要监控的元素，SourceCounterMBean中定义了获取元素的方法。SouceCounter获取监控数据的过程为：</p><ol><li>启动ThriftSource时初始化一个SourceCounter并启动。</li><li>在接收到Event时，调用incrementEventReceivedCount方法，记录event个数；在event处理完成时，调用incrementEventAcceptedCount记录event处理成功的个数。其他计数方式类似。</li><li>停止ThriftSource时停止SourceCounter.</li></ol><p>如果是自定义监控组件，只需要添加xxxCounter、xxxCounterMBean，以及自定义的xxx组件（source、channel、sink），这里需要注意命名规范的问题，需要严格按照上面的命令规范JMX才能正常识别。galaxy-tunnel中自定义了StatisticsCounter和StatisticsCounterMBean，用于统计各个topic在一个周期内（可配置，目前是1分钟）的Event数量和字节数。</p><p>参考源码分析：https://blog.csdn.net/u010670689/article/details/78354681</p>',8);function f(v,y){const e=l("ExternalLinkIcon");return p(),i("div",null,[c,t("blockquote",null,[t("p",null,[n("首先安装ganglia. 参考地址 "),t("a",u,[n("https://blog.csdn.net/yljphp/article/details/90347486"),s(e)])])]),d,t("p",null,[n("采取自定义方式进行监控数据采集，flume支持自定义方式采集"),t("a",g,[n("metrics"),s(e)]),n("信息，可重写flume采集监控部分，将实时监控数据直接发送到自定义数据库（mysql或时序数据库）内，然后根据项目实际需求自定义开发监控组件。")]),k])}const h=o(r,[["render",f],["__file","13_Flume之监控.html.vue"]]);export{h as default};
