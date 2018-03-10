import React, { Component } from 'react';
import { FormControl, FormGroup, Button } from 'react-bootstrap';
import { validateYouTubeUrl } from '../Util';

class UrlComponent extends Component {
  constructor(props) {
    super(props);
    this.handleClick = props.handleClick;
    this.state = {
      url: '',
    };
  }
  
  handleChange(e) {
    this.setState({ url: e.target.value });
  }

  render() {
    const url = this.state.url;
    console.log(url);
    return (
      <form>
        <FormGroup bsSize="large" 
          controlId="urlControl"
          validationState={validateYouTubeUrl(url) == null ? 'error' : 'success'}
        >
          <FormControl type="text" value={this.state.url} 
            placeholder="Enter YouTube URL"
            onChange={(e) => this.handleChange(e)}/>
        </FormGroup>
        <Button onClick={() => this.handleClick(url)}>Search</Button>
      </form>
    );
  }
}

export default UrlComponent;