import { useEffect, useState } from "react";
import { getAllFriendsList } from "../../../functions/messenger";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Contact({ user: userNew }) {
  const { user } = useSelector((state) => ({ ...state }));
  const [friends, setFriends] = useState([]);
  const navigator = useNavigate();

  useEffect(() => {
    getFriends();
  }, []);

  const getFriends = async () => {
    try {
      const { payload } = await getAllFriendsList(user.token);
      if (payload.length) {
        console.log("this is payload====", payload);
        const data = payload.map((pay) => {
          return {
            id: pay._id,
            picture: pay.picture,
            name: pay.first_name + " " + pay.last_name,
            username: pay.username,
          };
        });
        setFriends(data);
      }
    } catch (error) {
      setFriends([]);
    }
  };

  const openProfile = (username) => {
    console.log("this is username", username);
    navigator("/profile/" + username);
  };

  return friends.map((friend) => {
    return (
      <div
        className="contact hover3"
        onClick={() => openProfile(friend.username)}
      >
        <div className="contact_img">
          <img src={friend.picture} alt="" />
        </div>
        <span>{friend.name}</span>
      </div>
    );
  });
}
