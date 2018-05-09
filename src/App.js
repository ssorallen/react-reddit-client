/* @flow */
import './App.css';
import { ResponseStories, ResponseSubreddits, Story, Subreddit } from './types';
import Navigation from './Navigation';
import React from 'react';
import StoryList from './StoryList';

interface State {
  // The active Reddit URL whose items are being rendered.
  activeNavigationUrl: string;

  // List of possible Subreddits for the user to choose in the right navigation.
  navigationItems: Array<Subreddit>;

  // The stories for the current `activeNavigationUrl` whose title and other info are shown once the
  // user navigates to a Subreddit.
  storyItems: Array<Story>;

  // Name of the current Subreddit being viewed. This is shown at the top of the page.
  title: string;
}

export default class App extends React.Component<{}, State> {
  constructor() {
    super();
    this.state = {
      activeNavigationUrl: '',
      navigationItems: [],
      storyItems: [],
      title: 'Please select a sub',
    };
  }

  componentDidMount() {
    var _this = this;
    var cbname = `fn${Date.now()}`;
    var script = document.createElement('script');
    script.src = `https://www.reddit.com/reddits.json?jsonp=${cbname}`;

    window[cbname] = function(jsonData: ResponseSubreddits) {
      _this.setState({
        navigationItems: jsonData.data.children,
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
    var script = document.createElement('script');
    script.src = `https://www.reddit.com${item.data.url}.json?sort=top&t=month&jsonp=${cbname}`;

    window[cbname] = function(jsonData: ResponseStories) {
      _this.setState({ storyItems: jsonData.data.children });
      delete window[cbname];
      // $FlowFixMe
      document.head.removeChild(script);
    };

    // $FlowFixMe
    document.head.appendChild(script);

    this.setState({
      activeNavigationUrl: item.data.url,
      storyItems: [],
      title: item.data.display_name,
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
        {/* GitHub Corners from https://github.com/tholman/github-corners */}
        <a
          aria-label="View source on Github"
          className="github-corner"
          href="https://github.com/ssorallen/react-reddit-client">
          <svg
            aria-hidden="true"
            height="80"
            style={{
              fill: '#4e5053',
              color: '#2d2d2d',
              position: 'absolute',
              top: 0,
              border: 'none',
              right: 0,
            }}
            viewBox="0 0 250 250"
            width="80">
            <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z" />
            <path
              className="octo-arm"
              d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
              fill="currentColor"
              style={{ transformOrigin: '130px 106px' }}
            />
            <path
              className="octo-body"
              d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
              fill="currentColor"
            />
          </svg>
        </a>
      </div>
    );
  }
}
