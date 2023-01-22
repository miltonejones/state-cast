import React from 'react';
import { Stack, Typography } from '@mui/material';

const Navigation = ({ state, event, send }) => {
  const { view } = state.context;

  if (view === 'home' && !(!!event.on.CLOSE || !!event.on.HOME)) return <i />;

  // if (view === 'home' || !(!!event.on.CLOSE || !!event.on.HOME))
  //   return <i/>;

  const handleClick = () => {
    if (event.on.CLOSE || event.on.HOME) {
      return send(event.on.HOME ? 'HOME' : 'CLOSE');
    }
    send({
      type: 'LINK',
      view: 'home',
    });
  };

  return (
    <Stack
      sx={{ alignItems: 'center', cursor: 'pointer', p: 2 }}
      direction="row"
      spacing={1}
      onClick={handleClick}
    >
      <i className="fa-solid fa-arrow-left"></i>
      <Typography>back</Typography>
    </Stack>
  );
};
Navigation.defaultProps = {};
export default Navigation;
