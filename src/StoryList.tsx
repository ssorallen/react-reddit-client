import "./StoryList.css";
import React from "react";
import { Story } from "./types";
import { useLoaderData } from "react-router-dom";

// Pending callback name for the stories request. This lives outside the `App` because it assumes
// only a single `App` is rendered at a given time. This JS module is the scope of this callback
// name and would need to be changed to support multiple Apps on a given page.
let storiesCallbackName: string | null = null;

export async function loader(subreddit: string | undefined): Promise<{ stories: Array<Story> }> {
  return new Promise((resolve, reject) => {
    if (subreddit == null) {
      reject("No subreddit to load stories for.");
    }

    const documentHead = document.head;
    if (documentHead == null) {
      reject("No <head> to use for script injection.");
      return;
    }

    const cbname = (storiesCallbackName = `fnStoryList${Date.now()}`);
    const script = document.createElement("script");
    script.src = `https://www.reddit.com/r/${subreddit}.json?sort=top&t=month&jsonp=${cbname}`;
    // @ts-expect-error
    window[cbname] = (jsonData: ResponseStories) => {
      // Use the response only if this is still the latest script to run. If the user clicked
      // another Subreddit in the meantime, the `cbname` will be different and this response should
      // be ignored.
      //
      // The `<script>` must stay in the document even if the response is not needed because
      // otherwise the JSONP request will try to call a nonexistent script. Leave it in the `<head>`
      // so it can clean up after itself but make it do nothing other than clean up.
      if (cbname === storiesCallbackName) {
        resolve({
          stories: jsonData.data.children,
        });
      }

      // @ts-expect-error
      delete window[cbname];
      documentHead.removeChild(script);
    };

    // Start the JSONP request by setting the `src` of the injected script.
    documentHead.appendChild(script);
  });
}

export default function StoryList() {
  const { stories } = useLoaderData() as { stories: Array<Story> };

  return (
    <table>
      <tbody>
        {stories.map((story) => (
          <tr className="story" key={story.data.id}>
            <td>
              <div className="score">{story.data.score}</div>
            </td>
            <td>
              <h3 className="title">
                <a href={story.data.url}>{story.data.title}</a>
              </h3>
              <div className="author">
                posted by{" "}
                <a href={`https://www.reddit.com/user/${story.data.author}`}>{story.data.author}</a>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
