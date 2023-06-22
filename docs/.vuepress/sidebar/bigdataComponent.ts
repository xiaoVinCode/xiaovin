import {arraySidebar} from "vuepress-theme-hope";

export const bigdataComponent = arraySidebar([
    {
        text: "数据集成",
        icon: "tree",
        collapsible: true,
        children :[
            {
                text: "Flume",
                prefix: "flume/",
                icon: "Apache",
                collapsible: true,
                children: [
                    "01_Flume之介绍入门",
                    "02_Flume之各种Source的介绍及参数解析",
                    "03_Flume之TaildirSource参数解析",
                    "04_Flume之HTTPSource参数解析",
                    "05_Flume之KafkaSource参数解析",
                    "06_Flume之各种Channel的介绍及参数解析",
                    "07_Flume之Channel的selector",
                    "08_Flume之HDFS-Sink的参数解析及异常处理",
                    "09_Flume之Sink的Processors",
                    "10_Flume之拦截器",
                    "11_Flume之启动任务脚本",
                    "12_Flume之连接ACL的Kafka",
                    "13_Flume之监控",
                    "14_Flume之事务",
                    "15_Flume之TailSource源码修改(修复Flume任务故障文件重命名数据丢失)",
                    "16_Flume之源码分析",
                    "17_Flume之面试题",
                ]
            }
        ]
    },
]);
