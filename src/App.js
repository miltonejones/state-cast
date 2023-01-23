import React from 'react';
import { getPodcasts, getPodcast } from './connector';
import { Box, Divider, Link, Stack, Typography } from '@mui/material';
import { podcastMachine } from './machines';
import { useMachine } from '@xstate/react';
import {
  About,
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
      return pod;
    },

    spawnPlayer: async (context) => {
      const { track, trackList } = context;
      const { url, title, image, owner } = track;
      media.handlePlay(url, title, image, owner, trackList);
    },

    setSubscriptions: async () => {
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
    about: About,
  };

  const handleDiagnoticsClose=() => {
    send({
      type: 'SETTINGS',
      settings: false,
    });
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
    handleDiagnoticsClose
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
              <List send={send} stateKey={stateKey} {...state.context} handleDiagnoticsClose={handleDiagnoticsClose}/>
            )}
          </Inner>
        </Outer>
        <Divider sx={{mt: 2, mb: 2}} />
        <Stack spacing={1} direction="row" sx={{alignItems: 'center', justifyContent: 'flex-end', pr: 2}}>
          <Typography>
            Powered by <Link
            target="_blank" href="https://xstate.js.org/">xstate</Link>. 
            {" "}
            <i class="fa-brands fa-github"></i>
            {" "}Check out{" "}
            <Link 
            target="_blank"
            href="https://github.com/miltonejones/state-cast"> the repo</Link>.
          </Typography>
        </Stack>
        <Diagnostics
          onClose={handleDiagnoticsClose}
          open={state.context.settings === 'podcast_machine'}
          id={podcastMachine.id}
          state={state}
          send={send}
          states={podcastMachine.states}
        />
      </Box>

      <StatePlayer
        {...media}
        handleDiagnoticsClose={handleDiagnoticsClose}
        debug={state.context.settings === 'audio_player'}
      />
    </>
  );
}
