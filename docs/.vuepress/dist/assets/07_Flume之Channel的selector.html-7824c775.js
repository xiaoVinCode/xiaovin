const e=JSON.parse('{"key":"v-f9d99676","path":"/bigdataComponent/flume/07_Flume%E4%B9%8BChannel%E7%9A%84selector.html","title":"07_Channel的selector","lang":"zh-CN","frontmatter":{"title":"07_Channel的selector","order":1,"author":"xiaovin","date":"2023-04-01T00:00:00.000Z","category":["数据集成"],"sticky":true,"star":true,"description":"1. 默认 如果没有手动配置，source的默认channel选择器类型是replicating（复制），当然这个选择器只针对source配置了多个channel的时候。 既然叫做channel选择器，很容易猜得到这是source才有的配置。前面介绍过，一个souce可以向多个channel同时写数据，所以也就产生了以何种方式向多个channel写的问题（比如自带的 复制选择器 ， 会把数据完整地发送到每一个channel，而 多路复用选择器 就可以通过配置来按照一定的规则进行分发，听起来很像负载均衡），channel选择器也就应运而生。","head":[["meta",{"property":"og:url","content":"https://vuepress-theme-hope-docs-demo.netlify.app/bigdataComponent/flume/07_Flume%E4%B9%8BChannel%E7%9A%84selector.html"}],["meta",{"property":"og:site_name","content":"文档演示"}],["meta",{"property":"og:title","content":"07_Channel的selector"}],["meta",{"property":"og:description","content":"1. 默认 如果没有手动配置，source的默认channel选择器类型是replicating（复制），当然这个选择器只针对source配置了多个channel的时候。 既然叫做channel选择器，很容易猜得到这是source才有的配置。前面介绍过，一个souce可以向多个channel同时写数据，所以也就产生了以何种方式向多个channel写的问题（比如自带的 复制选择器 ， 会把数据完整地发送到每一个channel，而 多路复用选择器 就可以通过配置来按照一定的规则进行分发，听起来很像负载均衡），channel选择器也就应运而生。"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-06-22T07:07:56.000Z"}],["meta",{"property":"article:author","content":"xiaovin"}],["meta",{"property":"article:published_time","content":"2023-04-01T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2023-06-22T07:07:56.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"07_Channel的selector\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2023-04-01T00:00:00.000Z\\",\\"dateModified\\":\\"2023-06-22T07:07:56.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"xiaovin\\"}]}"]]},"headers":[],"git":{"createdTime":1687417676000,"updatedTime":1687417676000,"contributors":[{"name":"v_yangjiahao01","email":"v_yangjiahao01@baidu.com","commits":1}]},"readingTime":{"minutes":2.5,"words":751},"filePathRelative":"bigdataComponent/flume/07_Flume之Channel的selector.md","localizedDate":"2023年4月1日","excerpt":"<h4> 1. 默认</h4>\\n<p>如果没有手动配置，source的默认channel选择器类型是replicating（复制），当然这个选择器只针对source配置了多个channel的时候。</p>\\n<blockquote>\\n<p>既然叫做channel选择器，很容易猜得到这是source才有的配置。前面介绍过，一个souce可以向多个channel同时写数据，所以也就产生了以何种方式向多个channel写的问题（比如自带的 <a href=\\"https://flume.liyifeng.org/#id43\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">复制选择器</a> ， 会把数据完整地发送到每一个channel，而 <a href=\\"https://flume.liyifeng.org/#id44\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">多路复用选择器</a> 就可以通过配置来按照一定的规则进行分发，听起来很像负载均衡），channel选择器也就应运而生。</p>\\n</blockquote>","copyright":{"author":"xiaovin"},"autoDesc":true}');export{e as data};
