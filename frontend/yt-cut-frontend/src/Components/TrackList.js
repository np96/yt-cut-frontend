import { ListGroup, Panel } from 'react-bootstrap';
import React, { Component } from 'react';
import { Track } from './Track';


class TrackList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      est_time: 6000,
      tracks: []
    };
  }

  updateState(json) {
    console.log("Updating Track list state " + json);
    const tracks = json['tracks'];
    const est_time = 100 - json['mediaProgress'];
    const min_id = Math.min(...tracks);
    const new_state = {
      tracks: tracks.map(id => ({
        name: this.props.parts[id - min_id]['name ' + (id - min_id)],
        id: id,
        src: `http://localhost:8080/track?id=${id}`
      })),
      est_time: est_time
    };
    if (tracks.length != this.props.parts.length) {
      if (est_time > 0) {
        new_state['status'] = 'Downloading';
      } else {
        new_state['status'] = 'Converting';
      }
    } else {
      new_state['status'] = 'Done';
    }
    this.setState(new_state);
  }

  requestState() {
    fetch(`http://localhost:8080/get?queryId=${this.props.sId}`)
      .then(response => response.json())
      .then(json => setTimeout(this.updateState(json), 5000));
  }

  componentDidUpdate() {
    if (this.state['status'] != 'Done') {
      this.requestState();
    }
  }

  componentDidMount() {
    this.requestState();
  }
  
  render() {
    const est_time= this.state.est_time;
    const tracks = this.state.tracks;
    const tracksView = tracks.map(track => 
      (<li className="list-group-item" key={track.id}>
        <Track trackName={track['name']} link={track['src']}/>
      </li>)
    );
    return (
      <div className="app">
        <Panel bsStyle={est_time > 0 ? 'info' : 'success'}>
          <Panel.Body>
            {est_time > 0 ? est_time: 'Converted'}
          </Panel.Body>
        </Panel>
        <ListGroup componentClass="ul">
          {tracksView}
        </ListGroup>
      </div>
    );
  }
}

export default TrackList;