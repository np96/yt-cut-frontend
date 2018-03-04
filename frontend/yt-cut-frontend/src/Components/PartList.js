import React, { Component } from 'react';
import { ListGroup, FormGroup, FormControl, Col, Row, Grid, Button, Form  } from 'react-bootstrap';

class PartList extends Component {
  constructor(props) {
    super(props);
    this.state = {visible: `${props.parts.length > 0}`, parts: [...props.parts]};
    this.handleChange = props.handleChange;
    this.onButtonClick = props.onAddPartClick;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({parts: [...nextProps.parts]});  
  }

  handleUpdate(p) {
    this.setState({parts: p.target.value, visible: `${p.target.value.length > 0}`});
  }

  render() {
    console.log('render:' + this.state.parts.map(part => part.id));
    const partsView = this.state.parts.map((part) => {
      return (
        <li key={part.id} className="list-group-item">
          <Form>
            <Grid>
              <Row>
                <Col xs={12} md={8}>
                  <FormGroup controlId="trackName">
                    <FormControl type="text"
                      name={'name ' + part.id}
                      placeholder="Track name"
                      onChange = {(e) => this.handleChange(part.id, e)} />
                  </FormGroup>
                </Col>
                <Col xs={6} md={2}>
                  <FormGroup controlId="stampFrom" value={part.from}>
                    <FormControl type="text"
                      name={'from ' + part.id} 
                      placeholder="From"
                      onChange = {(e) => this.handleChange(part.id, e)}
                    />
                  </FormGroup>
                </Col>
                <Col xs={6} md={2}>
                  <FormGroup controlId="stampTo" value={part.to}>
                    <FormControl type="text" placeholder="To"
                      name={'to ' + part.id}
                      onChange = {(e) => this.handleChange(part.id, e)}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Grid>
          </Form>
        </li>
      );
    });
    return (
      <ListGroup componentClass="ul">{partsView}
        <li key={10000} className="list-group-item">
          {this.state.parts.length > 0 && 
            <Button onClick={() => this.onButtonClick()}>
              Add Part</Button>
          }
        </li>
      </ListGroup>);
  }
}

export default PartList;