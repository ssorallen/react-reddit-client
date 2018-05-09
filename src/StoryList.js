/* @flow */
import './StoryList.css';
import React from 'react';
import { Story } from './types';

interface Props {
  items: Array<Story>;
}

// Because this component has no state and needs no instance methods, it is implemented as a
// [stateless functional component][0], i.e. a plain JavaScript function.
//
// [0]: https://reactjs.org/docs/components-and-props.html#functional-and-class-components
export default function StoryList(props: Props) {
  return (
    <table>
      <tbody>
        {props.items.map(item => (
          <tr key={item.data.id}>
            <td>
              <p className="score">{item.data.score}</p>
            </td>
            <td>
              <p className="title">
                <a href={item.data.url}>{item.data.title}</a>
              </p>
              <p className="author">
                Posted by <span>{item.data.author}</span>
              </p>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
