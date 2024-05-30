import { ArrowRight, Plus } from "../../../svg";
import "./style.css";
import { stories } from "../../../data/home";
import Story from "./Story";
import { useMediaQuery } from "react-responsive";
export default function Stories() {
  const query1175px = useMediaQuery({
    query: "(max-width: 1175px)",
  });
  const query1030px = useMediaQuery({
    query: "(max-width: 1030px)",
  });
  const query960px = useMediaQuery({
    query: "(max-width: 960px)",
  });
  const query885px = useMediaQuery({
    query: "(max-width: 885px)",
  });
  const max = query885px
    ? 5
    : query960px
    ? 4
    : query1030px
    ? 5
    : query1175px
    ? 4
    : stories.length;
  return <div className="stories"></div>;
}
