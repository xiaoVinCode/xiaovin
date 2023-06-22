const e=JSON.parse('{"key":"v-acceceee","path":"/bigdataComponent/flume/16_Flume%E4%B9%8B%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90.html","title":"16_源码分析","lang":"zh-CN","frontmatter":{"title":"16_源码分析","order":1,"author":"xiaovin","date":"2023-04-01T00:00:00.000Z","category":["数据集成"],"sticky":true,"star":true,"description":"Flume 1.9.0 源码解析 : TailDirSource 全解_flume taildir详解_张伯毅的博客-CSDN博客 启动流程 1、从程序启动入口(org.apache.flume.node.Application 的main方法)开始 解析命令行参数 配置文件指定方式分为从zookeeper获取(-z)和直接读取文件(-f)两种，比如上面的就是直接读取配置文件","head":[["meta",{"property":"og:url","content":"https://vuepress-theme-hope-docs-demo.netlify.app/bigdataComponent/flume/16_Flume%E4%B9%8B%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90.html"}],["meta",{"property":"og:site_name","content":"文档演示"}],["meta",{"property":"og:title","content":"16_源码分析"}],["meta",{"property":"og:description","content":"Flume 1.9.0 源码解析 : TailDirSource 全解_flume taildir详解_张伯毅的博客-CSDN博客 启动流程 1、从程序启动入口(org.apache.flume.node.Application 的main方法)开始 解析命令行参数 配置文件指定方式分为从zookeeper获取(-z)和直接读取文件(-f)两种，比如上面的就是直接读取配置文件"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-06-22T07:07:56.000Z"}],["meta",{"property":"article:author","content":"xiaovin"}],["meta",{"property":"article:published_time","content":"2023-04-01T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2023-06-22T07:07:56.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"16_源码分析\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2023-04-01T00:00:00.000Z\\",\\"dateModified\\":\\"2023-06-22T07:07:56.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"xiaovin\\"}]}"]]},"headers":[{"level":2,"title":"启动流程","slug":"启动流程","link":"#启动流程","children":[]},{"level":2,"title":"Sink_HTTP","slug":"sink-http","link":"#sink-http","children":[]},{"level":2,"title":"Sink_Kafka","slug":"sink-kafka","link":"#sink-kafka","children":[]},{"level":2,"title":"Source_tail","slug":"source-tail","link":"#source-tail","children":[]},{"level":2,"title":"流程串联","slug":"流程串联","link":"#流程串联","children":[]}],"git":{"createdTime":1687417676000,"updatedTime":1687417676000,"contributors":[{"name":"v_yangjiahao01","email":"v_yangjiahao01@baidu.com","commits":1}]},"readingTime":{"minutes":11.13,"words":3340},"filePathRelative":"bigdataComponent/flume/16_Flume之源码分析.md","localizedDate":"2023年4月1日","excerpt":"<p><a href=\\"https://zhangboyi.blog.csdn.net/article/details/89879367?spm=1001.2014.3001.5506\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">Flume 1.9.0 源码解析 : TailDirSource 全解_flume taildir详解_张伯毅的博客-CSDN博客</a></p>\\n<h2> 启动流程</h2>\\n<p>1、从程序启动入口(org.apache.flume.node.Application 的main方法)开始</p>\\n<ol>\\n<li>解析命令行参数</li>\\n<li>配置文件指定方式分为从zookeeper获取(-z)和直接读取文件(-f)两种，比如上面的就是直接读取配置文件</li>\\n</ol>","copyright":{"author":"xiaovin"},"autoDesc":true}');export{e as data};
