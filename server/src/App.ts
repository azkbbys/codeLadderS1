import i18n from "@root/i18n";

// 由于服务端中用户群体广泛，来源多样，建议在每个 t 函数中显式传入当前用户的语言标识，以确保多语言内容能够正确匹配用户所需的语言版本。
console.log("(server)：", i18n.t("welcome_game", { lng: "zh-CN" }));
console.log("(server)：", i18n.t("welcome_ap", { lng: "en" }));
