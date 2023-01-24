import React from 'react';
import {
  TextField,
  Button,
  Collapse,
  Box,
  Typography,
  Stack,
  styled,
  Badge,
} from '@mui/material';
import {Helmet} from "react-helmet";
import { SettingsMenu } from '.';
import { Btn } from './styled';

const NavLink = styled(Typography)(({ active }) => ({
  fontWeight: active ? 700 : 400,
  cursor: 'pointer',
}));

const Toolbar = ({ send, settings, subscriptions, param, podcast, view, filterText, handleDiagnoticsClose, event }) => {
  const handleParamChange = (e) => {
    send({
      type: event.on.FILTER ? 'FILTER' : 'CHANGE',
      value: e.target.value,
    });
  };

  const handleNavigate = (where) =>
    send({
      type: 'LINK',
      view: where,
    });

  const eventName = event.on.FILTER ? "FILTER" : "SEARCH"

  const lists = {
    home: 'Home',
    subs: 'Subscriptions',
    list: 'Categories',
    about: 'About',
  };

  const title = !podcast ? lists[view] : `Detail | ${podcast.trackName}`;

  const textProps = event.on.FILTER
    ? {
      value: filterText,
      label: "Filter search  results",
      placeholder: "Filter search results"
    }
    : {
      value: param,
      label: "Search Statecast",
      placeholder: "Type a podcast name or category"
    };
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Statecast | {title}</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
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
      <i style={{ color: 'gray' }} className="fa-solid fa-podcast"></i>
      <Box>
        <Typography
          sx={{ color: (t) => t.palette.primary.main }}
          onClick={() => handleNavigate('home')}
        >
          STATE<b style={{ color: 'gray' }}> CAST</b>
        </Typography>
      </Box>

      <Box sx={{ pl: 8 }}>
        <NavLink
          active={view === 'home'}
          onClick={() => handleNavigate('home')}
        >
          Home
        </NavLink>
      </Box>
      <Box sx={{ pl: 4 }}>
        <NavLink
          active={view === 'list'}
          onClick={() => handleNavigate('list')}
        >
          Categories
        </NavLink>
      </Box>
      {!!subscriptions && <Box sx={{ ml: 4 }}>
        <Badge badgeContent={subscriptions.length} color="secondary">
          <NavLink
            active={view === 'subs'}
            onClick={() => !!subscriptions.length && handleNavigate('subs')}
            sx={{
              ml: 2,
              color: (t) =>
                !subscriptions.length
                  ? t.palette.grey[400]
                  : t.palette.common.black,
            }}
          >
            Subscriptions
          </NavLink>
        </Badge>
      </Box>}
      <Box sx={{ pl: 4 }}>
        <NavLink
          active={view === 'about'}
          onClick={() => handleNavigate('about')}
        >
          About
        </NavLink>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <Collapse in={event.on.SEARCH || event.on.FILTER}  orientation="horizontal">
        <Box sx={{ whiteSpace: 'nowrap' }}>
          <TextField
            sx={{ minWidth: 300 }}
            {...textProps}
            autoComplete="off"
            size="small"

            onKeyUp={(e) => {
              if (e.keyCode === 13) return send(eventName);
            }}
            onChange={handleParamChange}

          />
          <Btn
            startIcon={<i className={
              event.on.FILTER 
                ? "fa-solid fa-filter"
                : "fa-solid fa-magnifying-glass"
              }></i>}
            variant="contained"
            onClick={() => send(eventName)}
            sx={{ ml: 1 }}
          >
            {event.on.FILTER ? "filter" : "search"}
          </Btn>
          {event.on.SETTINGS && (
            <>
              <SettingsMenu
              handleDiagnoticsClose={handleDiagnoticsClose}
                debug={settings === 'settings_menu'}
                value={settings}
                onChange={(value) =>
                  !!value &&
                  send({
                    type: 'SETTINGS',
                    settings: settings === value ? false : value,
                  })
                }
                options={[
                  {
                    id: 'podcast_machine',
                    label: 'Application',
                  },
                  {
                    id: 'audio_player',
                    label: 'Audio Player',
                  },
                  {
                    id: 'carousel',
                    label: 'Carousel',
                  },
                  {
                    id: 'settings_menu',
                    label: 'This menu',
                  },
                ]}
              >
                <i class="fa-solid fa-gear"></i>
              </SettingsMenu>
            </>
          )}
        </Box>
      </Collapse>
    </Stack></>
  );
};

export default Toolbar;
