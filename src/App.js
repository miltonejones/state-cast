import React from 'react';
import { getPodcasts, getPodcast } from './connector';
import { Box } from '@mui/material';
import { podcastMachine } from './machines';
import { useMachine } from '@xstate/react';
import {
  CategoryList,
  Diagnostics,
  HomeScreen,
  Navigation,
  PodDetail,
  Wait,
  SearchResults,
  StatePlayer,
  Subscriptions,
  Toolbar,
  useStatePlayer,
} from './components';
import { Outer, Inner } from './components/styled';
import convert from 'xml-js';
import { getEvent } from './util';
import './style.css';

export default function App() {
  const media = useStatePlayer();
  const services = {
    beginSearch: async (context) => {
      const pods = await getPodcasts(context.param);
      return pods.results;
    },

    getDetail: async (context) => {
      const { feedUrl } = context.podcast;
      const pod = await getPodcast(feedUrl);
      const json = convert.xml2js(pod);
      return json;
    },

    spawnPlayer: async (context) => {
      const { url, title, image, owner } = context.track;
      media.handlePlay(url, title, image, owner);
    },

    setSubscriptions: async (context) => {
      const pods = await getPodcasts('popular');
      await new Promise((go) => setTimeout(go, 499));
      return pods.results;
    },
  };

  const [state, send] = useMachine(podcastMachine, { services });

  const forms = {
    idle: HomeScreen,
    'search.loaded': SearchResults,
    begin: Wait,
    searching: Wait,
    'detail.loading': Wait,
    'detail.loaded': PodDetail,
  };

  const lists = {
    home: HomeScreen,
    subs: Subscriptions,
    list: CategoryList,
  };

  const stateKey = Object.keys(forms).find(state.matches);
  const Form = forms[stateKey];
  const List = lists[state.context.view];
  const event = getEvent(podcastMachine.states, state);
  const childProps = {
    send,
    state,
    event,
    stateKey,
  };

  return (
    <>
      <Box sx={{ mb: 20 }}>
        <Toolbar {...childProps} {...state.context} />

        <Navigation {...childProps} />

        <Outer>
          <Inner wide={state.matches('detail.loaded')}>
            {!!Form && (
              <Form send={send} stateKey={stateKey} {...state.context} />
            )}
            {!!List && !Form && (
              <List send={send} stateKey={stateKey} {...state.context} />
            )}
          </Inner>
        </Outer>

        <Diagnostics
          id={podcastMachine.id}
          state={state}
          send={send}
          states={podcastMachine.states}
        />
      </Box>

      <StatePlayer {...media} />
    </>
  );
}
