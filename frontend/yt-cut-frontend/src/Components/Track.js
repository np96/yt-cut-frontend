import React from 'react';
import { Grid, Row, Col} from 'react-bootstrap';
import ReactAudioPlayer from 'react-audio-player';


export const Track = (props) => {
  return (<Grid>
    <Row>
      <Col xs={12} md={4}>
        <p>{props.trackName}</p>
      </Col>
      <Col xs={12} md={8}>
        <ReactAudioPlayer
          src={props.link}
          style={{width:'100%', background: 'black'}}
          controls/>
      </Col>
    </Row>
  </Grid>);
};
  