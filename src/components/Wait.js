import React from 'react';
import { Stack, Typography, LinearProgress } from '@mui/material';

const Wait = ({ stateKey, podcast, param }) => {
  const messages = {
    begin: 'Loading podcasts...',
    search: `Searching for "${param}"`,
    'detail.loading': `Getting "${podcast?.trackName}"`,
  };
  return (
    <Stack sx={{ m: 4 }}>
      <Typography variant="body1">{messages[stateKey] || stateKey}</Typography>

      <LinearProgress />
    </Stack>
  );
};

export default Wait;
