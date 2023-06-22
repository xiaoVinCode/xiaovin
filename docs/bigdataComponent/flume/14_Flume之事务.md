---
# 这是文章的标题
title: 14_事务
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


Flume使用两个独立的事务分别负责从soucrce到channel，以及从channel到sink的event传递。一旦事务中所有的event全部传递到channel且提交成功，那么source就将该文件标记为完成。同理，事务以类似的方式处理从channel到sink的传递过程，如果因为某种原因使得event无法记录，那么事务将会回滚，且所有的event都会保持到channel中，等待重新传递。 

Flume的事务机制保证了source产生的每个event都会传送到sink中（如果失败会无限重试），flume采用的是At-least-once的提交方式，这样就造成每个source产生的event至少到达sink一次，这种方式保证了数据的可靠性，但数据可能重复。

Transaction接口定义如下：

```java
public void begin();

public void commit();

public void rollback();

public void close();
```

以MemoryTransaction介绍介绍下事务机制：

![img](https://static-resource-yang.oss-cn-shenzhen.aliyuncs.com/typora_pic/202304151145501.png)

MemoryTransaction是MemoryChannel中的一个内部类，内部有2个阻塞队列putList和takeList，MemoryChannel内部有个queue阻塞队列。putList接收Source交给Channel的event数据，takeList保存Channel交给Sink的event数据。

1. 如果Source交给Channel任务完成，进行commit时，会把putList中的所有event放到MemoryChannel中的queue。
2. 如果Source交给Channel任务失败，进行rollback时，程序就不会继续走下去，比如KafkaSource需要commitOffsets，如果任务失败就不会commitOffsets。
3. 如果Sink处理完Channel带来的event，进行commit的时，会清空takeList中的event数据，因为已经没consume。
4. 如果Sink处理Channel带来的event失败，进行rollback的时，会把takeList中的event写回到queue中。

commit的关键代码：

```java
@Override
protected void doCommit() throws InterruptedException {
  int puts = putList.size();
  int takes = takeList.size();
  synchronized(queueLock) {
    if(puts > 0 ) {
      // 清空putList，丢到外部类MemoryChannel中的queue队列里
      while(!putList.isEmpty()) {
        // MemoryChannel中的queue队列
        if(!queue.offer(putList.removeFirst())) {
          throw new RuntimeException("Queue add failed, this shouldn't be able to happen");
        }
      }
    }
    putList.clear();
    takeList.clear();
  }
}
```

rollback的关键代码

```java
@Override
protected void doRollback() {
  int takes = takeList.size();
  synchronized(queueLock) {
    Preconditions.checkState(queue.remainingCapacity() >= takeList.size(), "Not enough space in memory channel " +
        "queue to rollback takes. This should never happen, please report");
    // 把takeList中的数据放回到queue中
    while(!takeList.isEmpty()) {
      queue.addFirst(takeList.removeLast());
    }
    putList.clear();
  }
}
```