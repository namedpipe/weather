import React from 'react'
import Link from 'next/link'
import 'isomorphic-unfetch'
import Layout from '../components/layout'
import CurrentTemp from '../components/current-temp'
import WeatherGraph from '../components/weather-graph'
import { Button, Modal } from 'react-bootstrap';
import '../styles.css'


const pStyle = {
  textAlign: 'left'
};

class Index extends React.Component {
  constructor(props) {
    super(props)
    this.cityName = 'Des Moines'
    this.server = 'http://weather.namedpipe.net:4567'
    this.lat = '41.58'
    this.lon = '-93.62'
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      show: false
    };
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  static async getInitialProps () {
    const lat = '41.58'
    const lon = '-93.62'
    // eslint-disable-next-line no-undef
    const res = await fetch(`http://weather.namedpipe.net:4567/${lat}/${lon}/forecast.json`)
    const json = await res.json()
    return { currentTemp: json[0][1], data: json }
  }

  render () {
    return (
      <Layout title='Index'>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              <h4>Enter a ZIP code</h4>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div id="name-group" className="form-group">
              <label>ZIP Code</label>
              <input type="text" name="zip" class="form-control" placeholder="ZIP" size="5" required />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleClose}>Close</Button>
            <Button bsStyle="primary" onClick={this.handleClose}>Set Location</Button>
          </Modal.Footer>
        </Modal>

        <Button bsStyle="btn-outline-inverse" bsSize="md" onClick={this.handleShow}>
        <p className="small" style={pStyle}>Currently in</p>
        <h3 id="city">{this.cityName}</h3>
        </Button>
        <CurrentTemp currentTemp={this.props.currentTemp} />
        <WeatherGraph data={this.props.data} />

      </Layout>
    )
  }
}

export default (Index)
