import{_ as s}from"./plugin-vue_export-helper-c27b6911.js";import{o as n,c as a,f as t}from"./app-242a2990.js";const e={},o=t(`<h4 id="_1-sink-processor共有三种类型" tabindex="-1"><a class="header-anchor" href="#_1-sink-processor共有三种类型" aria-hidden="true">#</a> 1. Sink Processor共有三种类型</h4><table><thead><tr><th>类型</th><th></th></tr></thead><tbody><tr><td>DefaultSinkProcessor</td><td>对应单个sink，发送至单个sink</td></tr><tr><td>LoadBalancingSinkProcessor</td><td>对应的是 Sink Group，可以实现负载均衡的能力</td></tr><tr><td>FailoverSinkProcessor</td><td>对应的是Sink Group，可以错误回复的功能</td></tr></tbody></table><p>Sink 提供了分组功能，用于把多个 Sink 聚合为一组进行使用，内部提供了 SinkGroup 用来完成这个事情。Sink Processors可以使在Sink Group中所有sink具有负载均衡的能力，或者在一个sink失效后切换到另一个sink的fail over模式。默认的sink processor只接受一个sink，用户不一定非得创建sink group</p><p>DefaultSinkProcessor ：默认实现，用于单个 Sink 的场景使用。</p><p>FailoverSinkProcessor ：故障转移实现， failover机制维护一个sink优先级列表，保证有效事件可以被处理掉。</p><p>LoadBalancingSinkProcessor: load balancing sink processor给多个sinks之间提供负载均衡，它维护一个可用sink索引，它支持通过round_robin和random两种方法进行负载分配，默认的选择方式是round_type类型的，也可以通过配置文件进行更改。当被选择器被调用的时候，它不会屏蔽故障的sink，继续尝试访问每一个可用的sink，如果所有的sink都故障了，选择器则无法给sink传播数据。如果backoff被开启，则sink processor会屏蔽故障的sink，选择器会在一个给定的超时时间内移除它们，当超时时间完毕后，sink还是无法访问，则超时时间以指数方式增长。</p><p>例子：</p><div class="language-properties line-numbers-mode" data-ext="properties"><pre class="language-properties"><code><span class="token key attr-name">a_stat_info.sinkgroups.sg_stat_info.sinks</span> <span class="token punctuation">=</span> <span class="token value attr-value">k_stat_info_1 k_stat_info_2</span>
<span class="token key attr-name">a_stat_info.sinkgroups.sg_stat_info.processor.type</span> <span class="token punctuation">=</span> <span class="token value attr-value">load_balance</span>
<span class="token key attr-name">a_stat_info.sinkgroups.sg_stat_info.processor.backoff</span> <span class="token punctuation">=</span> <span class="token value attr-value">true</span>
<span class="token key attr-name">a_stat_info.sinkgroups.sg_stat_info.processor.selector</span> <span class="token punctuation">=</span> <span class="token value attr-value">round_robin</span>
<span class="token key attr-name">a_stat_info.sinkgroups.sg_stat_info.processor.selector.maxTimeOut</span> <span class="token punctuation">=</span> <span class="token value attr-value">30000</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,8),r=[o];function i(p,c){return n(),a("div",null,r)}const d=s(e,[["render",i],["__file","09_Flume之Sink的Processors.html.vue"]]);export{d as default};
