import './StoryList.css';
import React from 'react';

export default class StoryList extends React.Component {
  render() {
    return (
      <table>
        <tbody>
          {this.props.items.map(item =>
            <tr key={item.data.id}>
              <td>
                <p className="score">{item.data.score}</p>
              </td>
              <td>
                <p className="title">
                  <a href={item.data.url}>
                    {item.data.title}
                  </a>
                </p>
                <p className="author">
                  Posted by <span>{item.data.author}</span>
                </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }
}
