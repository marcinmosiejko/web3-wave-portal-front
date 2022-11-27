import React from 'react';
import { Wrapper } from './PopupMessage.styles';
import PropTypes from 'prop-types';
import { defaultError } from 'helpers/popupMessages';

const PopupMessage = ({ popupMessage = defaultError }) => {
  return (
    <Wrapper popupType={popupMessage.type}>
      <h2>{popupMessage.title}</h2>
      <p>{popupMessage.message}</p>
    </Wrapper>
  );
};

PopupMessage.propTypes = {
  popupMessage: PropTypes.object,
};

export default PopupMessage;
