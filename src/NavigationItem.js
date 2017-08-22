/* @flow */
import React from 'react';
import {Subreddit} from './types';

interface Props {
  item: Subreddit;
  itemSelected: (item: Subreddit) => void;
}

export default class NavigationItem extends React.Component<Props> {
  onClick = () => {
    this.props.itemSelected(this.props.item);
  };

  render() {
    return (
      <li onClick={this.onClick} className={this.props.selected ? "selected" : ""}>
        {this.props.item.data.display_name}
      </li>
    );
  }
}
