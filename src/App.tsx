import "./App.css";
import { Outlet, ScrollRestoration, useLoaderData, useParams } from "react-router-dom";
import React from "react";
import { ResponseSubreddits, Subreddit } from "./types";
import Navigation from "./Navigation";

export async function loader(): Promise<{ subreddits: Array<Subreddit> }> {
  return new Promise((resolve, reject) => {
    const documentHead = document.head;
    if (documentHead == null) {
      reject("No <head> to use for script injection.");
      return;
    }

    const cbname = `fnApp${Date.now()}`;
    const script = document.createElement("script");
    script.src = `https://www.reddit.com/reddits.json?jsonp=${cbname}`;
    // @ts-expect-error
    window[cbname] = (jsonData: ResponseSubreddits) => {
      resolve({
        subreddits: jsonData.data.children,
      });

      // @ts-expect-error
      delete window[cbname];
      documentHead.removeChild(script);
    };

    // Start the JSONP request by injecting the `script` into the document.
    documentHead.appendChild(script);
  });
}

export default function App() {
  const { subreddits } = useLoaderData() as { subreddits: Array<Subreddit> };
  const params = useParams();

  let selectedSubreddit;
  if (params.subreddit != null) {
    selectedSubreddit = subreddits.find(
      (subreddit) => subreddit.data.display_name === params.subreddit
    );
  }

  return (
    <>
      <p className="creator">
        Created by <a href="https://github.com/ssorallen">ssorallen</a>
        <br />
        Code at{" "}
        <a href="https://github.com/ssorallen/react-reddit-client">ssorallen/react-reddit-client</a>
      </p>
      <h1>
        {selectedSubreddit == null ? "Please select a sub" : selectedSubreddit.data.display_name}
      </h1>
      <Navigation items={subreddits} />
      <Outlet />
      <ScrollRestoration />
    </>
  );
}
