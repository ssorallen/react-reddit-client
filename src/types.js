/* @flow */

export interface Story {
  data: {
    author: string;
    id: string;
    score: number;
    title: string;
    url: string;
  };
  kind: 't3';
}

export interface Subreddit {
  data: {
    display_name: string;
    id: string;
    subscribers: number;
    title: string;
    url: string;
  };
  kind: 't5';
}
