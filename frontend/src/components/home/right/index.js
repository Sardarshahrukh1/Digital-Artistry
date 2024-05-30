import { Dots, NewRoom, Search } from "../../../svg";
import Contact from "./Contact";
import "./style.css";
export default function RightHome({ user }) {
  const color = "#65676b";
  return (
    <div className="right_home">
      {/* <div className="heading">Sponsored</div>
      <div className="splitter1"></div> */}
      <div className="contacts_wrap">
        <div className="contacts_header">
          <div className="contacts_header_left">Friends</div>
          {}
        </div>
        <div className="contacts_list">
          <Contact user={user} />
        </div>
      </div>
    </div>
  );
}
