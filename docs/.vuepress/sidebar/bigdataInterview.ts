import {arraySidebar} from "vuepress-theme-hope";

export const bigdataInterview = arraySidebar([
    {
        text: "数据集成",
        icon: "launch",
        collapsible: true,
        children :[
            {
                text: "Flume",
                prefix: "flume/",
                icon: "Apache",
                collapsible: true,
                children: [
                    "17_Flume之面试题",
                ]
            }
        ]
    },
]);
