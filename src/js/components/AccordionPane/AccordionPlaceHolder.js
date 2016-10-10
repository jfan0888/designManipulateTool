import './AccordionPane.scss';

import React, { Component } from 'react';
import { Thumbnail } from 'react-bootstrap';
import { BASE_PATH } from '../../constants/actionTypes';

export default class AccordionPlaceHolder extends Component {

  render () {
    return (
        <li>
          <Thumbnail 
            href="#" 
            className='design-thumbnail' 
            src={BASE_PATH + '/images/ajax-loader-blue.gif'} 
          />
        </li>
    );
  }
}