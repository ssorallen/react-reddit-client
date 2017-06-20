import './Navigation.css';
import NavigationItem from './NavigationItem';
import React from 'react';

export default class Navigation extends React.Component {
  setSelectedItem = (item) => {
    this.props.itemSelected(item);
  };

  render() {
    var items = this.props.items
      .sort((a, b) =>
        // Sort by # of subscribers in descending order
        b.data.subscribers - a.data.subscribers
      )
      .map(item =>
        <NavigationItem
          item={item}
          itemSelected={this.setSelectedItem}
          key={item.data.id}
          selected={item.data.url === this.props.activeUrl}
        />
      );

    return (
      <div className="navigation">
        <div className="header">Navigation</div>
        <ul>
          {items}
        </ul>
      </div>
    );
  }
}
