import React from 'react'

class LayoutContainer extends React.Component {
  render() {
    return(
      <div>
        {this.props.children}
      </div>
    )
  }
}

export default LayoutContainer
