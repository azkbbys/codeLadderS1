import i18n from "@root/i18n";

// 当前i18n配置已支持语言自动切换，客户端下默认会跟随用户浏览器语言设置。例如，若用户浏览器语言为 zh-CN，则界面将显示为简体中文。
console.log("(client)：", i18n.t("welcome_game"));
console.log("(client)：", i18n.t("welcome_ap"));
console.log(
  "(client)：",
  i18n.t("navigator.language", { language: navigator.language })
);
