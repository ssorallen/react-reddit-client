import './App.css';
import Navigation from './Navigation';
import React from 'react';
import StoryList from './StoryList';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeNavigationUrl: "",
      navigationItems: [],
      storyItems: [],
      title: "Please select a sub"
    };
  }

  componentDidMount() {
    var _this = this;
    var cbname = `fn${Date.now()}`;
    var script = document.createElement("script");
    script.src = `https://www.reddit.com/reddits.json?jsonp=${cbname}`;

    window[cbname] = function(jsonData) {
      _this.setState({
        navigationItems: jsonData.data.children
      });
      delete window[cbname];
      document.head.removeChild(script);
    };

    document.head.appendChild(script);
  }

  setSelectedItem = (item) => {
    var _this = this;
    var cbname = `fn${Date.now()}`;
    var script = document.createElement("script");
    script.src = `https://www.reddit.com${item.data.url}.json?sort=top&t=month&jsonp=${cbname}`;

    window[cbname] = function(jsonData) {
      _this.setState({storyItems: jsonData.data.children});
      delete window[cbname];
      document.head.removeChild(script);
    };

    document.head.appendChild(script);

    this.setState({
      activeNavigationUrl: item.data.url,
      storyItems: [],
      title: item.data.display_name
    });
  };

  render() {
    return (
      <div>
        <h1>{this.state.title}</h1>
        <Navigation
          activeUrl={this.state.activeNavigationUrl}
          items={this.state.navigationItems}
          itemSelected={this.setSelectedItem}
        />
        <StoryList items={this.state.storyItems} />
      </div>
    );
  }
}
