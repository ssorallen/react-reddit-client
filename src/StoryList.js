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
          <tr key={item.data.id}>
            <td>
              <p className="score">{item.data.score}</p>
            </td>
            <td>
              <p className="title">
                <a href={item.data.url}>{item.data.title}</a>
              </p>
              <p className="author">
                Posted by{" "}
                <a href={`https://www.reddit.com/user/${item.data.author}`}>{item.data.author}</a>
              </p>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
