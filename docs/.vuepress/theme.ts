import {hopeTheme} from "vuepress-theme-hope";
import navbar from "./navbar.js";
import sidebar from "./sidebar/index.js";

export default hopeTheme({
    hostname: "https://xiaoVinCode.github.io/xiaovin",

    iconAssets: "iconfont",
    // iconAssets: "fontawesome-with-brands",

    author: {
        name: "xiaovin",
        url: "https://xiaovin.gitee.io",
    },

    logo: "/logo.svg",

    repo: "https://github.com/xiaoVinCode/xiaovin",
    // repo: "vuepress-theme-hope/vuepress-theme-hope",
    docsDir: "docs",
    docsBranch: "main",
    // 纯净模式：https://theme-hope.vuejs.press/zh/guide/interface/pure.html
    // pure: true,

    print: true,

    navbar,
    sidebar,
    footer: "默认页脚",
    copyright: "无版权",
    // 每个页面都显示页脚
    displayFooter: true,
    hotReload: true,
    lastUpdated: true,

    // blog: {
    //     intro: "/about-the-author/",
    //     sidebarDisplay: "mobile",
    //     medias: {
    //         Zhihu: "https://www.zhihu.com/people/javaguide",
    //         Github: "https://github.com/Snailclimb",
    //         Gitee: "https://gitee.com/SnailClimb",
    //     },
    // },

    pageInfo: [
        "Author",
        "Date",
        "ReadingTime",
        "Word",
        "Original",
        "Category",
        "Tag",
    ],

    encrypt: {
        config: {
            "/demo/encrypt.html": ["1234"],
        },
    },

    // page meta
    metaLocales: {
        editLink: "编辑此页",
    },

    plugins: {
        blog: true,
        git: true,
        copyright: true,
        // You should generate and use your own comment service
        // 评论
        // comment: {
        //   provider: "Giscus",
        //   repo: "vuepress-theme-hope/giscus-discussions",
        //   repoId: "R_kgDOG_Pt2A",
        //   category: "Announcements",
        //   categoryId: "DIC_kwDOG_Pt2M4COD69",
        // },

        mdEnhance: {
            align: true,
            codetabs: true,
            figure: true,
            imgLazyload: true,
            // imgSize: true,
            // include: true,
            // mark: true,
            tasklist: true,
            // playground: {
            //     presets: ["ts", "vue"],
            // },
            // 是否启用幻灯片支持。
            // presentation: ["highlight", "math", "search", "notes", "zoom"],
            // sub: true,
            // sup: true,
            // tabs: true,
            // vuePlayground: true,
            // chart: true, // 是否启用图表支持。
            // demo: true,
            // echarts: true, // 是否启用 ECharts 图表支持。
            // flowchart: true, // 是否启用流程图支持。
        },
        // feed: {
        //     atom: true,
        //     json: true,
        //     rss: true,
        // },
    },
});
