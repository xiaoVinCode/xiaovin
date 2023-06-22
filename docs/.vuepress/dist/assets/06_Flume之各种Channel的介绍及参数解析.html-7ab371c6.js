const e=JSON.parse('{"key":"v-a0c3b83a","path":"/bigdataComponent/flume/06_Flume%E4%B9%8B%E5%90%84%E7%A7%8DChannel%E7%9A%84%E4%BB%8B%E7%BB%8D%E5%8F%8A%E5%8F%82%E6%95%B0%E8%A7%A3%E6%9E%90.html","title":"06_各种Channel的介绍及参数解析","lang":"zh-CN","frontmatter":{"title":"06_各种Channel的介绍及参数解析","order":1,"author":"xiaovin","date":"2023-04-01T00:00:00.000Z","category":["数据集成"],"sticky":true,"star":true,"description":"一、Channel介绍 Channel被设计为Event中转临时缓冲区，存储Source收集并且没有被Sink读取的Event，为平衡Source收集和Sink读取数据的速度，可视为Flume内部的消息队列。Channel线程安全并且具有事务性，支持source写失败重复写和sink读失败重复读等操作。 常用的Channel类型有Memory Channel、File Channel、KafkaChannel等。 Channel类型 说明 MemoryChannel 基于内存的channel，实际就是将event存放于内存中一个固定大小的队列中。其优点是速度快，缺点是agent挂掉时会丢失数据。 FileChannel 基于文件的Channel, 在磁盘上指定一个目录用于存放event，同时也可以指定目录的大小。优点是数据可恢复，相对于memory channel来说缺点是要频繁的读取磁盘，速度较慢。 Spillable Memory Channel Event存放在内存和磁盘上，内存作为主要存储，当内存达到一定临界点的时候会溢写到磁盘上，兼具Memory Channel和File Channel的优势，但不稳定，不建议生产环境使用，并且性能不佳。 JDBC Channel 将event存放于一个支持JDBC连接的数据库中，目前官方推荐的是Derby库，其优点是数据可以恢复，速度比FileChannel慢 Kafka Channel 将events存储在Kafka集群中。Kafka提供高可用性和高可靠性，所以当agent或者kafka broker 崩溃时，events能马上被其他sinks可用。Kafka channel可以被多个场景使用： Flume source和sink - 它为events提供可靠和高可用的channel； Flume source和interceptor，但是没sink - 它允许写Flume evnets到Kafka topic； Flume sink，但是没source - 这是一种低延迟，容错的方式从Kafka发送events到Flume sinks","head":[["meta",{"property":"og:url","content":"https://vuepress-theme-hope-docs-demo.netlify.app/bigdataComponent/flume/06_Flume%E4%B9%8B%E5%90%84%E7%A7%8DChannel%E7%9A%84%E4%BB%8B%E7%BB%8D%E5%8F%8A%E5%8F%82%E6%95%B0%E8%A7%A3%E6%9E%90.html"}],["meta",{"property":"og:site_name","content":"文档演示"}],["meta",{"property":"og:title","content":"06_各种Channel的介绍及参数解析"}],["meta",{"property":"og:description","content":"一、Channel介绍 Channel被设计为Event中转临时缓冲区，存储Source收集并且没有被Sink读取的Event，为平衡Source收集和Sink读取数据的速度，可视为Flume内部的消息队列。Channel线程安全并且具有事务性，支持source写失败重复写和sink读失败重复读等操作。 常用的Channel类型有Memory Channel、File Channel、KafkaChannel等。 Channel类型 说明 MemoryChannel 基于内存的channel，实际就是将event存放于内存中一个固定大小的队列中。其优点是速度快，缺点是agent挂掉时会丢失数据。 FileChannel 基于文件的Channel, 在磁盘上指定一个目录用于存放event，同时也可以指定目录的大小。优点是数据可恢复，相对于memory channel来说缺点是要频繁的读取磁盘，速度较慢。 Spillable Memory Channel Event存放在内存和磁盘上，内存作为主要存储，当内存达到一定临界点的时候会溢写到磁盘上，兼具Memory Channel和File Channel的优势，但不稳定，不建议生产环境使用，并且性能不佳。 JDBC Channel 将event存放于一个支持JDBC连接的数据库中，目前官方推荐的是Derby库，其优点是数据可以恢复，速度比FileChannel慢 Kafka Channel 将events存储在Kafka集群中。Kafka提供高可用性和高可靠性，所以当agent或者kafka broker 崩溃时，events能马上被其他sinks可用。Kafka channel可以被多个场景使用： Flume source和sink - 它为events提供可靠和高可用的channel； Flume source和interceptor，但是没sink - 它允许写Flume evnets到Kafka topic； Flume sink，但是没source - 这是一种低延迟，容错的方式从Kafka发送events到Flume sinks"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-06-22T07:07:56.000Z"}],["meta",{"property":"article:author","content":"xiaovin"}],["meta",{"property":"article:published_time","content":"2023-04-01T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2023-06-22T07:07:56.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"06_各种Channel的介绍及参数解析\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2023-04-01T00:00:00.000Z\\",\\"dateModified\\":\\"2023-06-22T07:07:56.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"xiaovin\\"}]}"]]},"headers":[{"level":2,"title":"一、Channel介绍","slug":"一、channel介绍","link":"#一、channel介绍","children":[{"level":3,"title":"1、Memory Channel","slug":"_1、memory-channel","link":"#_1、memory-channel","children":[]},{"level":3,"title":"2、File Channel","slug":"_2、file-channel","link":"#_2、file-channel","children":[]},{"level":3,"title":"3、Kafka Channel","slug":"_3、kafka-channel","link":"#_3、kafka-channel","children":[]}]}],"git":{"createdTime":1687417676000,"updatedTime":1687417676000,"contributors":[{"name":"v_yangjiahao01","email":"v_yangjiahao01@baidu.com","commits":1}]},"readingTime":{"minutes":10.4,"words":3121},"filePathRelative":"bigdataComponent/flume/06_Flume之各种Channel的介绍及参数解析.md","localizedDate":"2023年4月1日","excerpt":"<h2> 一、Channel介绍</h2>\\n<p>Channel被设计为Event中转临时缓冲区，存储Source收集并且没有被Sink读取的Event，为平衡Source收集和Sink读取数据的速度，可视为Flume内部的消息队列。Channel线程安全并且具有事务性，支持source写失败重复写和sink读失败重复读等操作。</p>\\n<p>常用的Channel类型有Memory Channel、File Channel、KafkaChannel等。</p>\\n<table>\\n<thead>\\n<tr>\\n<th>Channel类型</th>\\n<th>说明</th>\\n</tr>\\n</thead>\\n<tbody>\\n<tr>\\n<td>MemoryChannel</td>\\n<td>基于内存的channel，实际就是将event存放于内存中一个固定大小的队列中。其优点是速度快，缺点是agent挂掉时会丢失数据。</td>\\n</tr>\\n<tr>\\n<td>FileChannel</td>\\n<td>基于文件的Channel, 在磁盘上指定一个目录用于存放event，同时也可以指定目录的大小。优点是数据可恢复，相对于memory channel来说缺点是要频繁的读取磁盘，速度较慢。</td>\\n</tr>\\n<tr>\\n<td>Spillable Memory Channel</td>\\n<td>Event存放在内存和磁盘上，内存作为主要存储，当内存达到一定临界点的时候会溢写到磁盘上，兼具Memory Channel和File Channel的优势，但不稳定，不建议生产环境使用，并且性能不佳。</td>\\n</tr>\\n<tr>\\n<td>JDBC Channel</td>\\n<td>将event存放于一个支持JDBC连接的数据库中，目前官方推荐的是Derby库，其优点是数据可以恢复，速度比FileChannel慢</td>\\n</tr>\\n<tr>\\n<td>Kafka Channel</td>\\n<td>将events存储在Kafka集群中。Kafka提供高可用性和高可靠性，所以当agent或者kafka broker 崩溃时，events能马上被其他sinks可用。Kafka channel可以被多个场景使用：<br>    Flume source和sink - 它为events提供可靠和高可用的channel；<br>    Flume source和interceptor，但是没sink - 它允许写Flume evnets到Kafka topic；<br>    Flume sink，但是没source - 这是一种低延迟，容错的方式从Kafka发送events到Flume sinks</td>\\n</tr>\\n</tbody>\\n</table>","copyright":{"author":"xiaovin"},"autoDesc":true}');export{e as data};
