/* @flow */
import "./StoryList.css";
import React from "react";
import { Story } from "./types";

interface Props {
  items: Array<Story>;
}

export default function StoryList(props: Props) {
  return (
    <table>
      <tbody>
        {props.items.map((item) => (
          <tr className="story" key={item.data.id}>
            <td>
              <div className="score">{item.data.score}</div>
            </td>
            <td>
              <h3 className="title">
                <a href={item.data.url}>{item.data.title}</a>
              </h3>
              <div className="author">
                posted by{" "}
                <a href={`https://www.reddit.com/user/${item.data.author}`}>{item.data.author}</a>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
