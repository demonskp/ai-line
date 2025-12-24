import { useState } from "react";
import { Form, Input, Button, Card, message, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { accountApi } from "../../apis";
import { useAccountStore } from "../../store/account-store";
import "./index.less";
import { encryptHelper } from "../../helpers";

const { Title, Text } = Typography;

interface LoginFormValues {
  account: string;
  password: string;
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const loginSuccess = useAccountStore((state) => state.loginSuccess);

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const encryptedPassword = await encryptHelper.encryptWithPublicKey(
        values.password
      );
      const res = await accountApi.login(values.account, encryptedPassword);
      loginSuccess(res.token, values.account);
      message.success("登录成功");
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-bg-shape shape-1" />
        <div className="login-bg-shape shape-2" />
        <div className="login-bg-shape shape-3" />
      </div>

      <Card className="login-card" bordered={false}>
        <div className="login-header">
          <Title level={2} className="login-title">
            欢迎回来
          </Title>
          <Text type="secondary" className="login-subtitle">
            请登录您的账号
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
            rules={[{ required: true, message: "请输入账号" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="账号"
              className="login-input"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
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
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
