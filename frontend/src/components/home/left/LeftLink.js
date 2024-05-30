import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function LeftLink({ img, text, notification, url }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logout = () => {
    Cookies.set("user", "");
    dispatch({
      type: "LOGOUT",
    });
    navigate("/login");
  };
  const onClickItem = () => {
    if (url == "logout") {
      return logout();
    }
    navigate(`/${url}`);
  };
  return (
    <div className="left_link hover1" onClick={onClickItem}>
      <img src={`../../../left/${img}.png`} alt="" />
      {notification !== undefined ? (
        <div className="col">
          <div className="col_1">{text}</div>
          <div className="col_2">{notification}</div>
        </div>
      ) : (
        <span>{text}</span>
      )}
    </div>
  );
}
