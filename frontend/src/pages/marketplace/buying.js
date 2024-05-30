import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Moment from "react-moment";
import { Space, Table, Tag } from "antd";
import { getBuyingOfLoggedInUser } from "../../functions/marketplace";
import saveAs from "save-as";

const columns = [
  {
    title: "Image",
    dataIndex: "pictures",
    key: "pictures",
    render: (text) => <img className="img-table" src={text[0]} />,
  },
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
    title: "License ID",
    dataIndex: "licenseId",
    key: "licenseId",
    render: (text) => <span>{text}</span>,
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
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    render: (text, i) => (
      <span
        className="action-table"
        onClick={() => {
          const filename = `${i.title}_${Date.now()}`;
          downloadImage(i.pictures[0], filename);
        }}
      >
        Download
      </span>
    ),
  },
];

const downloadImage = async (imageUrl, filename) => {
  try {
    // Fetch the image as a blob  Binary Large Object.
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    // Use saveAs to trigger the download
    saveAs(blob, `${filename}.jpg`);
  } catch (error) {
    console.error("Error downloading image:", error);
  }
};

const BuyingPage = () => {
  const [products, setProducts] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { payload } = await getBuyingOfLoggedInUser(user.token);
      if (payload && payload.length) {
        console.log(payload);
        setProducts(payload);
        // return setData(payload);
      }
    } catch (error) {
      //   setData([]);
    }
  };

  return (
    <div className="container">
      <Table columns={columns} dataSource={products} />
    </div>
  );
};

export default BuyingPage;
