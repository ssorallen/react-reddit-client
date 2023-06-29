import "./StoryList.css";
import en from "javascript-time-ago/locale/en";
import { json, useLoaderData } from "react-router-dom";
import { reddit } from "./types";
import TimeAgo from "javascript-time-ago";

// Pending callback name for the stories request. This lives outside the `App` because it assumes
// only a single `App` is rendered at a given time. This JS module is the scope of this callback
// name and would need to be changed to support multiple Apps on a given page.
let storiesCallbackName: string | null = null;

// TODO: Support dynamic locale. All "time ago" statements will be in English for now.
TimeAgo.addDefaultLocale(en);

export async function loader(
  subreddit: string | undefined
): Promise<{ stories: Array<reddit.Story> }> {
  return new Promise((resolve, reject) => {
    if (subreddit == null) {
      reject(new Error("No subreddit to load stories for."));
    }

    const documentHead = document.head;
    if (documentHead == null) {
      reject(new Error("No <head> to use for script injection."));
      return;
    }

    const cbname = (storiesCallbackName = `fnStoryList${Date.now()}`);
    const script = document.createElement("script");

    function removeScript() {
      // @ts-expect-error Removing dynamic property from `window`.
      delete window[cbname];
      documentHead.removeChild(script);
    }

    script.onerror = () => {
      reject(
        json("", {
          status: 404,
          statusText: `Error loading stories for subreddit "${subreddit}". Refresh the page or select a different subreddit.`,
        })
      );
      removeScript();
    };
    script.src = `https://www.reddit.com/r/${subreddit}.json?sort=top&t=month&jsonp=${cbname}`;

    // @ts-expect-error Adding dynamic property to `window`.
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
      removeScript();
    };

    // Start the JSONP request by injecting the <script> into the document head.
    documentHead.appendChild(script);
  });
}

function Story({ story }: { story: reddit.Story }) {
  const timeAgo = new TimeAgo("en-US");

  // Reddit dates are seconds since epoch, but JS dates are milliseconds since epoch; multiply by
  // 1000 to convert.
  const createdDateUtc = new Date(story.data.created_utc * 1000);

  return (
    <li className="row py-1">
      <div className="col-md-1 d-flex align-items-center justify-content-end score">
        {story.data.score}
      </div>
      <div className="col-md-11">
        <h3 className="title">
          <a href={story.data.url}>{story.data.title}</a>
        </h3>
        <div className="author">
          posted by{" "}
          <a href={`https://www.reddit.com/user/${story.data.author}`}>u/{story.data.author}</a>{" "}
          <time dateTime={createdDateUtc.toLocaleString()} title={createdDateUtc.toLocaleString()}>
            {timeAgo.format(createdDateUtc)}
          </time>
        </div>
      </div>
    </li>
  );
}

export default function StoryList() {
  const { stories } = useLoaderData() as { stories: Array<reddit.Story> };

  return (
    <ul className="list-unstyled">
      {stories.map((story) => (
        <Story key={story.data.id} story={story} />
      ))}
    </ul>
  );
}
