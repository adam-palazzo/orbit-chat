'use strict'

import React from 'react'
import { Route, Switch, Link } from 'react-router-dom'
import { hot } from 'react-hot-loader'
import { observer } from 'mobx-react'
import MobxDevTools from 'mobx-react-devtools'

import RootStoreContext from 'context/RootStoreContext'

import PrivateRoute from 'components/PrivateRoute'
import LoginView from 'components/LoginView'
import BackgroundAnimation from 'components/BackgroundAnimation'
import LoadingView from 'components/LoadingView'
import ChannelView from 'components/ChannelView'

import 'styles/App.scss'
import 'styles/Scrollbars.scss'

import 'styles/DevTools.scss'

@observer
class DebugChannelList extends React.Component {
  static contextType = RootStoreContext

  render () {
    const { networkStore } = this.context
    return (
      <div>
        Channels: <br />
        <ul>
          {networkStore.channelsAsArray.map(channel => (
            <li key={channel.name}>
              <strong>Channel name: {channel.name}</strong> <br />
              <strong>Peers: {channel.peers.length}</strong> <br />
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

@observer
class DebugControlButtons extends React.Component {
  static contextType = RootStoreContext

  render () {
    const { ipfsStore, sessionStore, networkStore, uiStore } = this.context

    return (
      <div>
        <button
          onClick={() => sessionStore.login({ username: 'test-user-' + Date.now() })}
          disabled={sessionStore.isAuthenticated}>
          Login
        </button>
        <button onClick={() => sessionStore.logout()} disabled={!sessionStore.isAuthenticated}>
          Logout
        </button>
        <br />
        <button
          onClick={() => ipfsStore.useGoIPFS()}
          disabled={ipfsStore.node || ipfsStore.starting || !sessionStore.username}>
          Use go-ipfs
        </button>
        <button
          onClick={() => ipfsStore.useJsIPFS()}
          disabled={ipfsStore.node || ipfsStore.starting || !sessionStore.username}>
          Use js-ipfs
        </button>
        <button onClick={() => networkStore.stop()} disabled={!networkStore.isOnline}>
          Stop
        </button>
        <br />
        <Link to="/channel/test1">
          <button>Channel test1</button>
        </Link>
        <Link to="/channel/test2">
          <button>Channel test2</button>
        </Link>
        <Link to="/channel/test3">
          <button>Channel test3</button>
        </Link>
        <br />
        <br />
        <button
          disabled={uiStore.themeName === 'Default'}
          onClick={() => uiStore.setTheme('Default')}>
          Set default theme
        </button>
        <button disabled={uiStore.themeName === 'Green'} onClick={() => uiStore.setTheme('Green')}>
          Set green theme
        </button>
        <button disabled={uiStore.themeName === 'Blue1'} onClick={() => uiStore.setTheme('Blue1')}>
          Set blue theme
        </button>
        <br />
        <br />
        <button disabled={uiStore.language === 'en'} onClick={() => uiStore.setLanguage('en')}>
          Set locale to EN
        </button>
        <button disabled={uiStore.language === 'fi'} onClick={() => uiStore.setLanguage('fi')}>
          Set locale to FI
        </button>
        <br />
      </div>
    )
  }
}
@observer
class DevTools extends React.Component {
  static contextType = RootStoreContext

  render () {
    const { networkStore } = this.context
    return (
      <div>
        <DebugControlButtons />
        <br />
        <br />
        {networkStore.isOnline ? <DebugChannelList /> : null}
      </div>
    )
  }
}

@observer
class DefaultView extends React.Component {
  static contextType = RootStoreContext
  static propTypes = {}

  render () {
    const { uiStore } = this.context

    uiStore.setTitle('Orbit')

    return (
      <div>
        <BackgroundAnimation size={480} theme={{ ...uiStore.theme }} />
      </div>
    )
  }
}

class App extends React.Component {
  static contextType = RootStoreContext
  static propTypes = {}

  render () {
    const { sessionStore, uiStore } = this.context

    const devTools =
      process.env.NODE_ENV === 'development' ? (
        <div className="devtools">
          <DevTools />
          <MobxDevTools />
        </div>
      ) : null

    if (uiStore.loading) return <LoadingView />

    return (
      <div className="App view">
        <Switch>
          <Route exact path="/connect" component={LoginView} />

          <PrivateRoute
            path="/channel/:channel"
            loginPath={'/connect'}
            isAuthenticated={sessionStore.isAuthenticated}
            component={ChannelView}
          />

          <PrivateRoute
            loginPath={'/connect'}
            isAuthenticated={sessionStore.isAuthenticated}
            component={DefaultView}
          />
        </Switch>
        {devTools}
      </div>
    )
  }
}

export default hot(module)(observer(App))
