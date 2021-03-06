'use strict'

import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { CSSTransitionGroup } from 'react-transition-group'

import Logger from '../utils/logger'

import '../styles/SubmitButton.scss'
import '../styles/InputField.scss'

import uportLogo from '../images/uport.png'

const logger = new Logger()

function LoginForm ({ t, theme, onSubmit, setUsernameInputRef }) {
  const [currentLength, setCurrentLength] = useState(0)

  const usernameInputRef = useRef()

  useEffect(() => {
    if (typeof setUsernameInputRef === 'function') setUsernameInputRef(usernameInputRef)
    return () => {
      if (typeof setUsernameInputRef === 'function') setUsernameInputRef(null)
    }
  })

  return (
    <form onSubmit={e => onSubmit(e, usernameInputRef.current.value.trim())}>
      <CSSTransitionGroup
        transitionName="loginScreenAnimation"
        transitionAppear={true}
        component="div"
        className="inputs"
        transitionAppearTimeout={5000}
        transitionEnterTimeout={5000}
        transitionLeaveTimeout={5000}>
        <div className="usernameRow" onClick={() => usernameInputRef.current.focus()}>
          <input
            ref={usernameInputRef}
            type="text"
            placeholder={t('login.nickname')}
            maxLength="32"
            autoFocus
            style={theme}
            onChange={() => setCurrentLength(usernameInputRef.current.value.length)}
          />
        </div>
        <div className="connectButtonRow">
          <span className="hint">
            {currentLength > 0 ? t('login.pressEnterToLogin') : t('login.orLoginWith')}
          </span>
          <input type="submit" value="Connect" style={{ display: 'none' }} />
        </div>
        <div className="lastRow">
          {currentLength === 0 ? (
            <img
              onClick={() => logger.warn('Uport Login not implemented')}
              className="logo"
              src={uportLogo}
              height="64"
            />
          ) : null}
        </div>
      </CSSTransitionGroup>
    </form>
  )
}

LoginForm.propTypes = {
  t: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  setUsernameInputRef: PropTypes.func
}

export default LoginForm
