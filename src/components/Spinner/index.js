'use strict'

import React from 'react'
import PropTypes from 'prop-types'

import MoonLoader from './MoonLoader'

function Spinner ({ className, theme, loading, ...rest }) {
  if (!loading) return null

  return (
    <div className={className} style={theme}>
      <MoonLoader className="spinnerIcon" {...rest} />
    </div>
  )
}

Spinner.defaultProps = {
  className: 'spinner',
  color: 'rgba(255, 255, 255, 0.7)',
  loading: true,
  size: '16px'
}

Spinner.propTypes = {
  className: PropTypes.string,
  loading: PropTypes.bool,
  color: PropTypes.string,
  size: PropTypes.string
}

export default Spinner
