import { useState } from "react";
import { Form, Input, Button, Modal, Flex, Typography } from "antd";
import { WalletOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import DisplayAccessibility from "./DisplayAccessibility";
import HelpSupport from "./HelpSupport";
import SettingsPrivacy from "./SettingsPrivacy";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";

const { Title } = Typography;

export default function UserMenu({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(0);

  const logout = () => {
    Cookies.set("user", "");
    dispatch({
      type: "LOGOUT",
    });
    navigate("/login");
  };

  const onClickWalletBtn = () => {
    navigate("/wallet");
  };
  const onClickValidatorBtn = () => {
    navigate("/validator");
  };

  return (
    <div className="mmenu">
      {visible === 0 && (
        <div>
          <Link to="/profile" className="mmenu_header hover3">
            <img src={user?.picture} alt="" />
            <div className="mmenu_col">
              <span>
                {user?.first_name} {user?.last_name}
              </span>
              <span>See your profile</span>
            </div>
          </Link>
          <div className="mmenu_splitter"></div>

          <div className="mmenu_item hover3" onClick={onClickWalletBtn}>
            <div className="small_circle">
              <i className="settings_filled_icon"></i>
            </div>
            <span>Wallet</span>
          </div>

          <div className="mmenu_item hover3" onClick={onClickValidatorBtn}>
            <div className="small_circle">
              <i className="settings_filled_icon"></i>
            </div>
            <span>Validator</span>
          </div>

          <div
            className="mmenu_item hover3"
            onClick={() => {
              logout();
            }}
          >
            <div className="small_circle">
              <i className="logout_filled_icon"></i>
            </div>
            <span>Logout</span>
          </div>
        </div>
      )}
      {visible === 1 && <SettingsPrivacy setVisible={setVisible} />}
      {visible === 2 && <HelpSupport setVisible={setVisible} />}
      {visible === 3 && <DisplayAccessibility setVisible={setVisible} />}
    </div>
  );
}
