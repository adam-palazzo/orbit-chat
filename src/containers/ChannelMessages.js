'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { withNamespaces } from 'react-i18next'
import classNames from 'classnames'

import Logger from '../utils/logger'
import getMousePosition from '../utils/mouse-position'

import RootStoreContext from '../context/RootStoreContext'

import { FirstMessage } from '../components/MessageTypes'
import MessagesDateSeparator from '../components/MessagesDateSeparator'

import MessageRow from './MessageRow'

const logger = new Logger()
class ChannelMessages extends React.Component {
  static contextType = RootStoreContext

  static propTypes = {
    t: PropTypes.func.isRequired,
    channel: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)

    this.messagesEl = React.createRef()
    this.messagesEnd = React.createRef()

    this.scrollToBottom = this.scrollToBottom.bind(this)
    this.onMessageUserClick = this.onMessageUserClick.bind(this)
    this.onFirstMessageClick = this.onFirstMessageClick.bind(this)
  }

  componentDidMount () {
    this.scrollToBottom()
  }

  componentDidUpdate () {
    this.scrollToBottom()
  }

  scrollToBottom () {
    if (!this.messagesEnd.current) return

    // Smooth scroll will cause the chat input field to bounce when sending
    // messages so we use the default ("auto")
    this.messagesEnd.current.scrollIntoView()
  }

  onMessageUserClick (evt, profile, identity) {
    const { uiStore } = this.context

    evt.persist()
    evt.stopPropagation()

    const mousePosition = getMousePosition(evt)

    uiStore.openUserProfilePanel({ identity, profile }, mousePosition)
  }

  onFirstMessageClick (evt) {
    const { channel } = this.props
    evt.preventDefault()
    channel.loadMore()
  }

  renderMessages () {
    const { sessionStore, uiStore } = this.context
    const { colorifyUsernames, useLargeMessage, language } = uiStore
    const { t, channel, ...rest } = this.props

    let prevDate

    // Reduce so we can put the date separators in
    return channel.messages.reduce((els, message) => {
      const date = new Date(message.meta.ts)

      if (date.getDate() !== prevDate) {
        prevDate = date.getDate()
        els.push(<MessagesDateSeparator key={date} date={date} locale={language} />)
      }

      els.push(
        <MessageRow
          key={message.hash}
          t={t}
          message={message}
          colorifyUsernames={colorifyUsernames}
          useLargeMessage={useLargeMessage}
          highlightWords={[sessionStore.username]}
          onInViewChange={inView => {
            if (message.unread && inView) channel.markMessageAsRead(message)
          }}
          onMessageUserClick={this.onMessageUserClick}
          loadFile={channel.loadFile}
          {...rest}
        />
      )

      return els
    }, [])
  }

  render () {
    const { useLargeMessage, useMonospaceFont } = this.context.uiStore
    const { t, channel } = this.props

    const messageEls = this.renderMessages()

    return (
      <div
        className={classNames('Messages', {
          'size-normal': !useLargeMessage,
          'size-large': useLargeMessage,
          'font-normal': !useMonospaceFont,
          'font-monospace': useMonospaceFont
        })}
        ref={this.messagesEl}>
        <FirstMessage
          t={t}
          channelName={channel.name}
          loading={channel.loadingHistory}
          hasMoreHistory={channel.hasMoreHistory}
          onClick={this.onFirstMessageClick}
        />
        {messageEls}
        <span className="messagesEnd" ref={this.messagesEnd} />
      </div>
    )
  }
}

export default withNamespaces()(observer(ChannelMessages))
