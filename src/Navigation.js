/* @flow */
import './Navigation.css';
import React, { useCallback, useMemo } from 'react';
import NavigationItem from './NavigationItem';
import { Subreddit } from './types';

type Props = {
  activeUrl: ?string;
  items: Array<Subreddit>;
  itemSelected: (item: Subreddit) => void;
}

export default function Navigation(props: Props) {
  const setSelectedItem = useCallback(
    (item: Subreddit) => {
      props.itemSelected(item);
    },
    []
  );

  const sortedItems = useMemo(
    () => {
      return props.items.slice().sort(
        (a, b) =>
          // Sort by # of subscribers in descending order
          b.data.subscribers - a.data.subscribers
      );
    },
    [props.items]
  );

  return (
    <div className="navigation">
      <div className="header">Navigation</div>
      <ul>
        {sortedItems.map(item => (
          <NavigationItem
            item={item}
            itemSelected={setSelectedItem}
            key={item.data.id}
            selected={item.data.url === props.activeUrl}
          />
        ))}
      </ul>
    </div>
  );
}
