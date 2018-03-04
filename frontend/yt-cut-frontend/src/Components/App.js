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
      imgSrc : null, description: 'Temporary description',
      meta: [], parts: [], videoId: null, 
      selectedMeta: null, sessionId: null
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
      fetch(`http://localhost:8080/media?youtubeHashId=${videoId}`)
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
            selectedMeta: link
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
      parts: [...parts, {id: parts.length}
      ]});
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
      return {...prevState, sessionId: sId};
    });
    /*    fetch(`http://localhost:8080/get?${sId}`,
      { method: 'GET',
        body: JSON.stringify({...})

      })
      .then();*/
  }

  onSubmitButtonClick(meta, parts) {
    const track_list = parts.map(part => (
      { start : part['from ' + part.id],
        duration: part['to ' + part.id],
        album_name: part['name ' + part.id],
        name: part['name ' + part.id]
      })
    );
    const json_body = JSON.stringify({
      'tracks': track_list,
      'media': meta
    });
    fetch('http://localhost:8080/cut?sessionId=1', 
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
    const meta = this.state.selectedMeta;
    const parts = this.state.parts;
    return (<Button onClick={() => this.onSubmitButtonClick(meta, parts)}>Convert</Button>);
  }

  render() {
    console.log('Session id ' + this.state.sessionId);
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
                <Media.Body>
                  <Media.Heading> Monolake - Indigo </Media.Heading>
                  <p> 
                    {this.state.description}
                  </p>
                </Media.Body>
              </Media>
              {this.metaList()}
              {this.partList()}
              {this.submitButton()}
            </React.Fragment>
          }
          {this.state.sessionId != null 
            &&
            <TrackList sId={this.state.sessionId} parts={this.state.parts}/>
          }
        </div>
      </div>
    );
  }
}

export default App;
/*
            <ListGroupItem bsStyle="info"><ReactAudioPlayer
              src="autechre.mp3"
              style={{width:'100%', height: '80%', right: 0, top: 0}}
              controls /></ListGroupItem>
            <ListGroupItem bsStyle="warning">Warning</ListGroupItem>
            <ListGroupItem bsStyle="danger">Danger</ListGroupItem>

            */

/*            &&
            <ListGroup componentClass="ul">
              <li className="list-group-item">
                <Grid>
                  <Row>
                    <Col xs={12} md={4}>
                      <p>Oneohtrix Point Never — Very long pretentious track name which is very boring</p>
                    </Col>
                    <Col xs={12} md={8}>
                      <ReactAudioPlayer
                        src="https://localhost:8080/track?1"
                        style={{width:'100%'}}
                        controls/>
                    </Col>
                  </Row>
                </Grid>
              </li>
            </ListGroup>*/