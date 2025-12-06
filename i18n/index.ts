/**
 * @file i18next 实例配置文件
 * @description
 * 这个文件负责初始化 i18next 库，并将其配置为在客户端和服务端中使用。
 * 最后导出一个已配置好的 i18n 实例，供整个应用使用。
 *
 * @link https://www.i18next.com/
 */

import i18n from "i18next";

// 导入不同语言的翻译文件。
// 这些 JSON 文件包含了所有用于国际化的文本键值对。
import en_Translation from "./res/en/translation.json";
import zhCN_Translation from "./res/zh-CN/translation.json";

// 处理在服务端（无 navigator）与客户端环境下读取语言
const getNavigatorLanguage = () => {
  if (
    // @ts-ignore
    typeof navigator !== "undefined" &&
    // @ts-ignore
    typeof navigator.language === "string" &&
    // @ts-ignore
    navigator.language
  ) {
    // @ts-ignore
    return navigator.language;
  }
  return "zh-CN";
};

// 初始化 i18next 实例
i18n.init({
  // `lng`: 设置当前语言。这里使用客户端 `navigator.language` 来获取浏览器的语言设置。
  // 如果没有检测到语言，i18next 将会使用这里指定的 'zh-CN' 作为默认语言。
  lng: getNavigatorLanguage(),

  // `fallbackLng`: 设置回退语言。如果 `lng` 检测到的语言在 `resources` 中不存在对应的翻译，
  // i18next 将会使用这里指定的 'zh-CN' 作为备用语言，以确保总有内容显示。
  fallbackLng: "zh-CN",

  // `debug`: 开启调试模式。在开发环境中设置为 `true`，i18next 会在控制台输出详细信息，
  // 如语言加载、缺失键等，非常有助于调试。在生产环境中应务必设置为 `false` 以避免性能损耗和信息泄露。
  debug: false,

  // `defaultNS`: 设置默认的命名空间（namespace）。
  // 当调用 `t()` 函数且未指定命名空间时，i18next 将会在此处指定的 'translation' 命名空间下查找键。
  defaultNS: "translation",

  // `resources`: 提供翻译资源。这是一个对象，键是语言代码（如 'en', 'zh-CN'），
  // 值是该语言的命名空间和翻译内容。这里我们只用了一个默认的 'translation' 命名空间。
  resources: {
    en: {
      translation: en_Translation,
    },
    "zh-CN": {
      translation: zhCN_Translation,
    },
  },
});

/**
 * @zh
 * i18next 实例
 * @en
 * i18next instance
 */
export default i18n;
