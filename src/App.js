import React from 'react';
import { getPodcasts, getPodcast } from './connector';
import { Box } from '@mui/material';
import { podcastMachine } from './machines';
import { useMachine } from '@xstate/react';
import {
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
    results: SearchResults,
    shows: Subscriptions,
    begin: Wait,
    searching: Wait,
    'podcast_detail.loading': Wait,
    // 'podcast_detail.error': ErrorPage,
    'podcast_detail.loaded': PodDetail,
  };

  const stateKey = Object.keys(forms).find(state.matches);
  const Form = forms[stateKey];
  const width = state.matches('podcast_detail.loaded') ? '100vw' : '50vw';
  const event = getEvent(podcastMachine.states, state);

  return (
    <>
      <Box sx={{ m: 0, p: 0, marginBottom: 60 }}>
        <Toolbar
          send={send}
          state={state}
          param={state.context.param}
          event={event}
        />
        <Navigation
          send={send}
          state={state}
          stateKey={stateKey}
          states={podcastMachine.states}
        />
        <Box
          sx={{
            width: '100vw',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width,
              overflow: 'hidden',
            }}
          >
            {!!Form && (
              <Form send={send} stateKey={stateKey} {...state.context} />
            )}
          </Box>
        </Box>

        <Diagnostics
          id={podcastMachine.id}
          state={state}
          states={podcastMachine.states}
        />
      </Box>

      <StatePlayer {...media} />
    </>
  );
}
