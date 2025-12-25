import { useState } from "react";
import { Form, Input, Button, Card, message, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { accountApi } from "../../apis";
import { useAccountStore } from "../../store/account-store";
import "./index.less";
import { encryptHelper } from "../../helpers";
import { useTranslation } from "react-i18next";
import AlLangSwitcher from "../../widgets/al-lang-switcher";

const { Title, Text } = Typography;

interface LoginFormValues {
  account: string;
  password: string;
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const loginSuccess = useAccountStore((state) => state.loginSuccess);
  const { t } = useTranslation();

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const encryptedPassword = await encryptHelper.encryptWithPublicKey(
        values.password
      );
      const res = await accountApi.login(values.account, encryptedPassword);
      loginSuccess(res.token, values.account);
      message.success(t("label.success", { label: t("login") }));
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-lang-switcher">
        <AlLangSwitcher />
      </div>
      <Card className="login-card">
        <div className="login-header">
          <Title level={2} className="login-title">
            {t("welcome_back")}
          </Title>
          <Text type="secondary" className="login-subtitle">
            {t("please_login_your_account")}
          </Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="account"
            rules={[
              {
                required: true,
                message: t("label.please_input", {
                  label: t("fields.account"),
                }),
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder={t("fields.account")}
              className="login-input"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: t("label.please_input", {
                  label: t("fields.password"),
                }),
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={t("fields.password")}
              className="login-input"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 32 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="login-button"
            >
              {t("fields.login")}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
