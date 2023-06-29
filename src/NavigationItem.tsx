import { NavLink } from "react-router-dom";
import { reddit } from "./types";

type Props = {
  item: reddit.Subreddit;
};

export default function NavigationItem({ item }: Props) {
  return (
    <li>
      <NavLink className={({ isActive }) => (isActive ? "selected" : undefined)} to={item.data.url}>
        {item.data.display_name}
      </NavLink>
    </li>
  );
}
