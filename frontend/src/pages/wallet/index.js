import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { Form, Input, Button, Typography, Flex } from "antd";

import Header from "../../components/header";
import "./style.css";
import { updateWalletAmount } from "../../functions/wallet";
const { Title } = Typography;
const WalletPage = ({ getAllPosts }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [isAddAllowed, setAddAllowed] = useState(false);
  const [amount, setAmount] = useState();
  const dispatch = useDispatch();

  const onFinish = async () => {
    console.log("this is ", amount);
    if (!amount) return;
    const finalAmount = +(user.walletAmount || 0) + +amount;
    const data = await updateWalletAmount(user.token, finalAmount);
    const { code } = data;
    if (code == 200) {
      setAddAllowed(false);
      dispatch({
        type: "LOGIN",
        payload: { ...user, walletAmount: finalAmount },
      });
    }
  };
  const onFinishFailed = (error) => {};
  return (
    <div className="wallet">
      <Header page="profile" getAllPosts={getAllPosts} />
      <div className="wallet-container">
        <Title level={5}>My Wallet:</Title>
        <Flex justify="space-between" align="center">
          <Title level={5}>Available Balance</Title>
          <div className="amount-container">
            <Title level={5} className="wallet-amount">
              {user.walletAmount || 0} $
            </Title>
          </div>
        </Flex>
        {!isAddAllowed ? (
          <Button type="primary" block onClick={() => setAddAllowed(true)}>
            Add more balance
          </Button>
        ) : (
          <span></span>
        )}
        {isAddAllowed ? (
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
              label="Enter amount"
              name="amount"
              rules={[
                {
                  required: true,
                  message: "Please input your amount!",
                },
              ]}
            >
              <Input onChange={(e) => setAmount(e.target.value)} />
            </Form.Item>
          </Form>
        ) : (
          <span></span>
        )}
        {isAddAllowed ? (
          <Flex justify="flex-start" align="baseline">
            <Button
              className="btn-link-amount"
              type="default"
              block
              onClick={() => setAddAllowed(false)}
            >
              Cancel
            </Button>
            <Button
              className="btn-link-amount"
              type="primary"
              htmlType="submit"
              block
              onClick={onFinish}
            >
              Submit
            </Button>
          </Flex>
        ) : (
          <span></span>
        )}
      </div>
    </div>
  );
};

export default WalletPage;
