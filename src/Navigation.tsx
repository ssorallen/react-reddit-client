import "./Navigation.css";
import NavigationItem from "./NavigationItem";
import { reddit } from "./types";

type Props = {
  items: Array<reddit.Subreddit> | undefined;
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
