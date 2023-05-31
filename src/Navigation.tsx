import "./Navigation.css";
import React from "react";
import NavigationItem from "./NavigationItem";
import { Subreddit } from "./types";

type Props = {
  items: Array<Subreddit> | undefined;
};

export default function Navigation(props: Props) {
  const sortedItems = props.items?.slice().sort(
    (a, b) =>
      // Sort by # of subscribers in descending order
      b.data.subscribers - a.data.subscribers
  );

  return (
    <div className="navigation">
      <div className="header">Navigation</div>
      <ul>
        {sortedItems?.map((item) => (
          <NavigationItem item={item} key={item.data.id} />
        ))}
      </ul>
    </div>
  );
}
