import { useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { get } from "lodash";
import Header from "../../components/header";
import { friendspage } from "../../functions/reducers";
import { fetchAllUsers, getFriendsPageInfos } from "../../functions/user";
import Card from "./Card";
import "./style.css";
export default function Friends() {
  const { user } = useSelector((state) => ({ ...state }));
  const { type } = useParams();
  const [users, setUsers] = useState([]);
  const [{ loading, error, data }, dispatch] = useReducer(friendspage, {
    loading: false,
    data: {},
    error: "",
  });
  useEffect(() => {
    getData();
    fetchUsers();
  }, []);
  const getData = async () => {
    dispatch({ type: "FRIENDS_REQUEST" });
    const data = await getFriendsPageInfos(user.token);
    if (data.status === "ok") {
      dispatch({ type: "FRIENDS_SUCCESS", payload: data.data });
    } else {
      dispatch({ type: "FRIENDS_ERROR", payload: data.data });
    }
  };

  const fetchUsers = async () => {
    try {
      const payload = await fetchAllUsers(user.token);
      setUsers([...payload]);
    } catch (error) {
      setUsers([]);
    }
  };

  return (
    <>
      <Header page="friends" />
      <div className="friends">
        <div className="friends_left">
          <div className="friends_left_header">
            <h3>Friends</h3>
            <div></div>
          </div>
          <div className="friends_left_wrap">
            <Link
              to="/"
              className={`mmenu_item hover3 ${
                type === undefined && "active_friends"
              }`}
            >
              <div className="iconBox">
                {/* <i className="friends_home_icon "></i> */}
                <img src="../../../left/friends.png" />
              </div>
              <span className="pl-10">Home</span>
              <div className="rArrow">
                <i className="right_icon"></i>
              </div>
            </Link>
            <Link
              to="/friends/requests"
              className={`mmenu_item hover3 ${
                type === "requests" && "active_friends"
              }`}
            >
              <div className="iconBox">
                <img src="../../../left/add-friends.png" />
                {/* <i className="friends_requests_icon"></i> */}
              </div>
              <span className="pl-10">Friend Requests</span>
              <div className="rArrow">
                <i className="right_icon"></i>
              </div>
            </Link>
            <Link
              to="/friends/sent"
              className={`mmenu_item hover3 ${
                type === "sent" && "active_friends"
              }`}
            >
              <div className="iconBox">
                <img src="../../../left/find.png" />
                {/* <i className="friends_requests_icon"></i> */}
              </div>
              <span className="pl-10">Sent Requests</span>
              <div className="rArrow">
                <i className="right_icon"></i>
              </div>
            </Link>

            <Link
              to="/friends/suggestions"
              className={`mmenu_item hover3 ${
                type === "suggestions" && "active_friends"
              }`}
            >
              <div className="mmenu_item hover3">
                <div className="iconBox">
                  {/* <i className="friends_suggestions_icon"></i> */}
                  <img src="../../../left/find.png" />
                </div>
                <span className="pl-10">Suggestions</span>
                <div className="rArrow">
                  <i className="right_icon"></i>
                </div>
              </div>
            </Link>
            <Link
              to="/friends/all"
              className={`mmenu_item hover3 ${
                type === "all" && "active_friends"
              }`}
            >
              <div className="iconBox">
                <img src="../../../left/friends.png" />
                {/* <i className="all_friends_icon"></i> */}
              </div>
              <span className="pl-10">All Friends</span>
              <div className="rArrow">
                <i className="right_icon"></i>
              </div>
            </Link>
          </div>
        </div>
        <div className="friends_right">
          {(type === undefined || type === "requests") && (
            <div className="friends_right_wrap">
              <div className="friends_left_header">
                <h3>Friend Requests</h3>
                {type === undefined && (
                  <Link to="/friends/requests" className="see_link hover3">
                    See all
                  </Link>
                )}
              </div>
              <div className="flex_wrap">
                {data.requests &&
                  data.requests.map((user) => (
                    <Card
                      userr={user}
                      key={user._id}
                      type="request"
                      getData={getData}
                    />
                  ))}
              </div>
            </div>
          )}
          {(type === undefined || type === "sent") && (
            <div className="friends_right_wrap">
              <div className="friends_left_header">
                <h3>Sent Requests</h3>
                {type === undefined && (
                  <Link to="/friends/sent" className="see_link hover3">
                    See all
                  </Link>
                )}
              </div>
              <div className="flex_wrap">
                {data.sentRequests &&
                  data.sentRequests.map((user) => (
                    <Card
                      userr={user}
                      key={user._id}
                      type="sent"
                      getData={getData}
                    />
                  ))}
              </div>
            </div>
          )}
          {(type === undefined || type === "all") && (
            <div className="friends_right_wrap">
              <div className="friends_left_header">
                <h3>Friends</h3>
                {type === undefined && (
                  <Link to="/friends/all" className="see_link hover3">
                    See all
                  </Link>
                )}
              </div>
              <div className="flex_wrap">
                {data.friends &&
                  data.friends.map((user) => (
                    <Card
                      userr={user}
                      key={user._id}
                      type="friends"
                      getData={getData}
                    />
                  ))}
              </div>
            </div>
          )}

          {type === "suggestions" && (
            <div className="friends_right_wrap">
              <div className="friends_left_header">
                <h3>People you may know</h3>
                {type === undefined && (
                  <Link to="/friends/all" className="see_link hover3">
                    See all
                  </Link>
                )}
              </div>
              <div className="flex_wrap">
                {users &&
                  users.map((user) => (
                    <Card
                      userr={user}
                      key={user._id}
                      type="friends"
                      getData={getData}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
