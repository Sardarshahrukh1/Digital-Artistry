import React, { useState, useEffect } from "react";
import { Table, Avatar } from "antd";
import { useSelector } from "react-redux";
import moment from "moment";

import { getAllListing } from "../../../functions/marketplace";
import "./Post.css";
import { getPostsForAdmin } from "../../../functions/post";

const PostsPage = () => {
  const [Posts, setPosts] = useState([]);
  const [isMounted, setIsMounted] = useState(true);
  const { user } = useSelector((state) => ({ ...state }));
  useEffect(() => {
    // Fetch listing data from the backend API
    setIsMounted(true);
    // if(isMounted){
    //   setPosts();
    // }
    fetchData();
    return () => {
      setIsMounted(false);
    };
  }, []);

  const fetchData = async () => {
    if (!isMounted) return;
    try {
      const data = await getPostsForAdmin(user.token);
      setPosts(data);
    } catch (error) {
      setPosts([]);
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "text",
      key: "text",
      render: (text, record) => {
        if (!record || !record.text) return <span>Not Available</span>;
        return record.text;
      },
    },
    {
      title: "Post Type",
      dataIndex: "type",
      key: "text",
      render: (text, record) => {
        if (!record || !record.type) return <span>Not Available</span>;
        return record.type;
      },
    },

    {
      title: "Posted By",
      dataIndex: "user",
      key: "user",
      render: (text, record) => {
        if (
          !record ||
          !record.user ||
          !record.user.first_name ||
          !record.user.last_name
        )
          return <span>Not Available</span>;
        return (
          <div>
            <span style={{ marginLeft: "8px" }}>
              {(record.user.first_name || "") +
                " " +
                (record.user.last_name || "")}
            </span>
          </div>
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
  ];
  return (
    <div className="App">
      <h1>Posts</h1>
      <Table dataSource={Posts} columns={columns} />
    </div>
  );
};

export default PostsPage;
