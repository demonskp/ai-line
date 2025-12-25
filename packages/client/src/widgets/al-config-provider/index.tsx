import { useMemo, type PropsWithChildren } from "react";
import { ConfigProvider } from "antd";

import enUS from "antd/locale/en_US";
import zhCN from "antd/locale/zh_CN";

import "dayjs/locale/en";
import "dayjs/locale/zh-cn";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

export default function AlConfigProvider({ children }: PropsWithChildren) {
  const { i18n } = useTranslation();

  const local = useMemo(() => {
    let result = enUS;
    switch (i18n.language) {
      case "zh":
      case "zh-CN":
        result = zhCN;
        dayjs.locale("zh-cn");
        break;
      case "zh-TW":
        result = zhTW;
        dayjs.locale("zh-tw");
        break;
      case "en":
        result = enUS;
        dayjs.locale("en");
        break;

      default:
        break;
    }
    return result;
  }, [i18n.language]);

  return <ConfigProvider locale={local}>{children}</ConfigProvider>;
}
