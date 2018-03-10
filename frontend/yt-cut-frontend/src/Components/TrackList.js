import { ListGroup, Panel, ProgressBar } from 'react-bootstrap';
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
    console.log('Updating Track list state ' + json);
    const tracks = json['tracks'];
    const est_time = 100 - json['mediaProgress'];
    const min_id = Math.min(...tracks);
    const new_state = {
      tracks: tracks.map(id => ({
        name: this.props.parts[id - min_id].name,
        id: id,
        src: `track?id=${id}`
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
      clearInterval(this.state.timer_id);
    }
    this.setState(new_state);
  }

  requestState() {
    fetch(`/get?queryId=${this.props.sId}`)
      .then(response => response.json())
      .then(json => this.updateState(json));
  }

  componentDidMount() {
    if (this.state['status'] != 'Done') {
      const timer_id = setInterval(() => this.requestState(), 2500);
      this.setState({timer_id: timer_id});
    }
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
            <ProgressBar now={100 - est_time} 
              bsStyle={this.state['status'] == 'Done' ? 'success' : 'info'}/>
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