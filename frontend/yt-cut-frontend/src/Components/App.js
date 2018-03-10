import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Grid, Media, Image,
  ListGroup, ListGroupItem, CustomComponent, Row, Col, Form, Dropdown, Nav, NavItem } from 'react-bootstrap';
import ReactAudioPlayer from 'react-audio-player';
import logo from './../logo.svg';
import UrlComponent from './UrlComponent';
import TrackList from './TrackList.js';
import { validateYouTubeUrl } from '../Util';
import './../App.css';
import PartList from './PartList';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgSrc : null, meta: [], parts: [], 
      videoId: null, album_name: '',
      parts_history: {}, 
      selected_meta: null, sessions: []
    };
  }

  thumb(id) {
    return `http://img.youtube.com/vi/${id}/0.jpg`;
  }

  handleSearchClick(url) {
    const valid = validateYouTubeUrl(url);
    console.log(valid);
    if (valid) {
      const videoId = valid[4];
      fetch(`media?youtubeHashId=${videoId}`)
        .then(response => response.json())
        .then(response => { 
          console.log(response);
          return {
            meta: response.map((media) => {
              return {
                youtubeHash: videoId,
                url: media.url,
                quality: media.quality,
                format: media.format,
              };
            }), 
            parts: [{id: 0}]
          };
        }).then(json => {
          console.log(json);
          const newState = {
            meta: json.meta,
            parts: json.parts,
            videoId: videoId,
            imgSrc: this.thumb(videoId)
          };
          this.setState(newState);
        }).catch(err => {
          console.log(err);
        });
    }
  }

  metaList() {
    const links = this.state.meta;
    const items = links.map((link) => { 
      return (<NavItem key={link.url} 
        onSelect={() => this.setState(prevState => { 
          return {...prevState, 
            selected_meta: link
          };
        })}
      >{`${link.format}/${link.quality}`}</NavItem>);
    });
    return (<Nav bsStyle="pills" stacked>
      {items}
    </Nav>);
  }
   
  handleChange(id, e) {
    const parts = this.state.parts;
    this.setState({parts: parts.map(
      (part) => {
        return part.id === id ? {...part, [e.target.name]: e.target.value} : part;
      })
    });
  }

  onAddPartClick() {
    const parts = this.state.parts;
    this.setState({
      parts: [...parts, {id: parts.length}]
    });
  }

  handleAlbumChange(e) {
    console.log(`album_name: ${e.target.value}`);
    this.setState({album_name: e.target.value});
  }

  albumName() {
    return (
      <form>
        <FormGroup bsSize="large" 
          controlId="urlControl">
          <FormControl type="text" value={this.state.album_name}
            placeholder="Album Name"
            onChange={(e) => this.handleAlbumChange(e)}
          />
        </FormGroup>
      </form>
    );
  }

  partList() {
    console.log(this.state.parts);
    return (<PartList parts={this.state.parts} 
      handleChange={(id, e) => this.handleChange(id, e)}
      onAddPartClick={() => this.onAddPartClick()}/>
    );
  }

  onNewSession(sId) {
    console.log('onNewSesion ' + sId);
    this.setState((prevState) => {
      return {...prevState, 
        parts_history: {...prevState.parts_history, [sId]: [...prevState.parts]},
        parts: [{id: 0}], sessions: [...prevState.sessions, sId]};
    });
    /*    fetch(`http://localhost:8080/get?${sId}`,
      { method: 'GET',
        body: JSON.stringify({...})

      })
      .then();*/
  }

  onSubmitButtonClick(meta, parts) {
    const track_list = parts.map(part => (
      { start : part['start'],
        duration: part['duration'],
        album_name: this.state.album_name,
        name: part['name']
      })
    );
    const json_body = JSON.stringify({
      'tracks': track_list,
      'media': meta
    });
    fetch('cut?sessionId=1', 
      { method: 'POST', 
        mode: 'cors',
        headers: {'Content-Type': 'application/json'},
        body: json_body
        //      , sessionId: 1
      }
    ).then(response => response.json()
    ).then(json => this.onNewSession(json['queryId']));
  }

  submitButton() {
    const meta = this.state.selected_meta;
    const parts = this.state.parts;
    return (<Button onClick={() => this.onSubmitButtonClick(meta, parts)}>Convert</Button>);
  }

  trackLists() {
    console.log("Sessions: " + this.state.sessions);
    const listView = this.state.sessions.map(sId => (
      <li key={sId} className="list-group-item">
        <TrackList sId={sId} parts={this.state.parts_history[sId]}/>
      </li>
    ));
    return (
      <ListGroup componentClass="ul">{listView}</ListGroup>
    );
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <UrlComponent handleClick={(url) => this.handleSearchClick(url)}/>
        </header>
        <div className="App">
          {this.state.videoId != null 
            && 
            <React.Fragment>
              <Media style={{marginBottom: '10px', marginTop: '5px'}}>
                <Media.Left align="middle">
                  <Image src={this.state.imgSrc} />
                </Media.Left>
              </Media>
              {this.metaList()}
              {this.albumName()}
              {this.partList()}
              {this.submitButton()}
            </React.Fragment>
          }
          {this.state.sessions != []
            &&
            this.trackLists()
          }
        </div>
      </div>
    );
  }
}

export default App;
