import React from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  ShoppingOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import "./MainLayout.css";
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UsersPage from "./users";
import ProductsPage from "./products";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import PostsPage from "./posts";

const { Header, Content, Sider } = Layout;

const AdminDashboardPage = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onClickMenuItem = (link) => {
    navigate(link);
  };

  const onClickLogOut = () => {
    Cookies.set("user", "");
    dispatch({
      type: "LOGOUT",
    });
    navigate("/admin");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className="logo">
          <h6>Dashboard</h6>
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item
            onClick={() => onClickMenuItem("users")}
            key="1"
            icon={<UserOutlined />}
          >
            Users
          </Menu.Item>
          <Menu.Item
            onClick={() => onClickMenuItem("products")}
            key="2"
            icon={<ShoppingOutlined />}
          >
            Products
          </Menu.Item>
          <Menu.Item
            onClick={() => onClickMenuItem("posts")}
            key="3"
            icon={<MedicineBoxOutlined />}
          >
            Posts
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className="header">
          <div className="logout-button" onClick={onClickLogOut}>
            Logout
          </div>
        </Header>
        <Content style={{ margin: "90px 16px 0" }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            <Routes>
              <Route path="/users" element={<UsersPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/posts" element={<PostsPage />} />
              {/* Redirect to /users as the default route */}
              <Route path="/" element={<UsersPage />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboardPage;
