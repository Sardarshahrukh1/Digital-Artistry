import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Moment from "react-moment";

import { Modal, Typography, Button, Alert, Input } from "antd";

import { MessageOutlined, ShoppingCartOutlined } from "@ant-design/icons";

import { get } from "lodash";
import { getListing, buyListing } from "../../functions/marketplace";

const { Title } = Typography;
const { Search } = Input;

const BrowseAllPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state }));
  const [products, setProduct] = useState([]);
  const [mainProducts, setMainProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);
  const [licenseId, setlicenseId] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  useEffect(() => {
    getAllListings();
  }, []);

  const getAllListings = async () => {
    try {
      const listing = await getListing(user.token);
      const payload = get(listing, "payload", "");
      if (payload.length) {
        setMainProducts(payload);
        return setProduct(payload);
      }
      setProduct([]);
    } catch (error) {
      setProduct([]);
    }
  };

  const onClickBuyBtn = async () => {
    try {
      setBuyLoading(true);
      const listing = await buyListing(
        user.token,
        selectedProduct._id,
        user.id,
        user.walletAmount
      );
      setBuyLoading(false);
      const payload = get(listing, "payload", "");
      if (payload && payload.data && payload.data._id) {
        dispatch({
          type: "LOGIN",
          payload: { ...user, walletAmount: payload.walletUpdatedAmount },
        });
        const lId = payload.data.licenseId;
        setlicenseId(lId);
        setModalOpen(false);
      }
    } catch (error) {
      setBuyLoading(false);
      setModalOpen(false);
      setlicenseId(false);
    }
  };

  const onClickProductCard = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const onHandleCancel = () => {
    setModalOpen(false);
  };

  const onSearch = (value, event, info) => {
    const query = value;
    if (!query) {
      setProduct(mainProducts);
    } else {
      let customProds = mainProducts.filter((product) =>
        product.title.includes(query)
      );
      setProduct(customProds);
    }
  };

  return (
    <div key={"browse-page"} className="browse-page">
      <div className="row">
        <h2>Explore and Buy: Creative Works</h2>
      </div>
      {licenseId ? (
        <Alert
          className="alert-message"
          message={"License ID for product verification: " + licenseId}
          type="info"
        />
      ) : (
        <span></span>
      )}

      <div className="grid p-20">
        <Search placeholder="Search Marketplace" onSearch={onSearch} />
        {products.map((product) => {
          return (
            <div
              className="card"
              key={product._id}
              onClick={() => onClickProductCard(product)}
            >
              <img
                src={get(
                  product,
                  "pictures.0",
                  "https://cdni.iconscout.com/illustration/premium/thumb/out-of-stock-5100752-4264526.png?f=webp"
                )}
              />
              <section>
                <h3>{product.title}</h3>
                <p className="price">${" " + product.price}</p>
                <p className="desc">{product.description.slice(0, 50)}</p>
                <span className="location">{product.location}</span>
              </section>
            </div>
          );
        })}
      </div>
      <Modal
        title="View Listing"
        open={isModalOpen}
        footer={null}
        onCancel={onHandleCancel}
        width={"80%"}
      >
        <div className="view-list-modal">
          <div className="left">
            <img src={get(selectedProduct, "pictures.0", "")} />
          </div>
          <div className="right">
            <div className="content">
              <Title level={2}>{selectedProduct.title}</Title>
              <Title level={5}>{selectedProduct.price}</Title>
              <span>
                <Moment format="YYYY/MM/DD">{selectedProduct.createdAt}</Moment>
              </span>
              {/* 
              <Button type="primary" className="grey-btn mt-20">
                <MessageOutlined />
                Message
              </Button> */}

              <p className="pt-20">{selectedProduct.description}</p>
            </div>
            <div className="action">
              <Button
                onClick={onClickBuyBtn}
                loading={buyLoading}
                type="primary"
                className="grey-btn mt-20"
              >
                <ShoppingCartOutlined />
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BrowseAllPage;
