import LeftLink from "./LeftLink";
import "./style.css";
import { left } from "../../../data/home";
import { Link } from "react-router-dom";
import { ArrowDown1 } from "../../../svg";
import { useState } from "react";
import Shortcut from "./Shortcut";
export default function LeftHome({ user }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="left_home scrollbar">
      <Link to="/profile" className="left_link hover1">
        <span className="user_name">
          Welcome <br /> {user?.first_name} {user.last_name}!
        </span>
      </Link>
      {left.slice(0, 9).map((link, i) => (
        <LeftLink
          key={i}
          img={link.img}
          text={link.text}
          notification={link.notification}
          url={link.key}
        />
      ))}
    </div>
  );
}
