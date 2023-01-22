import React from 'react';
import { IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { useMachine } from '@xstate/react';
import { Diagnostics } from '.';
import { menuMachine } from '../machines';

const SettingsMenu = ({ onChange, children, value, options, debug }) => {
  const [state, send] = useMachine(menuMachine, {
    services: {
      menuClicked: async (context, event) => {
        onChange(event.value);
      },
    },
  });
  const { anchorEl } = state.context;
  const handleClose = (value) => () =>
    send({
      type: 'close',
      value,
    });
  const handleClick = (event) =>
    send({
      type: 'open',
      anchorEl: event.currentTarget,
    });
  return (
    <>
      <IconButton onClick={handleClick}>{children}</IconButton>

      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => send('close')}>
        <MenuItem>
          <Typography variant="subtitle2">Show Machine state:</Typography>{' '}
        </MenuItem>
        {options.map((option) => (
          <MenuItem
            key={option.id}
            sx={{ fontWeight: option.id === value ? 600 : 400 }}
            onClick={handleClose(option.id)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>

      <Diagnostics
        open={debug}
        id={menuMachine.id}
        state={state}
        send={send}
        states={menuMachine.states}
      />
    </>
  );
};

export default SettingsMenu;
