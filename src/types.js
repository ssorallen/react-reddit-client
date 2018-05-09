/* @flow */

export interface Story {
  data: {
    author: string,
    id: string,
    score: number,
    title: string,
    url: string,
  };
  kind: 't3';
}

export interface Subreddit {
  data: {
    display_name: string,
    id: string,
    subscribers: number,
    title: string,
    url: string,
  };
  kind: 't5';
}

export interface ResponseStories {
  data: {
    children: Array<Story>,
  };
  kind: 'Listing';
}

export interface ResponseSubreddits {
  data: {
    children: Array<Subreddit>,
  };
  kind: 'Listing';
}
