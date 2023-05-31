import { NavLink } from "react-router-dom";
import React from "react";
import { Subreddit } from "./types";

type Props = {
  item: Subreddit;
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
