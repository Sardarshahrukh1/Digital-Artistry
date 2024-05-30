import React, { useState } from "react";
import DotLoader from "react-spinners/DotLoader";
import axios from "axios";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button } from "antd";
import "./AdminLogin.css"; // Import your custom CSS

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onFinish = async (values) => {
    const { username, password } = values;

    if (!username || !password) return;
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/admin-login`,
        {
          email: username,
          password,
        }
      );
      dispatch({ type: "LOGIN", payload: data });
      Cookies.set("user", JSON.stringify(data));
      navigate("/dashboard");
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="login-container">
      <div className="login-card">
        <img
          src="../../../../../images/logo1.png"
          alt="Logo"
          className="login-logo"
        />
        <Form
          name="admin_login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          className="login-form"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          {error && <div className="error_text">{error}</div>}
          <div className="sign_splitter"></div>
          <Form.Item>
            {loading ? (
              <div className="dot-loader">
                <DotLoader color="#1876f2" loading={loading} size={30} />
              </div>
            ) : (
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button blue_btn"
              >
                Log in
              </Button>
            )}
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AdminLogin;
