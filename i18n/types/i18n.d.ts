/**
 * @file i18next 类型声明文件
 * @description
 * 这个文件通过 TypeScript 的模块增强（module augmentation）功能，为 `i18next` 库提供了自定义的类型定义。
 * 它的主要目的是为了实现翻译键（t-keys）的类型安全。
 * 通过将翻译文件的结构与 i18next 的类型关联，我们可以在编码时获得自动补全和编译时错误检查，
 * 有效避免因手误或键名变更导致的运行时错误。
 */

// 导入中文翻译文件的类型。
// 这里使用 `import type`，表示只在编译时用于类型检查，不会被打包到最终的 JavaScript 文件中。
// `typeof zhCN_Translation` 会获取 `zh-CN/translation.json` 文件的结构，作为我们翻译资源的类型模板。
import type zhCN_Translation from "../res/zh-CN/translation.json";

// 声明对 'i18next' 模块的扩展
declare module "i18next" {
  // 扩展 i18next 的 `CustomTypeOptions` 接口
  interface CustomTypeOptions {
    /**
     * 定义翻译资源的类型结构。
     * `typeof zhCN_Translation` 将我们的 JSON 文件结构应用到这个命名空间，
     * 从而让 TypeScript “知道”所有可用的翻译键。
     */
    resources: {
      translation: typeof zhCN_Translation;
    };
  }
}
