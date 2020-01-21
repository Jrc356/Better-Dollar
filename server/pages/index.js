/* eslint-disable react/jsx-filename-extension */

import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import Head from 'next/head';
import theme from '../theme';
import TopBar from '../components/TopBar';
import Home from '../components/Home';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Head>
          <title>Better Dollar</title>
          <script src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"></script>
        </Head>
        <TopBar />
        <br />
        <Home />
      </div>
    </ThemeProvider>
  );
}

export default App;
