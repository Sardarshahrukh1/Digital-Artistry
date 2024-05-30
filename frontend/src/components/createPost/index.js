import { Feeling, LiveVideo, Photo } from "../../svg";
import UserMenu from "../header/userMenu";
import "./style.css";
export default function CreatePost({ user, setVisible, profile }) {
  return (
    <div className="createPost">
      <div className="createPost_header">
        <div
          className="open_post hover2"
          onClick={() => {
            setVisible(true);
          }}
        >
          Create Post
        </div>
      </div>
      <div className="createPost_body">
      </div>
    </div>
  );
}
