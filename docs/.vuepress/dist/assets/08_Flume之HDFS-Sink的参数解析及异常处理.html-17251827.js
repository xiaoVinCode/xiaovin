const t=JSON.parse('{"key":"v-cd24f514","path":"/bigdataComponent/flume/08_Flume%E4%B9%8BHDFS-Sink%E7%9A%84%E5%8F%82%E6%95%B0%E8%A7%A3%E6%9E%90%E5%8F%8A%E5%BC%82%E5%B8%B8%E5%A4%84%E7%90%86.html","title":"08_HDFS-Sink的参数解析及异常处理","lang":"zh-CN","frontmatter":{"title":"08_HDFS-Sink的参数解析及异常处理","order":1,"author":"xiaovin","date":"2023-04-01T00:00:00.000Z","category":["数据集成"],"sticky":true,"star":true,"description":"一、配置详解 序号 参数名 默认值 描述 1 type Sink类型为hdfs - 2 hdfs.path - HDFS存储路径，支持按照时间分区。集群的NameNode名字：单节点：hdfs://主机名(ip):9000/%Y/%m/%d/%H；HA集群：hdfs://nameservice(高可用NameNode服务名称)/%Y/%m/%d/%H 3 hdfs.filePrefix FlumeData Event输出到HDFS的文件名前缀 4 hdfs.fileSuffix - Event输出到HDFS的文件名后缀 5 hdfs.inUsePrefix - 临时文件的文件名前缀。Flume首先将Event输出到HDFS指定目录的临时文件中，再根据相关规则重命名为目标文件 6 hdfs.inUseSuffix .tmp 临时文件名后缀。 7 hdfs.rollInterval 30 间隔多久将临时文件滚动成最终目标文件，单位：秒。如果设置为0，则表示不根据时间滚动文件。注：滚动(roll)指的是，HDFS Sink将临时文件重命名成最终目标文件，并新打开一个临时文件来写数据 8 hdfs.rollSize 1024 当临时文件达到该大小时，滚动成目标文件，单位：byte。该值设置为0，则表示文件不根据文件大小滚动生成 9 hdfs.rollCount 10 当Event数据达到该数量时，将临时文件滚动生成目标文件。该值设置为0，则表示文件不根据Event数滚动生成 10 hdfs.idleTimeout 0 当目前被打开的临时文件在该参数指定的时间内，没有任何数据写入，则将该临时文件关闭并重命名成目标文件，单位：秒。该值设置为0，则表示禁用此功能，不自动关闭临时文件 11 hdfs.round false 用于HDFS文件按照时间分区，时间戳向下取整 12 hdfs.roundValue 1 当round设置为true，配合roundUnit时间单位一起使用，例如roundUnit值为minute。该值设置为1则表示一分钟之内的数据写到一个文件中，相当于每一分钟生成一个文件 13 hdfs.roundUnit second 按时间分区使用的时间单位，可以选择second（秒）、minute（分钟）、hour（小时）三种粒度的时间单位。示例：a1.sinks.k1.hdfs.path = hdfs://nameservice/flume/events/%y/%m/%d/%H/%M；a1.sinks.k1.hdfs.round = true；a1.sinks.k1.hdfs.roundValue = 10；a1.sinks.k1.hdfs.roundUnit = minute；当时间为2022-04-05 17:38:59时候，hdfs.path依然会被解析为：/flume/events/2022/04/05/17/30；因为设置的是舍弃10分钟内的时间，因此，该目录每10分钟新生成一个 14 hdfs.batchSize 100 每个批次刷写到HDFS的Event数量 15 hdfs.codeC 不采用压缩 文件压缩格式，目前支持的压缩格式有gzip、bzip2、lzo、lzop、snappy 16 hdfs.fileType SequenceFile 文件类型，包括：SequenceFile、DataStream、CompressedStream。该值设置为DataStream，则输出的文件不会进行压缩，不需要设置hdfs.codeC指定压缩格式。该值设置为CompressedStream，则对输出的文件进行压缩，需要设置hdfs.codeC指定压缩格式 17 hdfs.maxOpenFiles 5000 最大允许打开的HDFS文件数，当打开的文件数达到该值，则最早打开的文件将会被关闭 18 hdfs.minBlockReplicas HDFS副本数 写入HDFS文件块的最小副本数。该参数会影响文件的滚动配置，一般将该参数配置成1，才可以按照配置正确滚动文件 19 hdfs.writeFormat Writable 文件的格式，目前可以选择Text或者Writable两种格式 20 hdfs.callTimeout 10000 操作HDFS文件的超时时间，如果需要写入HDFS文件的Event数比较大或者发生了打开、写入、刷新、关闭文件超时的问题，可以根据实际情况适当增大超时时间，单位：毫秒 21 hdfs.threadsPoolSize 10 每个HDFS Sink执行HDFS IO操作打开的线程数 22 hdfs.rollTimerPoolSize 1 HDFS Sink根据时间滚动生成文件时启动的线程数 23 hdfs.timeZone Local Time本地时间 写入HDFS文件使用的时区 24 hdfs.useLocalTimeStamp false 是否使用本地时间替换Event头信息中的时间戳 25 hdfs.closeTries 0 在发起关闭尝试后，尝试重命名临时文件的次数。如果设置为1，表示重命名一次失败后不再继续尝试重命名操作，此时待处理的文件将处于打开状态，扩展名为．tmp。如果设置为0，表示尝试重命名操作次数不受限制，直到文件最终被重命名成功。如果close调用失败，文件可能仍然会处于打开状态，但是文件中的数据将保持完整，文件会在Flume重启后关闭 26 hdfs.retryInterval 180 秒 连续尝试关闭文件的时间间隔。如果设置为0或小于0的数，第一次尝试关闭文件失败后将不会继续尝试关闭文件，文件将保持打开状态或者以“.tmp”扩展名结尾的临时文件。如果设置为0，表示不尝试，相当于于将hdfs.closeTries设置成1 27 serializer TEXT 序列化方式，可选值有TEXT、avro_event或者实现EventSerializer.Builder接口的类 28 kerberosPrincipal - HDFS安全认证kerberos配置 29 kerberosKeytab - HDFS安全认证kerberos配置 30 proxyUser - 代理用户","head":[["meta",{"property":"og:url","content":"https://vuepress-theme-hope-docs-demo.netlify.app/bigdataComponent/flume/08_Flume%E4%B9%8BHDFS-Sink%E7%9A%84%E5%8F%82%E6%95%B0%E8%A7%A3%E6%9E%90%E5%8F%8A%E5%BC%82%E5%B8%B8%E5%A4%84%E7%90%86.html"}],["meta",{"property":"og:site_name","content":"文档演示"}],["meta",{"property":"og:title","content":"08_HDFS-Sink的参数解析及异常处理"}],["meta",{"property":"og:description","content":"一、配置详解 序号 参数名 默认值 描述 1 type Sink类型为hdfs - 2 hdfs.path - HDFS存储路径，支持按照时间分区。集群的NameNode名字：单节点：hdfs://主机名(ip):9000/%Y/%m/%d/%H；HA集群：hdfs://nameservice(高可用NameNode服务名称)/%Y/%m/%d/%H 3 hdfs.filePrefix FlumeData Event输出到HDFS的文件名前缀 4 hdfs.fileSuffix - Event输出到HDFS的文件名后缀 5 hdfs.inUsePrefix - 临时文件的文件名前缀。Flume首先将Event输出到HDFS指定目录的临时文件中，再根据相关规则重命名为目标文件 6 hdfs.inUseSuffix .tmp 临时文件名后缀。 7 hdfs.rollInterval 30 间隔多久将临时文件滚动成最终目标文件，单位：秒。如果设置为0，则表示不根据时间滚动文件。注：滚动(roll)指的是，HDFS Sink将临时文件重命名成最终目标文件，并新打开一个临时文件来写数据 8 hdfs.rollSize 1024 当临时文件达到该大小时，滚动成目标文件，单位：byte。该值设置为0，则表示文件不根据文件大小滚动生成 9 hdfs.rollCount 10 当Event数据达到该数量时，将临时文件滚动生成目标文件。该值设置为0，则表示文件不根据Event数滚动生成 10 hdfs.idleTimeout 0 当目前被打开的临时文件在该参数指定的时间内，没有任何数据写入，则将该临时文件关闭并重命名成目标文件，单位：秒。该值设置为0，则表示禁用此功能，不自动关闭临时文件 11 hdfs.round false 用于HDFS文件按照时间分区，时间戳向下取整 12 hdfs.roundValue 1 当round设置为true，配合roundUnit时间单位一起使用，例如roundUnit值为minute。该值设置为1则表示一分钟之内的数据写到一个文件中，相当于每一分钟生成一个文件 13 hdfs.roundUnit second 按时间分区使用的时间单位，可以选择second（秒）、minute（分钟）、hour（小时）三种粒度的时间单位。示例：a1.sinks.k1.hdfs.path = hdfs://nameservice/flume/events/%y/%m/%d/%H/%M；a1.sinks.k1.hdfs.round = true；a1.sinks.k1.hdfs.roundValue = 10；a1.sinks.k1.hdfs.roundUnit = minute；当时间为2022-04-05 17:38:59时候，hdfs.path依然会被解析为：/flume/events/2022/04/05/17/30；因为设置的是舍弃10分钟内的时间，因此，该目录每10分钟新生成一个 14 hdfs.batchSize 100 每个批次刷写到HDFS的Event数量 15 hdfs.codeC 不采用压缩 文件压缩格式，目前支持的压缩格式有gzip、bzip2、lzo、lzop、snappy 16 hdfs.fileType SequenceFile 文件类型，包括：SequenceFile、DataStream、CompressedStream。该值设置为DataStream，则输出的文件不会进行压缩，不需要设置hdfs.codeC指定压缩格式。该值设置为CompressedStream，则对输出的文件进行压缩，需要设置hdfs.codeC指定压缩格式 17 hdfs.maxOpenFiles 5000 最大允许打开的HDFS文件数，当打开的文件数达到该值，则最早打开的文件将会被关闭 18 hdfs.minBlockReplicas HDFS副本数 写入HDFS文件块的最小副本数。该参数会影响文件的滚动配置，一般将该参数配置成1，才可以按照配置正确滚动文件 19 hdfs.writeFormat Writable 文件的格式，目前可以选择Text或者Writable两种格式 20 hdfs.callTimeout 10000 操作HDFS文件的超时时间，如果需要写入HDFS文件的Event数比较大或者发生了打开、写入、刷新、关闭文件超时的问题，可以根据实际情况适当增大超时时间，单位：毫秒 21 hdfs.threadsPoolSize 10 每个HDFS Sink执行HDFS IO操作打开的线程数 22 hdfs.rollTimerPoolSize 1 HDFS Sink根据时间滚动生成文件时启动的线程数 23 hdfs.timeZone Local Time本地时间 写入HDFS文件使用的时区 24 hdfs.useLocalTimeStamp false 是否使用本地时间替换Event头信息中的时间戳 25 hdfs.closeTries 0 在发起关闭尝试后，尝试重命名临时文件的次数。如果设置为1，表示重命名一次失败后不再继续尝试重命名操作，此时待处理的文件将处于打开状态，扩展名为．tmp。如果设置为0，表示尝试重命名操作次数不受限制，直到文件最终被重命名成功。如果close调用失败，文件可能仍然会处于打开状态，但是文件中的数据将保持完整，文件会在Flume重启后关闭 26 hdfs.retryInterval 180 秒 连续尝试关闭文件的时间间隔。如果设置为0或小于0的数，第一次尝试关闭文件失败后将不会继续尝试关闭文件，文件将保持打开状态或者以“.tmp”扩展名结尾的临时文件。如果设置为0，表示不尝试，相当于于将hdfs.closeTries设置成1 27 serializer TEXT 序列化方式，可选值有TEXT、avro_event或者实现EventSerializer.Builder接口的类 28 kerberosPrincipal - HDFS安全认证kerberos配置 29 kerberosKeytab - HDFS安全认证kerberos配置 30 proxyUser - 代理用户"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-06-22T07:07:56.000Z"}],["meta",{"property":"article:author","content":"xiaovin"}],["meta",{"property":"article:published_time","content":"2023-04-01T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2023-06-22T07:07:56.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"08_HDFS-Sink的参数解析及异常处理\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2023-04-01T00:00:00.000Z\\",\\"dateModified\\":\\"2023-06-22T07:07:56.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"xiaovin\\"}]}"]]},"headers":[{"level":2,"title":"一、配置详解","slug":"一、配置详解","link":"#一、配置详解","children":[]},{"level":2,"title":"二、简单模板","slug":"二、简单模板","link":"#二、简单模板","children":[]},{"level":2,"title":"三、注意事项及异常","slug":"三、注意事项及异常","link":"#三、注意事项及异常","children":[]}],"git":{"createdTime":1687417676000,"updatedTime":1687417676000,"contributors":[{"name":"v_yangjiahao01","email":"v_yangjiahao01@baidu.com","commits":1}]},"readingTime":{"minutes":7.83,"words":2349},"filePathRelative":"bigdataComponent/flume/08_Flume之HDFS-Sink的参数解析及异常处理.md","localizedDate":"2023年4月1日","excerpt":"<h2> 一、配置详解</h2>\\n<table>\\n<thead>\\n<tr>\\n<th>序号</th>\\n<th>参数名</th>\\n<th>默认值</th>\\n<th>描述</th>\\n</tr>\\n</thead>\\n<tbody>\\n<tr>\\n<td>1</td>\\n<td>type</td>\\n<td>Sink类型为hdfs</td>\\n<td>-</td>\\n</tr>\\n<tr>\\n<td>2</td>\\n<td>hdfs.path</td>\\n<td>-</td>\\n<td>HDFS存储路径，支持按照时间分区。集群的NameNode名字：单节点：hdfs://主机名(ip):9000/%Y/%m/%d/%H；HA集群：hdfs://nameservice(高可用NameNode服务名称)/%Y/%m/%d/%H</td>\\n</tr>\\n<tr>\\n<td>3</td>\\n<td>hdfs.filePrefix</td>\\n<td>FlumeData</td>\\n<td>Event输出到HDFS的文件名前缀</td>\\n</tr>\\n<tr>\\n<td>4</td>\\n<td>hdfs.fileSuffix</td>\\n<td>-</td>\\n<td>Event输出到HDFS的文件名后缀</td>\\n</tr>\\n<tr>\\n<td>5</td>\\n<td>hdfs.inUsePrefix</td>\\n<td>-</td>\\n<td>临时文件的文件名前缀。Flume首先将Event输出到HDFS指定目录的临时文件中，再根据相关规则重命名为目标文件</td>\\n</tr>\\n<tr>\\n<td>6</td>\\n<td>hdfs.inUseSuffix</td>\\n<td>.tmp</td>\\n<td>临时文件名后缀。</td>\\n</tr>\\n<tr>\\n<td>7</td>\\n<td>hdfs.rollInterval</td>\\n<td>30</td>\\n<td>间隔多久将临时文件滚动成最终目标文件，单位：秒。如果设置为0，则表示不根据时间滚动文件。注：滚动(roll)指的是，HDFS Sink将临时文件重命名成最终目标文件，并新打开一个临时文件来写数据</td>\\n</tr>\\n<tr>\\n<td>8</td>\\n<td>hdfs.rollSize</td>\\n<td>1024</td>\\n<td>当临时文件达到该大小时，滚动成目标文件，单位：byte。该值设置为0，则表示文件不根据文件大小滚动生成</td>\\n</tr>\\n<tr>\\n<td>9</td>\\n<td>hdfs.rollCount</td>\\n<td>10</td>\\n<td>当Event数据达到该数量时，将临时文件滚动生成目标文件。该值设置为0，则表示文件不根据Event数滚动生成</td>\\n</tr>\\n<tr>\\n<td>10</td>\\n<td>hdfs.idleTimeout</td>\\n<td>0</td>\\n<td>当目前被打开的临时文件在该参数指定的时间内，没有任何数据写入，则将该临时文件关闭并重命名成目标文件，单位：秒。该值设置为0，则表示禁用此功能，不自动关闭临时文件</td>\\n</tr>\\n<tr>\\n<td>11</td>\\n<td>hdfs.round</td>\\n<td>false</td>\\n<td>用于HDFS文件按照时间分区，时间戳向下取整</td>\\n</tr>\\n<tr>\\n<td>12</td>\\n<td>hdfs.roundValue</td>\\n<td>1</td>\\n<td>当round设置为true，配合roundUnit时间单位一起使用，例如roundUnit值为minute。该值设置为1则表示一分钟之内的数据写到一个文件中，相当于每一分钟生成一个文件</td>\\n</tr>\\n<tr>\\n<td>13</td>\\n<td>hdfs.roundUnit</td>\\n<td>second</td>\\n<td>按时间分区使用的时间单位，可以选择second（秒）、minute（分钟）、hour（小时）三种粒度的时间单位。示例：a1.sinks.k1.hdfs.path = hdfs://nameservice/flume/events/%y/%m/%d/%H/%M；a1.sinks.k1.hdfs.round = true；a1.sinks.k1.hdfs.roundValue = 10；a1.sinks.k1.hdfs.roundUnit = minute；当时间为2022-04-05 17:38:59时候，hdfs.path依然会被解析为：/flume/events/2022/04/05/17/30；因为设置的是舍弃10分钟内的时间，因此，该目录每10分钟新生成一个</td>\\n</tr>\\n<tr>\\n<td>14</td>\\n<td>hdfs.batchSize</td>\\n<td>100</td>\\n<td>每个批次刷写到HDFS的Event数量</td>\\n</tr>\\n<tr>\\n<td>15</td>\\n<td>hdfs.codeC</td>\\n<td>不采用压缩</td>\\n<td>文件压缩格式，目前支持的压缩格式有gzip、bzip2、lzo、lzop、snappy</td>\\n</tr>\\n<tr>\\n<td>16</td>\\n<td>hdfs.fileType</td>\\n<td>SequenceFile</td>\\n<td>文件类型，包括：SequenceFile、DataStream、CompressedStream。该值设置为DataStream，则输出的文件不会进行压缩，不需要设置hdfs.codeC指定压缩格式。该值设置为CompressedStream，则对输出的文件进行压缩，需要设置hdfs.codeC指定压缩格式</td>\\n</tr>\\n<tr>\\n<td>17</td>\\n<td>hdfs.maxOpenFiles</td>\\n<td>5000</td>\\n<td>最大允许打开的HDFS文件数，当打开的文件数达到该值，则最早打开的文件将会被关闭</td>\\n</tr>\\n<tr>\\n<td>18</td>\\n<td>hdfs.minBlockReplicas</td>\\n<td>HDFS副本数</td>\\n<td>写入HDFS文件块的最小副本数。该参数会影响文件的滚动配置，一般将该参数配置成1，才可以按照配置正确滚动文件</td>\\n</tr>\\n<tr>\\n<td>19</td>\\n<td>hdfs.writeFormat</td>\\n<td>Writable</td>\\n<td>文件的格式，目前可以选择Text或者Writable两种格式</td>\\n</tr>\\n<tr>\\n<td>20</td>\\n<td>hdfs.callTimeout</td>\\n<td>10000</td>\\n<td>操作HDFS文件的超时时间，如果需要写入HDFS文件的Event数比较大或者发生了打开、写入、刷新、关闭文件超时的问题，可以根据实际情况适当增大超时时间，单位：毫秒</td>\\n</tr>\\n<tr>\\n<td>21</td>\\n<td>hdfs.threadsPoolSize</td>\\n<td>10</td>\\n<td>每个HDFS Sink执行HDFS IO操作打开的线程数</td>\\n</tr>\\n<tr>\\n<td>22</td>\\n<td>hdfs.rollTimerPoolSize</td>\\n<td>1</td>\\n<td>HDFS Sink根据时间滚动生成文件时启动的线程数</td>\\n</tr>\\n<tr>\\n<td>23</td>\\n<td>hdfs.timeZone</td>\\n<td>Local Time本地时间</td>\\n<td>写入HDFS文件使用的时区</td>\\n</tr>\\n<tr>\\n<td>24</td>\\n<td>hdfs.useLocalTimeStamp</td>\\n<td>false</td>\\n<td>是否使用本地时间替换Event头信息中的时间戳</td>\\n</tr>\\n<tr>\\n<td>25</td>\\n<td>hdfs.closeTries</td>\\n<td>0</td>\\n<td>在发起关闭尝试后，尝试重命名临时文件的次数。如果设置为1，表示重命名一次失败后不再继续尝试重命名操作，此时待处理的文件将处于打开状态，扩展名为．tmp。如果设置为0，表示尝试重命名操作次数不受限制，直到文件最终被重命名成功。如果close调用失败，文件可能仍然会处于打开状态，但是文件中的数据将保持完整，文件会在Flume重启后关闭</td>\\n</tr>\\n<tr>\\n<td>26</td>\\n<td>hdfs.retryInterval</td>\\n<td>180 秒</td>\\n<td>连续尝试关闭文件的时间间隔。如果设置为0或小于0的数，第一次尝试关闭文件失败后将不会继续尝试关闭文件，文件将保持打开状态或者以“.tmp”扩展名结尾的临时文件。如果设置为0，表示不尝试，相当于于将hdfs.closeTries设置成1</td>\\n</tr>\\n<tr>\\n<td>27</td>\\n<td>serializer</td>\\n<td>TEXT</td>\\n<td>序列化方式，可选值有TEXT、avro_event或者实现EventSerializer.Builder接口的类</td>\\n</tr>\\n<tr>\\n<td>28</td>\\n<td>kerberosPrincipal</td>\\n<td>-</td>\\n<td>HDFS安全认证kerberos配置</td>\\n</tr>\\n<tr>\\n<td>29</td>\\n<td>kerberosKeytab</td>\\n<td>-</td>\\n<td>HDFS安全认证kerberos配置</td>\\n</tr>\\n<tr>\\n<td>30</td>\\n<td>proxyUser</td>\\n<td>-</td>\\n<td>代理用户</td>\\n</tr>\\n</tbody>\\n</table>","copyright":{"author":"xiaovin"},"autoDesc":true}');export{t as data};
