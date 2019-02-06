/* @flow */
import React from 'react';
import { Subreddit } from './types';

type Props = {
  item: Subreddit,
  itemSelected: (item: Subreddit) => void,
  selected: boolean,
};

export default function NavigationItem(props: Props) {
  return (
    <li
      onClick={() => {
        props.itemSelected(props.item);
      }}
      className={props.selected ? 'selected' : ''}>
      {props.item.data.display_name}
    </li>
  );
}
