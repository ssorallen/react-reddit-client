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
  storiesCallbackName: ?string;

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
    const documentHead = document.head;
    if (documentHead == null) throw new Error('No <head> to use for script injection.');

    const cbname = `fn${Date.now()}`;
    const script = document.createElement('script');
    script.src = `https://www.reddit.com/reddits.json?jsonp=${cbname}`;
    window[cbname] = (jsonData: ResponseSubreddits) => {
      this.setState({
        navigationItems: jsonData.data.children,
      });
      delete window[cbname];
      documentHead.removeChild(script);
    };

    // Start the JSONP request by injecting the `script` into the document.
    documentHead.appendChild(script);
  }

  setSelectedItem = (item: Subreddit) => {
    const documentHead = document.head;
    if (documentHead == null) throw new Error('No <head> to use for script injection.');

    const cbname = (this.storiesCallbackName = `fn${Date.now()}`);
    const script = document.createElement('script');
    script.src = `https://www.reddit.com${item.data.url}.json?sort=top&t=month&jsonp=${cbname}`;
    window[cbname] = (jsonData: ResponseStories) => {
      // Use the response only if this is still the latest script to run. If the user clicked
      // another Subreddit in the meantime, the `cbname` will be different and this response should
      // be ignored.
      //
      // The `<script>` must stay in the document even if the response is not needed because
      // otherwise the JSONP request will try to call a nonexistent script. Leave it in the `<head>`
      // so it can clean up after itself but make it do nothing other than clean up.
      if (cbname === this.storiesCallbackName) {
        this.setState({ storyItems: jsonData.data.children });
      }

      delete window[cbname];
      documentHead.removeChild(script);
    };

    // Start the JSONP request by setting the `src` of the injected script.
    documentHead.appendChild(script);

    this.setState({
      activeNavigationUrl: item.data.url,
      storyItems: [],
      title: item.data.display_name,
    });
  };

  render() {
    return (
      <React.Fragment>
        <p className="creator">
          Created by <a href="https://github.com/ssorallen">ssorallen</a>
          <br />
          Code at{' '}
          <a href="https://github.com/ssorallen/react-reddit-client">
            ssorallen/react-reddit-client
          </a>
        </p>
        <h1>{this.state.title}</h1>
        <Navigation
          activeUrl={this.state.activeNavigationUrl}
          items={this.state.navigationItems}
          itemSelected={this.setSelectedItem}
        />
        <StoryList items={this.state.storyItems} />
      </React.Fragment>
    );
  }
}
