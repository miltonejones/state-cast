import React from 'react';
import { Button, Box, Typography, Stack } from '@mui/material';
import { CastCard } from '.';

const PodGroup = ({ name, group, send }) => {
  return (
    <>
      <Stack
        direction="row"
        sx={{ mt: 2, alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Typography variant="h6">{name}</Typography>

        <Button
          onClick={() => {
            send({
              type: 'SEARCH',
              value: name,
            });
          }}
        >
          more
        </Button>
      </Stack>

      <Box
        sx={{
          width: '50vw',
          pt: 2,
          gap: 2,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
        }}
      >
        {group.slice(0, 5).map((item) => (
          <CastCard subscription={item} send={send} source="home" />
        ))}
      </Box>
    </>
  );
};

export default PodGroup;
