import "bootstrap/dist/css/bootstrap.css";
import { RouterProvider, createHashRouter } from "react-router-dom";
import App, { loader } from "./App";
import ErrorPage from "./ErrorPage";
import React from "react";
import ReactDOM from "react-dom/client";
import StoryList, { loader as storyListLoader } from "./StoryList";

const root = document.getElementById("root");
if (root == null) throw new Error("Missing #root element in the DOM");

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    loader,
    children: [
      {
        path: "/r/:subreddit",
        element: <StoryList />,
        errorElement: <ErrorPage />,
        id: "subreddit",
        loader: ({ params }) => storyListLoader(params.subreddit),
      },
    ],
  },
]);

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
