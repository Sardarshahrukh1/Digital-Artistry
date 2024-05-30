import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Moment from "react-moment";
import { Space, Table, Tag } from "antd";
import { getMySoldListing } from "../../functions/marketplace";

const columns = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    render: (text) => <span>{text}</span>,
  },
  {
    title: "Type",
    dataIndex: "listingType",
    key: "listingType",
    render: (text) => <span>{text}</span>,
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
    render: (text) => <span>{text}</span>,
  },
  {
    title: "Purchased By",
    dataIndex: "purchasedBy",
    key: "puchasedBy",
    render: (text) => (
      <a
        onClick={() => {
          console.log(text.username);
          window.location.href = `http://localhost:3000/profile/${text.username}`;
        }}
      >
        {" "}
        {text.username}
      </a>
    ),
  },
  {
    title: "Purchased At",
    dataIndex: "purchasedAt",
    key: "purchasedAt",
    render: (text) => (
      <span>
        <Moment format="YYYY/MM/DD">{text}</Moment>
      </span>
    ),
  },
];

const SellingPage = () => {
  const [products, setProducts] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { payload } = await getMySoldListing(user.token);
      if (payload && payload.length) {
        setProducts(payload);
      }
    } catch (error) {
      setProducts([]);
    }
  };

  return (
    <div className="container">
      <Table columns={columns} dataSource={products} />
    </div>
  );
};

export default SellingPage;
