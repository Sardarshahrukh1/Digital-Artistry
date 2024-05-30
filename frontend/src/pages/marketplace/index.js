import { useState } from "react";
import { Layout, Modal } from "antd";
import { Outlet } from "react-router-dom";

import Header from "../../components/header";
import MarketPlaceSidebar from "./sidebar";
import "./style.css";
import BrowseAllPage from "./browse";
const { Sider, Content } = Layout;
const siderStyle = {
  textAlign: "center",
  lineHeight: "120px",
  color: "#fff",
  backgroundColor: "#3ba0e9",
};
const contentStyle = {
  textAlign: "center",
  minHeight: 120,
  lineHeight: "120px",
  color: "#fff",
  backgroundColor: "#108ee9",
};
export default function MarketPlace({ getAllPosts }) {
  return (
    <div className="marketplace">
      <Header page="profile" getAllPosts={getAllPosts} />
      <Layout hasSider className="mt-50 ">
        <Sider className="siderStyle" width="25%">
          <MarketPlaceSidebar />
        </Sider>
        <Content className="contentStyle">
          <Outlet key={window.location.pathname} />
        </Content>
      </Layout>
    </div>
  );
}
