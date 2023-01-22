import React from 'react';
import { Card, Box, Typography } from '@mui/material';
import { SubscriptionList, CategoryList } from '.';

const HomeScreen = (props) => {
  const { subscriptions, pods } = props;
  const index = Math.floor(Math.random() * pods?.length);
  const splashPod = pods[index];

  return (
    <>
      {/* <pre>{JSON.stringify(splashPod, 0, 2)}</pre> */}

      <Card
        elevation={4}
        sx={{
          position: 'relative',
          width: '100%',
          height: '33vh',
          overflow: 'hidden',
          mt: 2,
        }}
      >
        <img
          src={splashPod.artworkUrl600}
          style={{
            width: '100%',
            position: ' absolute',
            top: '-70%',
            left: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 40,
            left: 20,
          }}
        >
          <Typography
            sx={{ color: 'white', mixBlendMode: 'difference' }}
            variant="h4"
          >
            {splashPod.trackName}
          </Typography>

          <Typography sx={{ color: 'white', mixBlendMode: 'difference' }}>
            {splashPod.artistName}
          </Typography>
        </Box>
      </Card>

      <Typography sx={{ mt: 3 }} variant="h4">
        Listen Now
      </Typography>

      {!!subscriptions && (
        <SubscriptionList {...props} limit={5} source="home" />
      )}

      <CategoryList {...props} limited />
    </>
  );
};
HomeScreen.defaultProps = {};
export default HomeScreen;
