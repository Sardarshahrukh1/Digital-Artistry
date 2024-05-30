import React, { useState, useEffect } from "react";
import { Table, Avatar } from "antd";
import { useSelector } from "react-redux";
import moment from "moment";

import { getAllListing } from "../../../functions/marketplace";
import "./Product.css";

const ProductsPage = () => {
  const [listings, setListings] = useState([]);
  const [isMounted, setIsMounted] = useState(true);
  const { user } = useSelector((state) => ({ ...state }));
  useEffect(() => {
    // Fetch listing data from the backend API
    setIsMounted(true);

    fetchData();
    return () => {
      setIsMounted(false);
    };
  }, []);

  const fetchData = async () => {
    if (!isMounted) return;
    try {
      const data = await getAllListing(user.token);
      setListings(data);
    } catch (error) {
      setListings([]);
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text, record) => {
        if (!record.description) return <span>-</span>;
        return (
          <span>
            {record.description.length > 50
              ? record.description.slice(0, 50) + "..."
              : record.description}
          </span>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => {
        let cssClass = "status-chip";
        if (record.status == "listed") {
          cssClass += " status-listed";
        } else if (record.status == "sold") {
          cssClass += " status-sold";
        } else {
          cssClass += " status-review";
        }
        return <span className={cssClass}>{record.status}</span>;
      },
    },
    {
      title: "Listed By",
      dataIndex: "listedBy",
      key: "listedBy",
      render: (text, record) => {
        if (!record.listedBy) return <span>-</span>;
        return (
          <div>
            <span style={{ marginLeft: "8px" }}>
              {(record.listedBy.first_name || "") +
                " " +
                (record.listedBy.last_name || "")}
            </span>
          </div>
        );
      },
    },
    {
      title: "Purchased By",
      dataIndex: "purchasedBy",
      key: "purchasedBy",
      render: (text, record) => {
        if (!record.purchasedBy) return <span>-</span>;
        return (
          <div>
            <span style={{ marginLeft: "8px" }}>
              {(record.purchasedBy.first_name || "") +
                " " +
                (record.purchasedBy.last_name || "")}
            </span>
          </div>
        );
      },
    },
    {
      title: "Purchased At",
      dataIndex: "purchasedAt",
      key: "purchasedAt",
      render: (text, record) => {
        return moment(record.purchasedAt).format("DD/MM/YYYY");
      },
    },
  ];
  return (
    <div className="App">
      <h1>Listings</h1>
      <Table dataSource={listings} columns={columns} />
    </div>
  );
};

export default ProductsPage;
