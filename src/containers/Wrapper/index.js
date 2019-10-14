import React from 'react'
import PropTypes from 'prop-types'
import * as Styled from './index.styled'

export const WrapperContainer = ({ children, ...props }) => (
  <Styled.Component>
    {React.cloneElement(children, props)}
  </Styled.Component>
)

WrapperContainer.propTypes = {
  children: PropTypes.node.isRequired,
}

export default WrapperContainer
