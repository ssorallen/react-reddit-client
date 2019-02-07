/* @flow */

import './Navigation.css';
import React, { useMemo } from 'react';
import NavigationItem from './NavigationItem';
import { Subreddit } from './types';

type Props = {
  activeUrl: ?string,
  items: Array<Subreddit>,
  itemSelected: (item: Subreddit) => void,
};

export default function Navigation(props: Props) {
  const sortedItems = useMemo(
    () =>
      props.items.slice().sort(
        (a, b) =>
          // Sort by # of subscribers in descending order
          b.data.subscribers - a.data.subscribers
      ),
    [props.items]
  );

  return (
    <div className="navigation">
      <div className="header">Navigation</div>
      <ul>
        {sortedItems.map(item => (
          <NavigationItem
            item={item}
            itemSelected={props.itemSelected}
            key={item.data.id}
            selected={item.data.url === props.activeUrl}
          />
        ))}
      </ul>
    </div>
  );
}
