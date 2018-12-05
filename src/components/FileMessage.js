'use strict'

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { CSSTransitionGroup } from 'react-transition-group'

import FilePreview from './FilePreview'

import {
  getHumanReadableSize,
  isAudio,
  isHighlightable,
  isImage,
  isVideo
} from '../utils/file-helpers'

import '../styles/FileMessage.scss'

function FileMessage ({ t, animationProps, hash, name, size, ...rest }) {
  const [showPreview, setShowPreview] = useState(false)

  async function handleNameClick () {
    if (
      !showPreview &&
      (!isImage(name) && !isHighlightable(name) && !isAudio(name) && !isVideo(name))
    ) {
      return
    }
    setShowPreview(!showPreview)
  }

  const ipfsLink =
    (window.gatewayAddress ? 'http://' + window.gatewayAddress : 'https://ipfs.io/ipfs/') + hash

  return (
    <div className="FileMessage">
      <CSSTransitionGroup {...animationProps}>
        <span className="name" onClick={handleNameClick}>
          {name}
        </span>
        <span className="size">{getHumanReadableSize(size)}</span>
        <a className="download" href={ipfsLink} target="_blank" rel="noopener noreferrer">
          {t('channel.file.open')}
        </a>
        <a className="download" href={ipfsLink} download={name}>
          {t('channel.file.download')}
        </a>
        <FilePreview
          t={t}
          animationProps={animationProps}
          hash={hash}
          name={name}
          show={showPreview}
          {...rest}
        />
      </CSSTransitionGroup>
    </div>
  )
}

FileMessage.propTypes = {
  t: PropTypes.func.isRequired,
  animationProps: PropTypes.object.isRequired,
  hash: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired
}

export default FileMessage
