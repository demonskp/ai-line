/**
 * widget to switch language
 **/

import { type FC, useEffect, useMemo } from "react";
import { Space, Dropdown, Flex } from "antd";
import { GlobalOutlined, DownOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const AlLangSwitcher: FC = () => {
  const { i18n } = useTranslation();
  const currLanguage = i18n.language;

  const items = useMemo(() => {
    return [
      { key: "en", label: <span>English</span> },
      { key: "zh", label: <span>简体中文</span> },
    ];
  }, []);

  function handleChangeLanguage({ key }) {
    i18n.changeLanguage(key as string).then(() => {
      // if (key !== currLanguage) {
      //   location.reload();
      // }
    });
  }

  const currLanguageLabel = useMemo(() => {
    const found = items.find((item) => item.key === currLanguage);
    return found?.label || currLanguage;
  }, [items, currLanguage]);

  // 相近语言替换
  // useEffect(() => {
  //   switch (currLanguage) {
  //     case "zh":
  //       handleChangeLanguage({ key: "zh-CN" });
  //       break;
  //     // case 'zh-HK':
  //     // case 'zh-MO':
  //     //   handleChangeLanguage({ key: 'zh-TW' });
  //     //   break;

  //     default:
  //       break;
  //   }
  // }, [currLanguage]);

  return (
    <Flex align="center" gap="small" style={{ cursor: "pointer" }}>
      <GlobalOutlined style={{ fontSize: 18, color: "rgba(0,0,0,0.6)" }} />

      <Dropdown
        placement="bottomRight"
        menu={{
          items,
          selectedKeys: [currLanguage],
          onClick: handleChangeLanguage,
        }}
      >
        <span onClick={(e) => e.preventDefault()}>
          <Space align="center">
            {currLanguageLabel}
            <DownOutlined style={{ fontSize: 10 }} />
          </Space>
        </span>
      </Dropdown>
    </Flex>
  );
};

export default AlLangSwitcher;
