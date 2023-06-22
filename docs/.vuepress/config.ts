import {defineUserConfig} from "vuepress";
import {searchPlugin} from "@vuepress/plugin-search";
// import {searchProPlugin} from "vuepress-plugin-search-pro";
import theme from "./theme.js";

// export const defaultOptions: {
//     level: [1, 2, 3, 4, 5, 6],
// };

export default defineUserConfig({
    base: "/",

    lang: "zh-CN",
    title: "文档演示",
    description: "vuepress-theme-hope 的文档演示",

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
    pagePatterns: ["**/*.md", "!**/*.snippet.md", "!.vuepress", "!node_modules"],

    shouldPrefetch: false,
});
