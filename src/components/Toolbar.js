import React from 'react';
import {
  TextField,
  Button,
  Collapse,
  Box,
  Typography,
  Stack,
  styled,
} from '@mui/material';

const NavLink = styled(Typography)(({ active }) => ({
  fontWeight: active ? 700 : 400,
  cursor: 'pointer',
}));

const Toolbar = ({ send, param, state, event }) => {
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
      <i style={{ color: 'gray' }} className="fa-solid fa-podcast"></i>
      <Box>
        <Typography
          sx={{ color: (t) => t.palette.primary.main }}
          onClick={() => send('CLOSE')}
        >
          STATE<b style={{ color: 'gray' }}> CAST</b>
        </Typography>
      </Box>

      <Box sx={{ pl: 8 }}>
        <NavLink
          active={state.matches('idle')}
          onClick={() => send(event.on.HOME ? 'HOME' : 'CLOSE')}
        >
          Home
        </NavLink>
      </Box>
      <Box sx={{ pl: 4 }}>
        <NavLink>Categories</NavLink>
      </Box>
      <Box sx={{ ml: 4 }}>
        <NavLink
          active={state.matches('shows')}
          sx={{ ml: 2 }}
          onClick={() => send('BROWSE')}
        >
          Subscriptions
        </NavLink>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <Collapse in={event.on.SEARCH} orientation="horizontal">
        <Box sx={{ whiteSpace: 'nowrap' }}>
          <TextField
            sx={{ minWidth: 300 }}
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
      </Collapse>
    </Stack>
  );
};

export default Toolbar;
