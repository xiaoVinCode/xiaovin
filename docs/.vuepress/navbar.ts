import {navbar} from "vuepress-theme-hope";

export default navbar([
    "/",
    {text: "大数据组件", icon: "guide", link: "/bigdataComponent"},
    {text: "大数据面试", icon: "launch", link: "/bigdataInterview"},
    {text: "Java八股文", icon: "java", link: "/books/"},
    {
        text: "各个论坛",
        icon: "blog",
        children: [
            {
                text: "公众号",
                icon: "wechat",
                link: "https://mp.weixin.qq.com/cgi-bin/loginpage"
            },
            {
                text: "CSDN",
                icon: "tag",
                link: "https://blog.csdn.net/weixin_40727028?type=blog"
            },
            {
                text: "简书",
                icon: "tag",
                link: "https://www.jianshu.com/u/ffc8f44b1b9f"
            },
            {
                text: "语雀",
                icon: "tag",
                link: "https://www.yuque.com/xiaovin1/yy"
            }
        ]
    },
    {
        text: "网站相关",
        icon: "others",
        children: [
            // {text: "关于作者", icon: "zuozhe", link: "/about-the-author/"},
            {
                text: "更新历史",
                icon: "history",
                link: "/timeline/",
            },
        ],
    },
]);
