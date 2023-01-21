import React from 'react';
import { getPodcasts, getPodcast } from './connector';
import { TextField, Button, Box, Typography, Stack } from '@mui/material';
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
  useStatePlayer,
} from './components';
import convert from 'xml-js';
import './style.css';

const Toolbar = ({ send, param }) => {
  const handleParamChange = (event) => {
    send({
      type: 'CHANGE',
      value: event.target.value,
    });
  };
  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'center',
        p: 2,
        borderBottom: 1,
        borderColor: 'divider',
      }}
      spacing={1}
    >
      <i class="fa-solid fa-podcast"></i>
      <Box>
        <Typography onClick={() => send('CLOSE')}>
          STATE<b>CAST</b>
        </Typography>
      </Box>
      <Box sx={{ pl: 8 }}>
        <Typography onClick={() => send('CLOSE')}>Home</Typography>
      </Box>
      <Box sx={{ pl: 4 }}>
        <Typography>Categories</Typography>
      </Box>
      <Box sx={{ ml: 4 }}>
        <Typography sx={{ ml: 2 }} onClick={() => send('BROWSE')}>
          Subscriptions
        </Typography>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <Box>
        <TextField
          sx={{ minWidth: 400 }}
          value={param}
          autoComplete="off"
          size="small"
          onKeyUp={(e) => {
            if (e.keyCode === 13) return send('SEARCH');
          }}
          onChange={handleParamChange}
          label="Search Statecast"
          placeholder="Type a podcast name or category"
        />
        <Button
          endIcon={<i class="fa-solid fa-magnifying-glass"></i>}
          variant="contained"
          sx={{ ml: 1 }}
        >
          search
        </Button>
        {/* <i class="fa-solid fa-magnifying-glass"></i> */}
      </Box>
    </Stack>
  );
};

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
    // playing: Player,
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

  return (
    <>
      <Box sx={{ m: 0, p: 0 }}>
        <Toolbar send={send} param={state.context.param} />
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
