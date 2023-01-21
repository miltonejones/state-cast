import React from 'react';
import { Stack, Typography } from '@mui/material';

const Navigation = ({ state, states, stateKey, send }) => {
  if (state.matches('idle')) return <i />;

  const event =
    typeof state.value === 'string'
      ? states[state.value]
      : states[Object.keys(state.value)[0]].states[
          Object.values(state.value)[0]
        ];
  if (!event) return <>{JSON.stringify(state.value)}</>;

  return (
    <Stack
      sx={{ alignItems: 'center', cursor: 'pointer', p: 2 }}
      direction="row"
      spacing={1}
      onClick={() => {
        send('CLOSE');
      }}
    >
      <i className="fa-solid fa-arrow-left"></i>
      <Typography>back</Typography>
      {/* {stateKey} */}
    </Stack>
  );
};
Navigation.defaultProps = {};
export default Navigation;
