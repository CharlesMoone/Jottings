import React from 'react';
import { Link } from 'react-router-dom';

export default class extends React.PureComponent {
  render() {
    return [
      <h1 key="title">Unauthorized</h1>,
      <Link to="/login">Login to chagne your authority</Link>
    ];
  }
}
