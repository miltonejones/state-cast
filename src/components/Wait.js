import React from 'react';
import { Stack, Typography, LinearProgress } from '@mui/material';

const Wait = ({ stateKey, podcast, param }) => {
  const messages = {
    begin: 'Loading podcasts...',
    search: `Searching for "${param}"`,
    'detail.loading': `Getting "${podcast?.trackName}"`,
  };
  return (
    <Stack>
      <Typography variant="body2">{messages[stateKey] || stateKey}</Typography>

      <LinearProgress />
    </Stack>
  );
};

export default Wait;
