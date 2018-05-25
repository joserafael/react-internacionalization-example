import React, { Component } from 'react';
import intl from "react-intl-universal";
import _ from "lodash";
import http from "axios";
import GithubCorner from 'react-github-corner';
import logo from './logo.svg';
import './App.css';

const SUPPOER_LOCALES = [
  {
    name: "English",
    value: "en-US"
  },
  {
    name: "Español",
    value: "es-ES"
  },
  {
    name: "Português",
    value: "pt-BR"
  }


];

class App extends Component {

  state = { initDone: false };

  constructor(props) {
    super(props);
    this.onSelectLocale = this.onSelectLocale.bind(this);
  }

  componentDidMount() {
    this.loadLocales();
  }
  render() {

    return (
        this.state.initDone &&
      <div className="App">
      {this.renderLocaleSelector()}
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">{intl.get('WELCOME')} </h1>
        </header>
        <p className="App-intro">
          {intl.getHTML('START')}
        </p>
        <GithubCorner href="https://github.com/joserafael/react-internacionalization-example"  bannerColor="#70B7FD" />
      </div>
    );
  }

loadLocales() {
    let currentLocale = intl.determineLocale({
      urlLocaleKey: "lang",
      cookieLocaleKey: "lang"
    });
    if (!_.find(SUPPOER_LOCALES, { value: currentLocale })) {
      currentLocale = "en-US";
    }

    http
      .get(`locales/${currentLocale}.json`)
      .then(res => {
        console.log("App locale data", res.data);
        // init method will load CLDR locale data according to currentLocale
        return intl.init({
          currentLocale,
          locales: {
            [currentLocale]: res.data
          }
        });
      })
      .then(() => {
        // After loading CLDR locale data, start to render
        this.setState({ initDone: true });
      });
  }

  renderLocaleSelector() {
    return (
      <select onChange={this.onSelectLocale} defaultValue="">
        <option value="" disabled>Change Language</option>
        {SUPPOER_LOCALES.map(locale => (
          <option key={locale.value} value={locale.value}>{locale.name}</option>
        ))}
      </select>
    );
  }

  onSelectLocale(e) {
    let lang = e.target.value;
    window.location.search = `?lang=${lang}`;
  }
}
export default App;
