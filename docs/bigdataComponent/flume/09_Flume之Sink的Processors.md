---
# 这是文章的标题
title: 09_Sink的Processors
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

#### 1. Sink Processor共有三种类型

| 类型                       |                                             |
| -------------------------- | ------------------------------------------- |
| DefaultSinkProcessor       | 对应单个sink，发送至单个sink                |
| LoadBalancingSinkProcessor | 对应的是 Sink Group，可以实现负载均衡的能力 |
| FailoverSinkProcessor      | 对应的是Sink Group，可以错误回复的功能      |

Sink 提供了分组功能，用于把多个 Sink 聚合为一组进行使用，内部提供了 SinkGroup 用来完成这个事情。Sink Processors可以使在Sink Group中所有sink具有负载均衡的能力，或者在一个sink失效后切换到另一个sink的fail over模式。默认的sink processor只接受一个sink，用户不一定非得创建sink group

DefaultSinkProcessor ：默认实现，用于单个 Sink 的场景使用。

FailoverSinkProcessor ：故障转移实现， failover机制维护一个sink优先级列表，保证有效事件可以被处理掉。

LoadBalancingSinkProcessor:  load balancing sink processor给多个sinks之间提供负载均衡，它维护一个可用sink索引，它支持通过round_robin和random两种方法进行负载分配，默认的选择方式是round_type类型的，也可以通过配置文件进行更改。当被选择器被调用的时候，它不会屏蔽故障的sink，继续尝试访问每一个可用的sink，如果所有的sink都故障了，选择器则无法给sink传播数据。如果backoff被开启，则sink processor会屏蔽故障的sink，选择器会在一个给定的超时时间内移除它们，当超时时间完毕后，sink还是无法访问，则超时时间以指数方式增长。

例子：

```properties
a_stat_info.sinkgroups.sg_stat_info.sinks = k_stat_info_1 k_stat_info_2
a_stat_info.sinkgroups.sg_stat_info.processor.type = load_balance
a_stat_info.sinkgroups.sg_stat_info.processor.backoff = true
a_stat_info.sinkgroups.sg_stat_info.processor.selector = round_robin
a_stat_info.sinkgroups.sg_stat_info.processor.selector.maxTimeOut = 30000
```

