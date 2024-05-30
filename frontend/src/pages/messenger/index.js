import { useState, useEffect } from "react";
import { get } from "lodash";
import { SyncOutlined } from "@ant-design/icons";

import { useSelector, useDispatch } from "react-redux";
import { Typography, Select, Input } from "antd";
import Header from "../../components/header";
import "./style.css";
import {
  createConversation,
  fetchConversation,
  fetchMessage,
  getAllFriendsList,
  getConversation,
  sendMessage,
} from "../../functions/messenger";

const { Title } = Typography;

const Messenger = ({ getAllPosts }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [friends, setFriends] = useState([]);
  const [allFriends, setAllFriends] = useState([]);
  const [currentConv, setCurrentConv] = useState(null);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [allConvs, setAllConvs] = useState([]);
  const [chatUser, setChatUser] = useState("");

  useEffect(() => {
    getAllConversations();
    getFriends();
  }, [chatUser]);

  const getMessages = async (conversation = null) => {
    try {
      const { payload } = await fetchMessage(user.token, conversation._id);
      setMessages(payload);
    } catch (error) {
      setMessages([]);
    }
  };
  const getFriends = async () => {
    try {
      const { payload } = await getAllFriendsList(user.token);
      if (payload.length) {
        setAllFriends(payload);
        const data = payload.map((pay) => {
          return {
            value: pay._id,
            label: pay.username,
          };
        });
        setFriends(data);
      }
    } catch (error) {
      setFriends([]);
    }
  };
  const getAllConversations = async () => {
    try {
      const { payload } = await fetchConversation(user.token);
      if (payload.length) {
        const data = payload.map((pay) => {
          return {
            ...pay,
            title:
              user.id == pay.sender._id
                ? pay.reciever.first_name + " " + pay.reciever.last_name
                : pay.sender.first_name + " " + pay.sender.last_name,
          };
        });
        setAllConvs(data);
        const id = data[0]._id;

        if (id) {
          handleChange(id);
        }
      }
    } catch (error) {
      setAllConvs([]);
    }
  };
  const handleChange = async (e) => {
    const id = e;
    if (!id) return;
    try {
      const { payload } = await getConversation(user.token, id);
      if (payload) {
        const data = payload;
        setCurrentConv({
          ...data,
          title:
            user.id == data.sender._id
              ? data.reciever.first_name + " " + data.reciever.last_name
              : data.sender.first_name + " " + data.sender.last_name,
        });
        getMessages(data);
      } else {
        console.log("------------->1");
        createConversationDB(user.token, id);
      }
    } catch (error) {
      setCurrentConv(null);
    }
  };

  const createConversationDB = async (token, reciever) => {
    const { payload } = await createConversation(token, reciever);
    if (payload && payload._id) {
      // console.log("------------>1");
      // const data = await getConversation(token, reciever);
      // console.log("------------>2", data);
      // const dPayload = get(data, "payload");
      // console.log("------------>3", dPayload);

      // if (dPayload) {
      //   setCurrentConv({
      //     ...data,
      //     title:
      //       user.id == data.sender._id
      //         ? data.reciever.first_name + " " + data.reciever.last_name
      //         : data.sender.first_name + " " + data.sender.last_name,
      //   });
      // }
      getAllConversations();
    }
  };

  const handleKeypress = (e) => {
    if (e.key === "Enter") {
      sendMessageToDB();
    }
  };

  const sendMessageToDB = async () => {
    try {
      let id = "";
      let reciever = "";
      if (currentConv) {
        id = currentConv._id;
        reciever = get(currentConv, "reciever._id", null);
      } else {
        id = null;
        reciever = chatUser._id;
      }
      const { code } = await sendMessage(user.token, text, reciever, id);
      if (code == 200) {
        const msg = {
          sender: user.id,
          reciever: reciever,
          convId: id,
          text,
        };
        const allMessages = [msg, ...messages];
        setMessages(allMessages);
        setText("");
      }
    } catch (error) {}
  };

  const onClickRefresh = () => {
    getMessages(currentConv);
  };

  return (
    <div className="messenger">
      <Header page="profile" getAllPosts={getAllPosts} />
      <div className="messenger-container ">
        <div className="left p-15">
          <Title className="" level={3}>
            Chat
          </Title>

          <Select
            defaultValue=""
            style={{ width: "100%" }}
            onChange={handleChange}
            options={friends}
            notFoundContent={<div>No Friend in your network</div>}
          />
          {!allConvs.length ? <p>No conversation found</p> : <span></span>}
          {allConvs.map((conv, i) => {
            return (
              <div
                className={
                  i == 0 ? "conversation active-conversation" : "conversation"
                }
                onClick={() => handleChange(conv._id)}
              >
                <div className="left">
                  <img src="https://res.cloudinary.com/dmhcnhtng/image/upload/v1643044376/avatars/default_pic_jeaybr.png" />
                </div>
                <div className="right">
                  <Title level={5}>{conv.title}</Title>
                  {/* <p className="message">{user.lastMessage}</p> */}
                </div>
              </div>
            );
          })}
        </div>
        {!currentConv ? (
          <p></p>
        ) : (
          <div className="right">
            <div className="conversation-header">
              <div className="left">
                {!currentConv || !currentConv.reciever ? (
                  <img src={currentConv.picture} />
                ) : (
                  <img src="https://res.cloudinary.com/dmhcnhtng/image/upload/v1643044376/avatars/default_pic_jeaybr.png" />
                )}
              </div>
              <div className="right">
                <Title level={5}>{currentConv.title}</Title>

                <p className="message">{currentConv.lastMessage}</p>
              </div>

              <div className="refresh-btn" onClick={onClickRefresh}>
                <SyncOutlined />
              </div>
            </div>
            <div className="conversation-container">
              <div className="chat-area">
                {messages.map((message) => {
                  return (
                    <div
                      className={
                        message.sender == user.id
                          ? "message-box msg-right"
                          : "message-box msg-left"
                      }
                    >
                      <p
                        className={
                          message.sender == user.id ? "sender" : "receiver"
                        }
                      >
                        {message.text}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="input-area">
                <Input
                  placeholder="Enter message"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyPress={handleKeypress}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messenger;
