#### 1. 默认

如果没有手动配置，source的默认channel选择器类型是replicating（复制），当然这个选择器只针对source配置了多个channel的时候。 

> 既然叫做channel选择器，很容易猜得到这是source才有的配置。前面介绍过，一个souce可以向多个channel同时写数据，所以也就产生了以何种方式向多个channel写的问题（比如自带的 [复制选择器](https://flume.liyifeng.org/#id43) ， 会把数据完整地发送到每一个channel，而 [多路复用选择器](https://flume.liyifeng.org/#id44) 就可以通过配置来按照一定的规则进行分发，听起来很像负载均衡），channel选择器也就应运而生。

#### 2. 复制选择器（replicating）

**它是默认的选择器**。

必需的参数已用 **粗体** 标明。

| 属性              | 默认值      | 解释                                    |
| :---------------- | :---------- | :-------------------------------------- |
| selector.type     | replicating | `replicating`                           |
| selector.optional | –           | 指定哪些channel是可选的，多个用空格分开 |

配置范例：

```properties
a1.sources = r1
a1.channels = c1 c2 c3
a1.sources.r1.selector.type = replicating
a1.sources.r1.channels = c1 c2 c3
a1.sources.r1.selector.optional = c3
```

上面这个例子中，c3配置成了可选的。向c3发送数据如果失败了会被忽略。c1和c2没有配置成可选的，向c1和c2写数据失败会导致事务失败回滚。

例子：replicating

```properties
agent1.sources.s1.type = TAILDIR
agent1.sources.s1.positionFile = ${exec_log_path}/position.json
agent1.sources.s1.filegroups = fg_1 fg_2
agent1.sources.s1.filegroups.fg_1 = /data/collect-info.log
agent1.sources.s1.filegroups.fg_2 = /data/collect-info.log.*[^g][^z]$
agent1.sources.s1.maxBatchCount = 5000
agent1.sources.s1.selector.type = replicating
```

#### 3. 多路复用选择器（Multiplexing）

Agent：多路模式一般有两种实现方式，一种是用来复制，另一种是用来分流。复制方式可以将最前端的数据源复制多份，分别传递到多个Channel中，每个Channel接收到的数据都是相同的。分流方式，Selector可以根据Header的值来确定数据传递到哪一个Channel。

![图片](https://static-resource-yang.oss-cn-shenzhen.aliyuncs.com/typora_pic/202304092239854.png)

必需的参数已用 **粗体** 标明。

| 属性               | 默认值                | 解释                                                         |
| :----------------- | :-------------------- | :----------------------------------------------------------- |
| selector.type      | replicating           | 组件类型，这个是： `multiplexing`                            |
| selector.header    | flume.selector.header | 想要进行匹配的header属性的名字                               |
| selector.default   | –                     | 指定一个默认的channel。如果没有被规则匹配到，默认会发到这个channel上 |
| selector.mapping.* | –                     | 一些匹配规则，具体参考下面的例子                             |

配置范例：

```properties
a1.sources = r1
a1.channels = c1 c2 c3 c4
a1.sources.r1.selector.type = multiplexing
a1.sources.r1.selector.header = state        #以每个Event的header中的state这个属性的值作为选择channel的依据
a1.sources.r1.selector.mapping.CZ = c1       #如果state=CZ，则选择c1这个channel
a1.sources.r1.selector.mapping.US = c2 c3    #如果state=US，则选择c2 和 c3 这两个channel
a1.sources.r1.selector.default = c4          #默认使用c4这个channel
```

例子：multiplexing

```properties
agent1.sources.s1.type = avro
agent1.sources.s1.bind = 0.0.0.0
agent1.sources.s1.port = 1234
agent1.sources.s1.interceptors = i1
agent1.sources.s1.interceptors.i1.type= xxx.xxx.xxx.flume.KeyWordInterceptor$Builder
agent1.sources.s1.selector.type= multiplexing
agent1.sources.s1.selector.header = kw
agent1.sources.s1.selector.mapping.kw_value1 = c_1
agent1.sources.s1.selector.mapping.kw_value2 = c_2
agent1.sources.s1.selector.mapping.kw_value3 = c_3
agent1.sources.s1.selector.mapping.kw_value4 = c_4
```
