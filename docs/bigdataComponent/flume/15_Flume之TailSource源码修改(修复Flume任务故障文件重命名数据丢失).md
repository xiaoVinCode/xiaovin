---
# 这是文章的标题
title: 15_TailSource源码修改
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

#### 1. 问题-Flume任务故障，文件重命名数据丢失

我们常用TailSource来监听日志文件，被监听的日志文件是常配置了按时间滚动生成方式的，也就是一天一个文件，到零点时会将gather.log更名为gather-20230415.log。

由于 tailSource 是根据 iNode + 文件名称组成唯一键进行监听，并记录偏移量的；

假设，设置Flume任务只监听 gather.log（也可以监听整个日志文件夹，但有问题，看完下面就明白） ，

Flume采集任务在 2023-04-15的22点出现故障，任务挂掉了，运维人员在第二天上午10点才发现并重启服务；

重启服务后，任务从偏移量记录表中找到iNode + gather.log 对应的偏移量，但是日志文件中新生成了 gather.log，原来的已经更名为gather-20230415.log，

任务就重新生成一组唯一键，进行记录偏移量，从头开始采集新的  gather.log 。

这样新数据是可以正常采集的，但是 gather-20230415.log 里的在 22点到 00点 产生的数据我们就没有采集到，这样就产生数据丢失。



如果设置监听文件夹下全部文件，上面情况是不是就导致数据重复。



修复后就直接设置为采集文件夹下的内容(使用正则)



#### 2. 修复

修改 唯一键 只使用iNode，剔除文件名称。

项目结构：

![image-20230415151445251](https://static-resource-yang.oss-cn-shenzhen.aliyuncs.com/typora_pic/202304151514283.png)



org.apache.flume.source.taildir.TailFile

![image-20230415154116727](https://static-resource-yang.oss-cn-shenzhen.aliyuncs.com/typora_pic/202304151541756.png)

org.apache.flume.source.taildir.ReliableTaildirEventReader

![image-20230415154124527](https://static-resource-yang.oss-cn-shenzhen.aliyuncs.com/typora_pic/202304151541571.png)

打包

替换 ${FLUME_HOME}/lib/flume-taildir-source-1.9.0.jar