import React from 'react';
import { IconButton } from '@mui/material';

const SettingsButton = ({ send, settings, machine_name }) => {
  return (
    <IconButton
      onClick={() =>
        send({
          type: 'SETTINGS',
          settings: settings === machine_name ? false : machine_name,
        })
      }
    >
      <i
        className={
          settings === machine_name
            ? 'fa-solid fa-diagram-predecessor'
            : 'fa-solid fa-diagram-successor'
        }
      ></i>
    </IconButton>
  );
};

export default SettingsButton;
