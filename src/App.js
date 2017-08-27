/* @flow */
import './App.css';
import {ResponseStories, ResponseSubreddits, Story, Subreddit} from './types';
import Navigation from './Navigation';
import React from 'react';
import StoryList from './StoryList';

interface State {
  activeNavigationUrl: string;
  navigationItems: Array<Subreddit>;
  storyItems: Array<Story>;
  title: string;
}

export default class App extends React.Component<{}, State> {
  constructor() {
    super();
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

    window[cbname] = function(jsonData: ResponseSubreddits) {
      _this.setState({
        navigationItems: jsonData.data.children
      });
      delete window[cbname];
      // $FlowFixMe
      document.head.removeChild(script);
    };

    // $FlowFixMe
    document.head.appendChild(script);
  }

  setSelectedItem = (item: Subreddit) => {
    var _this = this;
    var cbname = `fn${Date.now()}`;
    var script = document.createElement("script");
    script.src = `https://www.reddit.com${item.data.url}.json?sort=top&t=month&jsonp=${cbname}`;

    window[cbname] = function(jsonData: ResponseStories) {
      _this.setState({storyItems: jsonData.data.children});
      delete window[cbname];
      // $FlowFixMe
      document.head.removeChild(script);
    };

    // $FlowFixMe
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
