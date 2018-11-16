'use strict'

import React from 'react'
// import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { CSSTransitionGroup } from 'react-transition-group'
import classNames from 'classnames'

import RootStoreContext from 'context/RootStoreContext'

import ChannelLink from 'components/ChannelLink'

import BackgroundAnimation from 'components/BackgroundAnimation'

import 'styles/flaticon.css'
import 'styles/ControlPanel.scss'

class ControlPanel extends React.Component {
  static contextType = RootStoreContext

  static propTypes = {}

  render () {
    const { networkStore, sessionStore, uiStore } = this.context

    const leftSide = uiStore.leftSidePanel

    const transitionProps = {
      component: 'div',
      transitionAppear: true,
      transitionAppearTimeout: 5000,
      transitionEnterTimeout: 5000,
      transitionLeaveTimeout: 5000
    }

    const channels = networkStore.channelsAsArray.sort((a, b) => a.name.localeCompare(b.name))

    return (
      <React.Fragment>
        <CSSTransitionGroup
          {...transitionProps}
          transitionName={leftSide ? 'openPanelAnimationLeft' : 'openPanelAnimationRight'}>
          <div
            className={classNames('ControlPanel', {
              left: leftSide,
              right: !leftSide
            })}>
            <div style={{ opacity: 0.8, zIndex: -1 }}>
              <BackgroundAnimation
                size={320}
                startY={58}
                theme={{ ...uiStore.theme }}
                style={{ alignItems: 'flex-start' }}
              />
            </div>
            <CSSTransitionGroup
              {...transitionProps}
              transitionName={leftSide ? 'panelHeaderAnimationLeft' : 'panelHeaderAnimationRight'}>
              <div className="header">
                <div className="logo">Orbit</div>
              </div>
            </CSSTransitionGroup>

            <CSSTransitionGroup {...transitionProps} transitionName="networkNameAnimation">
              <div className="networkName">
                <div className="text">{networkStore.networkName}</div>
              </div>
            </CSSTransitionGroup>

            <div className="username">{sessionStore.username}</div>

            <div
              className={classNames({
                panelHeader: channels.length > 0,
                hidden: channels.length === 0
              })}>
              Channels
            </div>

            <CSSTransitionGroup
              {...transitionProps}
              transitionName="joinChannelAnimation"
              className="openChannels">
              <div className="RecentChannelsView">
                <div className="RecentChannels">
                  {channels.map(c => (
                    <ChannelLink key={c.name} channel={c} theme={{ ...uiStore.theme }} />
                  ))}
                </div>
              </div>
            </CSSTransitionGroup>

            <div className="bottomRow">
              <div
                className="icon flaticon-gear94"
                // onClick={this.props.onOpenSettings}
                style={{ ...uiStore.theme }}
                key="settingsIcon"
              />
              <div
                className="icon flaticon-sharing7"
                // onClick={this.props.onOpenSwarmView}
                style={{ ...uiStore.theme }}
                key="swarmIcon"
              />
              <div
                className="icon flaticon-prohibition35"
                // onClick={this.props.onDisconnect}
                style={{ ...uiStore.theme }}
                key="disconnectIcon"
              />
            </div>
          </div>
        </CSSTransitionGroup>
        <CSSTransitionGroup
          {...transitionProps}
          transitionName="darkenerAnimation"
          className="darkener"
          // onClick={this.onClose.bind(this)}
        />
      </React.Fragment>
    )
  }
}

export default observer(ControlPanel)