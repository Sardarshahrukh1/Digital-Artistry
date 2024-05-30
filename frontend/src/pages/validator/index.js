import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { get } from "lodash";

import { Form, Input, Button, Typography, Flex } from "antd";

import Header from "../../components/header";
import "./style.css";
import { updateWalletAmount } from "../../functions/wallet";
import { verifyListing } from "../../functions/marketplace";
const { Title } = Typography;

const ValidatorPage = ({ getAllPosts }) => {
  const [key, setKey] = useState("");
  const [product, setProduct] = useState("");
  const { user } = useSelector((state) => ({ ...state }));

  const onFinish = async () => {
    if (!key) return;
    try {
      const { code, payload } = await verifyListing(user.token, key);
      if (code == 200) {
        setKey("");
        setProduct(payload);
        return;
      }
      setKey("");
      setProduct("");
      alert("Invalid License ID");
    } catch (error) {
      setKey("");
    }
  };

  const onFinishFailed = (error) => {
    console.log("Error");
  };
  return (
    <div className="wallet">
      <Header page="profile" getAllPosts={getAllPosts} />
      <div className="wallet-container">
        <Title level={5}>Listing Validator:</Title>

        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Enter License ID/Key"
            name="key"
            rules={[
              {
                required: true,
                message: "Please input your amount!",
              },
            ]}
          >
            <Input
              defaultValue={key}
              onChange={(e) => setKey(e.target.value)}
            />
          </Form.Item>
        </Form>
        <Button
          className="btn-link-amount"
          type="primary"
          htmlType="submit"
          block
          onClick={onFinish}
        >
          Submit
        </Button>
        {product ? (
          <div className="card-validator" key={product._id}>
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
              <p className="flex-name border">
                <strong>Buyer: </strong>{" "}
                <span>
                  {get(product, "listedBy.first_name") +
                    " " +
                    get(product, "listedBy.last_name")}
                </span>
              </p>
              <p className="flex-name">
                <strong>Seller: </strong>{" "}
                <span>
                  {get(product, "purchasedBy.first_name") +
                    " " +
                    get(product, "purchasedBy.last_name")}
                </span>
              </p>
            </section>
          </div>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

export default ValidatorPage;
