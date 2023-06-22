import {defineUserConfig} from "vuepress";
import {searchPlugin} from "@vuepress/plugin-search";
// import {searchProPlugin} from "vuepress-plugin-search-pro";
import theme from "./theme.js";

export default defineUserConfig({
    base: "/",

    lang: "zh-CN",
    title: "文档演示",
    description: "vuepress-theme-hope 的文档演示",
    head: [
        // meta
        ["meta", {name: "robots", content: "all"}],
        ["meta", {name: "author", content: "xiaovin"}],
        [
            "meta",
            {
                "http-equiv": "Cache-Control",
                content: "no-cache, no-store, must-revalidate",
            },
        ],
        ["meta", {"http-equiv": "Pragma", content: "no-cache"}],
        ["meta", {"http-equiv": "Expires", content: "0"}],
        [
            "meta",
            {
                name: "keywords",
                content: "test",
            },
        ],
        ["meta", {name: "apple-mobile-web-app-capable", content: "yes"}],
    ],
    theme,
    plugins: [
        searchPlugin({
            // https://v2.vuepress.vuejs.org/zh/reference/plugin/search.html
            // 排除首页
            isSearchable: (page) => page.path !== "/",
            maxSuggestions: 10,
            hotKeys: ["s", "/"],
            // 用于在页面的搜索索引中添加额外字段
            getExtraFields: () => [],
            locales: {
                "/": {
                    placeholder: "搜索",
                },
            },
        }),
        // searchProPlugin({
        //     indexContent: true,
        //     // indexOptions: {
        //     //   tokenize: (text, fieldName) =>
        //     //     fieldName === "id" ? [text] : cut(text, true),
        //     // },
        //     // customFields: [
        //     //   {
        //     //     getter: ({ frontmatter }) =>
        //     //       <string | undefined>frontmatter.category ?? null,
        //     //     formatter: "分类: $content",
        //     //   },
        //     // ],
        //     customFields: [
        //         {
        //             getter: (page) => page.frontmatter.category,
        //             formatter: "分类：$content",
        //         },
        //         {
        //             getter: (page) => page.frontmatter.tag,
        //             formatter: "标签：$content",
        //         },
        //     ],
        //     suggestDelay: 60,
        // }),
    ],

    // Enable it with pwa
    pagePatterns: ["**/*.md", "!.vuepress", "!node_modules"],

    shouldPrefetch: false,
});
