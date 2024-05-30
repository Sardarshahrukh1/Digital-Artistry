import { Card } from "antd";
import { Avatar, List } from "antd";
import "./style.css";
import Header from "../../components/header";
import { useEffect, useState } from "react";
import { getAllNotificationFromDB } from "../../functions/notification";
import { useSelector } from "react-redux";
import { SyncOutlined } from "@ant-design/icons";
import { get } from "lodash";

const NotificationPage = ({ getAllPosts }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    getAllNotification();
  }, []);

  const getAllNotification = async () => {
    try {
      const notif = await getAllNotificationFromDB(user.token);
      setNotifications(notif.payload);
    } catch (error) {
      console.log("this is error--------->", error);
      setNotifications([]);
    }
  };
  const data = [
    {
      title: "John Doe",
    },
    {
      title: "Atif Aslam",
    },
    {
      title: "Mark Joe",
    },
    {
      title: "Sam John",
    },
  ];
  const onrefreshNotif = () => {
    getAllNotification();
  };
  return (
    <div>
      <Header page="profile" getAllPosts={getAllPosts} />

      <Card className="notification-card" title="Notification" bordered={false}>
        <div className="refresh-btn" onClick={onrefreshNotif}>
          <SyncOutlined />
        </div>
        <List
          itemLayout="horizontal"
          dataSource={notifications}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={get(
                      item,
                      "notificationOf.picture",
                      "https://res.cloudinary.com/dmhcnhtng/image/upload/v1643044376/avatars/default_pic_jeaybr.png"
                    )}
                  />
                }
                title={
                  !get(item, "notificationOf.username", "") ? (
                    <span>User</span>
                  ) : (
                    <a
                      href={
                        "http://localhost:3000/profile/" +
                        get(item, "notificationOf.username", "")
                      }
                    >
                      {get(item, "notificationOf.username", "User")}
                    </a>
                  )
                }
                description={item.title}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default NotificationPage;
