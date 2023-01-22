import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { CastCard } from '.';

const Btn = ({ label, icon, onClick }) => {
  return (
    <Typography onClick={onClick} sx={{ cursor: 'pointer' }}>
      {label} {icon}
    </Typography>
  );
};

const PodGroup = ({ name, group, send }) => {
  const handleSearch = () => {
    send({
      type: 'SEARCH',
      value: name,
    });
  };
  return (
    <>
      <Stack
        direction="row"
        sx={{ mt: 2, alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Typography variant="h6">{name}</Typography>

        <Btn
          onClick={handleSearch}
          icon={<i class="fa-solid fa-arrow-right"></i>}
          label="More"
        ></Btn>
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
