import React from 'react';

export default class NavigationItem extends React.Component {
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
