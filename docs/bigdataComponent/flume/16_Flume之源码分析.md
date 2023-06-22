---
# 这是文章的标题
title: 16_源码分析
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


[Flume 1.9.0 源码解析 : TailDirSource 全解_flume taildir详解_张伯毅的博客-CSDN博客](https://zhangboyi.blog.csdn.net/article/details/89879367?spm=1001.2014.3001.5506)

## 启动流程

1、从程序启动入口(org.apache.flume.node.Application 的main方法)开始

1. 解析命令行参数
2. 配置文件指定方式分为从zookeeper获取(-z)和直接读取文件(-f)两种，比如上面的就是直接读取配置文件

```java
// Zookeeper方式，需要传递zookeeper集群的endpoint和基础路径，flume会组合基础路径和agent名称获取该agent的配置文件
StaticZooKeeperConfigurationProvider zookeeperConfigurationProvider =
    new StaticZooKeeperConfigurationProvider(
        agentName, zkConnectionStr, baseZkPath);
application = new Application();
application.handleConfigurationEvent(zookeeperConfigurationProvider.getConfiguration());

// 读文件方式
PropertiesFileConfigurationProvider configurationProvider =
    new PropertiesFileConfigurationProvider(agentName, configurationFile);
application = new Application();
application.handleConfigurationEvent(configurationProvider.getConfiguration());
```

3. 配置热加载

flume启动时支持两种配置加载方式：

1. 配置信息可以通过文件或 ZooKeeper 的方式进行读取，两种方式都支持热加载，即我们不需要重启 Agent 就可以更新配置内容：
   - 基于文件的配置热加载是通过一个后台线程对文件进行轮询实现的；
   - 基于 ZooKeeper 的热加载则是使用了 Curator 的 NodeCache 模式，底层是 ZooKeeper 原生的监听（Watch）特性。


1. 如果配置热更新是开启的（默认开启），配置提供方 ConfigurationProvider 就会将自身注册到 Agent 程序的组件列表中，并在 Application#start 方法调用后，由 LifecycleSupervisor 类进行启动和管理，加载和解析配置文件，从中读取组件列表。
2. 如果热更新未开启，则配置提供方将在启动时立刻读取配置文件，并由 LifecycleSupervisor 启动和管理所有组件。

以文件方式热加载配置：

```java
if (reload) {
    EventBus eventBus = new EventBus(agentName + "-event-bus");
    PollingPropertiesFileConfigurationProvider configurationProvider =
             new PollingPropertiesFileConfigurationProvider(agentName, configurationFile, eventBus, 30);
    components.add(configurationProvider);
    application = new Application(components);
    eventBus.register(application);
}
```

PollingPropertiesFileConfigurationProvider会定期加载配置文件，当文件内容更新时，它会将配置内容解析成 MaterializedConfiguration 实例，这个对象实例中包含了Source、Sink、Channel组件的所有信息。随后，这个轮询线程会通过 Guava 的 EventBus 机制通知 Application 类配置发生了更新，从而触发 Application#handleConfigurationEvent 方法，重新加载所有的组件。

3. 配置文件默认支持热加载，即不用重启flume agent就能自动感知配置文件的变化。使用zookeeper的方式使用了[Curator](https://www.jianshu.com/p/70151fc0ef5d) ，底层基于zookeeper原生的监听机制，使用配置文件的方式则是通过后台线程轮询

```java
// zookeeper方式
agentNodeCache = new NodeCache(client, basePath + "/" + getAgentName());
agentNodeCache.start();
agentNodeCache.getListenable().addListener(new NodeCacheListener() {
  @Override
  public void nodeChanged() throws Exception {
    refreshConfiguration();
  }
});

private void refreshConfiguration() throws IOException {
  LOGGER.info("Refreshing configuration from ZooKeeper");
  byte[] data = null;
  ChildData childData = agentNodeCache.getCurrentData();
  if (childData != null) {
    data = childData.getData();
  }
  // 将最新的配置保存在成员变量中，下一次获取flume配置直接返回该成员变量
  flumeConfiguration = configFromBytes(data);
  eventBus.post(getConfiguration());
}

// 配置文件方式
public class PollingPropertiesFileConfigurationProvider
    extends PropertiesFileConfigurationProvider
    implements LifecycleAware {
  @Override
  public void start() {
    executorService = Executors.newSingleThreadScheduledExecutor(
            new ThreadFactoryBuilder().setNameFormat("conf-file-poller-%d")
                .build());
    // FileWatcherRunnable 是 PollingPropertiesFileConfigurationProvider 的一个内部类
    FileWatcherRunnable fileWatcherRunnable =
        new FileWatcherRunnable(file, counterGroup);
    // 启动一个线程每隔30秒检查一次，如果发现文件修改时间和记录的值不一样，则重新获取一次配置
    executorService.scheduleWithFixedDelay(fileWatcherRunnable, 0, interval,
        TimeUnit.SECONDS);
  }
}
```

4. 重新加载的配置文件如何自动生效？这个挺有意思的

- 在org.apache.flume.node.Application 文件中定义有如下方法，注意上面有 Subscribe 注解。其实该方法就是flume对配置变更这一事件的handler。具体逻辑就是先停掉所有的components然后再使用最新的配置文件启动所有的components

```java
@Subscribe
public void handleConfigurationEvent(MaterializedConfiguration conf) {
  try {
    lifecycleLock.lockInterruptibly();
    stopAllComponents();
    startAllComponents(conf);
  } catch (InterruptedException e) {
    logger.info("Interrupted while trying to handle configuration event");
    return;
  } finally {
    // If interrupted while trying to lock, we don't own the lock, so must not attempt to unlock
    if (lifecycleLock.isHeldByCurrentThread()) {
      lifecycleLock.unlock();
    }
  }
}
```

- 那如何触发这一事件呢？或者说配置变更的时候如何调用这个函数呢？此处用到了guava中的EventBus
  - 首先显式调用eventbus的register方法将application进行注册，注册的时候会通过反射获取application所述类中携带有Subscribe注解的方法。并将方法进行封装保存到EventBus中的 handlersByType 成员变量中。

```java
public void register(Object object) {
  handlersByType.putAll(finder.findAllHandlers(object));
}

@Override
public Multimap<Class<?>, EventHandler> findAllHandlers(Object listener) {
  Multimap<Class<?>, EventHandler> methodsInListener =
      HashMultimap.create();
  Class clazz = listener.getClass();
  while (clazz != null) {
    for (Method method : clazz.getMethods()) {
      Subscribe annotation = method.getAnnotation(Subscribe.class);

      if (annotation != null) {
        Class<?>[] parameterTypes = method.getParameterTypes();
        if (parameterTypes.length != 1) {
          throw new IllegalArgumentException(
              "Method " + method + " has @Subscribe annotation, but requires " +
              parameterTypes.length + " arguments.  Event handler methods " +
              "must require a single argument.");
        }
        Class<?> eventType = parameterTypes[0];
        EventHandler handler = makeHandler(listener, method);

        methodsInListener.put(eventType, handler);
      }
    }
    clazz = clazz.getSuperclass();
  }
  return methodsInListener;
}
```

- 在感知到配置文件发生变动之后，会主动调用eventbus中的post方法，执行对应的handler方法。以zookeeper启动方式为例，说明如下：

```java
private void refreshConfiguration() throws IOException {
  eventBus.post(getConfiguration());
}
// post 方法调用dispatchQueuedEvents方法，其中的方法主要做的就是执行上面注册的handler。即handleConfigurationEvent方法
public void post(Object event) {
  dispatchQueuedEvents();
}
```

5. 通过配置文件启动不同的组件，其实就是先暂停所有的组件（如果有的话），然后启动所有的组件

- 启动所有的Channel，并阻塞等待所有Channel启动成功。flume使用一个监督者启动所有组件，这样做可以非常方便管理所有组件的生命周期。

```java
for (Entry<String, Channel> entry :
    materializedConfiguration.getChannels().entrySet()) {
  try {
    logger.info("Starting Channel " + entry.getKey());
    supervisor.supervise(entry.getValue(),
        new SupervisorPolicy.AlwaysRestartPolicy(), LifecycleState.START);
  } catch (Exception e) {
    logger.error("Error while starting {}", entry.getValue(), e);
  }
}

// 等待所有的Channel状态都是启动成功，才会执行后续的启动Sink和Source的逻辑
for (Channel ch : materializedConfiguration.getChannels().values()) {
  while (ch.getLifecycleState() != LifecycleState.START
      && !supervisor.isComponentInErrorState(ch)) {
    try {
      logger.info("Waiting for channel: " + ch.getName() +
          " to start. Sleeping for 500 ms");
      Thread.sleep(500);
    } catch (InterruptedException e) {
      logger.error("Interrupted while waiting for channel to start.", e);
      Throwables.propagate(e);
    }
  }
}

// 注意此处的synchronized，说明此处考虑到了并发场景
public synchronized void supervise(LifecycleAware lifecycleAware,
    SupervisorPolicy policy, LifecycleState desiredState) {
  // 只允许启动一次
  Preconditions.checkState(!supervisedProcesses.containsKey(lifecycleAware),
      "Refusing to supervise " + lifecycleAware + " more than once");

  Supervisoree process = new Supervisoree();
  process.status = new Status();

  process.policy = policy;
  process.status.desiredState = desiredState;
  process.status.error = false;

  MonitorRunnable monitorRunnable = new MonitorRunnable();
  monitorRunnable.lifecycleAware = lifecycleAware;
  monitorRunnable.supervisoree = process;
  monitorRunnable.monitorService = monitorService;

  // 将组件和对组件的监控逻辑保存到Map中
  supervisedProcesses.put(lifecycleAware, process);

  ScheduledFuture<?> future = monitorService.scheduleWithFixedDelay(
      monitorRunnable, 0, 3, TimeUnit.SECONDS);
  monitorFutures.put(lifecycleAware, future);
}
```

组件的start方法是在 MonitorRunnable 的run方法中调用的，MonitorRunnable 是一个线程，run方法中会获取当前组件的状态(默认STOP)以及预期的状态(START)，如果不相等则通过预期的状态执行相应的逻辑（ETCD直呼内行~~~）

```java
public static class MonitorRunnable implements Runnable {
    @Override
    public void run() {
        synchronized (lifecycleAware) {
          if (!lifecycleAware.getLifecycleState().equals(
              supervisoree.status.desiredState)) {
            switch (supervisoree.status.desiredState) {
              case START:
                try {
                  lifecycleAware.start();
                } catch (Throwable e) {
                  supervisoree.status.failures++;
                }
                break;
              case STOP:
                try {
                  lifecycleAware.stop();
                } catch (Throwable e) {
                  supervisoree.status.failures++;
                }
                break;
              default:
                logger.warn("I refuse to acknowledge {} as a desired state",
                    supervisoree.status.desiredState);
            }
          }
        }
      } 
    }
  }
```

比如上面栗子中的MemoryChannel，看一下start方法到底做了那些操作。start方法其实就是开启了一个计数器，当有其他组件从中获取数据(Event对象)的时候，take_count原子加一；同理当有其他组件向它写入数据的时候，put_count原子加一。

```java
public interface Channel extends LifecycleAware, NamedComponent {
    public void put(Event event) throws ChannelException;
    public Event take() throws ChannelException;
    public Transaction getTransaction();
}

public interface Event {
    // 消息的元数据
	public Map<String, String> getHeaders();
	// 消息数据本身
    public byte[] getBody();
}

@Override
public synchronized void start() {
  channelCounter.start();
  channelCounter.setChannelSize(queue.size());
  channelCounter.setChannelCapacity(Long.valueOf(
          queue.size() + queue.remainingCapacity()));
  super.start();
}
```

1. 1. 启动所有的Sink，结合BCC具体使用场景重点看一下HTTP和Kafka
   2. 启动所有的Source，结合BCC具体使用场景重点看一下tail -f 日志这种功能方式

## Sink_HTTP

1. 先看一下Sink接口支持的方法，其中process是最重要的方法

```java
public interface Sink extends LifecycleAware, NamedComponent {
    public void setChannel(Channel channel);
    public Channel getChannel();
    public Status process() throws EventDeliveryException;
    public static enum Status {
      READY, BACKOFF
    }
}
```

1. 查看HttpSink的start方法，发现其也是启动了一个原子计数器而已

```java
@Override
public final void start() {
  LOG.info("Starting HttpSink");
  sinkCounter.start();
}
```

1. 重点看一下process方法，在该方法中使用到了事务。官方建议使用MemoryTransaction，依靠两个LinkedBlockingDeque（putList和takeList）来实现事务的开始、提交和回滚。也比较好理解，take的时候把数据从queue中转移到takeList中，如果正常提交就清空takeList，如果回滚就把takeList中的数据塞回queue中去。queue是一个双端队列，回滚的时候采用头插法。

```java
@Override
public final Status process() throws EventDeliveryException {
  Channel ch = getChannel();
  // txn是一个ThrealLocal的成员变量
  Transaction txn = ch.getTransaction();
  txn.begin();

  try {
    Event event = ch.take();
    HttpURLConnection connection = connectionBuilder.getConnection();
    outputStream = connection.getOutputStream();
    outputStream.write(eventBody);
    outputStream.flush();
    outputStream.close();
	// 根据HTTP返回的状态码判断是否需要回滚，如果回滚就会把takeList中的数据重新塞入到queue中
    int httpStatusCode = connection.getResponseCode();
    if (httpStatusCode >= HTTP_STATUS_CONTINUE) {
      if (shouldRollback) {
        txn.rollback();
      } else {
        txn.commit();
      }
    }
  return status;
}
```

## Sink_Kafka

1. 同理查看KafkaSink的start方法，代码如下。可以看到除了启动计数器之外还构造了KafkaProducer对象，该对象由KafkaClient包提供

```java
@Override
public synchronized void start() {
  // instantiate the producer
  producer = new KafkaProducer<String,byte[]>(kafkaProps);
  counter.start();
  super.start();
}
```

1. 同理查看一下process方法，和HTTPSink相比不同之处就是使用了上面构造的KafkaProducer来异步传递消息。send完成之后还需要for循环FutureList来等待发送完成。

```java
@Override
public Status process() throws EventDeliveryException {
  Status result = Status.READY;
  Channel channel = getChannel();
  Transaction transaction = null;
  transaction = channel.getTransaction();
  transaction.begin();

  kafkaFutures.clear();
  for (; processedEvents < batchSize; processedEvents += 1) {
    event = channel.take();
    kafkaFutures.add(producer.send(record, new SinkCallback(startTime)));
  }
  //Prevent linger.ms from holding the batch
  producer.flush();

  // publish batch and commit.
  if (processedEvents > 0) {
    for (Future<RecordMetadata> future : kafkaFutures) {
      future.get();
    }
  }
  transaction.commit();
  return result;
}
```

## Source_tail

1. 查看ExecSource的start方法，代码如下。构造SingleThreadExecutor启动线程从执行的命令中获取消息，并将消息定时批量写入到Channel中

```java
@Override
public void start() {
  // Start the counter before starting any threads that may access it.
  sourceCounter.start();

  executor = Executors.newSingleThreadExecutor();
  runner = new ExecRunnable(shell, command, getChannelProcessor(), sourceCounter, restart,
                            restartThrottle, logStderr, bufferCount, batchTimeout, charset);

  // Start the runner thread.
  runnerFuture = executor.submit(runner);

  // Mark the Source as RUNNING.
  super.start();
}
```

1. 启动的线程执行的逻辑如下

```java
@Override
public void run() {
  String[] commandArgs = formulateShellCommand(shell, command);
  process = Runtime.getRuntime().exec(commandArgs);
  reader = new BufferedReader(
      new InputStreamReader(process.getInputStream(), charset));

  // 新起一个线程，将eventList中的时间每隔3秒批量写入到channel中
  future = timedFlushService.scheduleWithFixedDelay(new Runnable() {
      @Override
      public void run() {
        try {
          synchronized (eventList) {
            if (!eventList.isEmpty() && timeout()) {
              flushEventBatch(eventList);
            }
          }
        } catch (Exception e) {
          logger.error("Exception occurred when processing event batch", e);
          if (e instanceof InterruptedException) {
            Thread.currentThread().interrupt();
          }
        }
      }
  },
  batchTimeout, batchTimeout, TimeUnit.MILLISECONDS);

  // 从执行命令获取的结果中获取line并封装成event保存到eventList中
  while ((line = reader.readLine()) != null) {
    sourceCounter.incrementEventReceivedCount();
    synchronized (eventList) {
      eventList.add(EventBuilder.withBody(line.getBytes(charset)));
      if (eventList.size() >= bufferCount || timeout()) {
        flushEventBatch(eventList);
      }
    }
  }
}
```

## 流程串联

上面分析了一个agent中不同组件内部的处理逻辑，现在有一个问题现在需要将其串联起来。从源端开始，源端怎么直到该把收集的event传递给哪一个Channel；sink端如何直到该从哪一个channel中获取消息呢？

1、查看配置文件，其中由这么一段。怀疑是此处的配置将不同的组件串联起来了

```java
# 设置源和目的端的channel，把其联通起来
a1.sources.r1.channels = c1
a1.sinks.k1.channel = c1
```

2、下面分析代码中如何解析这一段的配置，以静态文件配置方式为例

1. 读取文件构造Properties，FlumeConfiguration 的构造函数中会将Properties中类似k-v结构的数据转换成以agentName为key， AgentConfiguration 为value的一个map。AgentConfiguration这个结构体中保存有这个agent相关source、channel、sink信息

```java
@Override
public FlumeConfiguration getFlumeConfiguration() {
  BufferedReader reader = null;
  reader = new BufferedReader(new FileReader(file));
  String resolverClassName = System.getProperty("propertiesImplementation",
      DEFAULT_PROPERTIES_IMPLEMENTATION);
  Class<? extends Properties> propsclass = Class.forName(resolverClassName)
      .asSubclass(Properties.class);
  Properties properties = propsclass.newInstance();
  properties.load(reader);
  return new FlumeConfiguration(toMap(properties));
}
```

1. 将properties中的数据转换为AgentConfiguration

```java
private boolean addRawProperty(String rawName, String rawValue) {
  String configKey = name.substring(index + 1);

  AgentConfiguration aconf = agentConfigMap.get(agentName);
  // 首次查不到该agent相关的配置则新增一个
  if (aconf == null) {
    aconf = new AgentConfiguration(agentName, errors);
    agentConfigMap.put(agentName, aconf);
  }
  // 将配置文件中的数据写入到AgentConfiguration中
  return aconf.addProperty(configKey, value);
}

private boolean addProperty(String key, String value) {
  // 将source写入到agentConfiguration的成员变量中
  if (CONFIG_SOURCES.equals(key)) {
    if (sources == null) {
      sources = value;
      return true;
    } 
  }

  // 将sink写入到agentConfiguration的成员变量中
  if (CONFIG_SINKS.equals(key)) {
    if (sinks == null) {
      sinks = value;
      LOGGER.info("Added sinks: {} Agent: {}", sinks, agentName);
      return true;
    } 
  }

  // 将channel写入到agentConfiguration的成员变量中
  if (CONFIG_CHANNELS.equals(key)) {
    if (channels == null) {
      channels = value;

      return true;
    } 
  }
}
```

1. 根据agentConfiguration将channel、source、sink加载到三个hashMap中

```java
loadChannels(agentConf, channelComponentMap);
loadSources(agentConf, channelComponentMap, sourceRunnerMap);
loadSinks(agentConf, channelComponentMap, sinkRunnerMap);
```

1. 1. 先加载channel，代码太长了，但本质做的就是从agentConfiguration中读取配置写入到channelComponentMap中
   2. 将上面加载好的channelComponentMap作为参数加载Source，在加载的过程中会设置该source的channel为配置中指定的channel

```java
source.setChannelProcessor(channelProcessor);
```

1. 1. 将上面加载好的channelComponentMap作为参数加载Sink，同理在加载的过程中也会将设置该sink的Channel为配置中指定名称的channel
2. 将SourceRunner和SinkRunner保存到hashMap中，然后在启动组件的时候调用SinkRunner的start方法，此时会启动一个线程定时执行Sink的process方法

```java
sinkRunnerMap.put(comp.getComponentName(),
    new SinkRunner(group.getProcessor()));


for (Map.Entry<String, SourceRunner> entry : sourceRunnerMap.entrySet()) {
  conf.addSourceRunner(entry.getKey(), entry.getValue());
}
for (Map.Entry<String, SinkRunner> entry : sinkRunnerMap.entrySet()) {
  conf.addSinkRunner(entry.getKey(), entry.getValue());
}


@Override
public void start() {
  SinkProcessor policy = getPolicy();

  policy.start();

  runner = new PollingRunner();

  runner.policy = policy;
  runner.counterGroup = counterGroup;
  runner.shouldStop = new AtomicBoolean();

  runnerThread = new Thread(runner);
  runnerThread.setName("SinkRunner-PollingRunner-" +
      policy.getClass().getSimpleName());
  runnerThread.start();

  lifecycleState = LifecycleState.START;
}
```

1. 同理，在启动组件的时候也会调用SourceRunner的start方法，Source分为 PollableSource 和 EventDrivenSource 两种类型，因此SourceRunner也分为定时触发和事件触发两种，比如ExecSource就是事件触发

```java
@Override
public void start() {
  Source source = getSource();
  ChannelProcessor cp = source.getChannelProcessor();
  cp.initialize();
  source.start();
  lifecycleState = LifecycleState.START;
}
```