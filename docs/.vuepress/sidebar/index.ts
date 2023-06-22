import {sidebar} from "vuepress-theme-hope";

import {bigdataComponent} from "./bigdataComponent.js";
import {bigdataInterview} from "./bigdataInterview";

export default sidebar({
    // 应该把更精确的路径放置在前边
    "/bigdataComponent": bigdataComponent,
    "/bigdataInterview": bigdataInterview,
    // "/high-quality-technical-articles/": highQualityTechnicalArticles,
    // "/zhuanlan/": [
    //     "java-mian-shi-zhi-bei",
    //     "back-end-interview-high-frequency-system-design-and-scenario-questions",
    //     "handwritten-rpc-framework",
    //     "source-code-reading",
    // ],
    // 必须放在最后面
});