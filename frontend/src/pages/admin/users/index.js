import React, { useState, useEffect } from "react";
import { Table, Space, message, Button } from "antd";
import { useSelector } from "react-redux";
import moment from "moment";
import { findIndex } from "lodash";

import "./User.css";
import {
  approveUser,
  fetchAllUsers,
  rejectUser,
} from "../../../functions/user";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));
  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    // Fetch user data from the backend API

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await fetchAllUsers(user.token);
      setUsers(data);
    } catch (error) {
      showMessgae("error", "Something went wrong");
      setUsers([]);
    }
  };

  const showMessgae = (type, content) => {
    messageApi.open({
      type,
      content,
    });
  };

  const onClickApproveUser = async (id) => {
    try {
      const data = await approveUser(id, user.token);
      if (data && data.user) {
        showMessgae("success", "User approved successfully!");
        const index = findIndex(users, (user) => user._id === id);
        const newUsers = [...users];
        newUsers[index].verified = true;
        setUsers(newUsers);
      }
    } catch (error) {
      showMessgae("error", "Something went wrong");
    }
  };

  const onClickRejectUser = async (id) => {
    try {
      const data = await rejectUser(id, user.token);
      if (data && data.user) {
        showMessgae("success", "User rejected successfully!");
        const index = findIndex(users, (user) => user._id === id);
        const newUsers = [...users];
        newUsers[index].verified = false;
        setUsers(newUsers);
      }
    } catch (error) {
      showMessgae("error", "Something went wrong");
    }
  };

  const columns = [
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Verified",
      dataIndex: "verified",
      key: "verified",
      render: (text, record) => {
        return record.verified ? (
          <span className="approved">Approved</span>
        ) : (
          <span className="rejected">Rejected</span>
        );
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text, record) => {
        return moment(record.createdAt).format("DD/MM/YYYY");
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => onClickApproveUser(record._id)}>
            Approve
          </Button>
          <Button type="danger" onClick={() => onClickRejectUser(record._id)}>
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="App">
      <h1>User Management</h1>
      <Table dataSource={users} columns={columns} />
    </div>
  );
};

export default UsersPage;
