import "./App.css";
import { Outlet, ScrollRestoration, json, useLoaderData, useParams } from "react-router-dom";
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

    function removeScript() {
      // @ts-expect-error
      delete window[cbname];
      documentHead.removeChild(script);
    }

    script.src = `https://www.reddit.com/reddits.json?jsonp=${cbname}`;
    script.onerror = () => {
      reject(
        json("", {
          status: 404,
          statusText: "Error loading subreddits. Refresh the page to try again.",
        })
      );
      removeScript();
    };

    // @ts-expect-error
    window[cbname] = (jsonData: ResponseSubreddits) => {
      resolve({
        subreddits: jsonData.data.children,
      });
      removeScript();
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
      <aside className="d-flex flex-column">
        <div className="creator my-2">
          Created by <a href="https://github.com/ssorallen">ssorallen</a>
          <br />
          Code at{" "}
          <a href="https://github.com/ssorallen/react-reddit-client">
            ssorallen/react-reddit-client
          </a>
        </div>
        <Navigation items={subreddits} />
      </aside>
      <div className="container-fluid">
        <h1>
          {selectedSubreddit == null ? "Please select a sub" : selectedSubreddit.data.display_name}
        </h1>
        <Outlet />
      </div>
      <ScrollRestoration />
    </>
  );
}
