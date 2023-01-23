import React from 'react';
import { Typography } from '@mui/material';
import { SubscriptionList, StateCarousel, CategoryList } from '.';
import { shuffle } from '../util'; 

const HomeScreen = (props) => {
  const { subscriptions, pods, send, settings, handleDiagnoticsClose } = props;
  const images = pods.map((podcast) => ({
    src: podcast.artworkUrl600,
    title: podcast.trackName,
    caption: podcast.artistName,
    onClick: () => {
      send({
        type: 'DETAIL',
        podcast,
        source: 'home',
      });
    },
  }));

  return (
    <>
      <Typography sx={{ mt: 3 }} variant="h4">
        Listen Now
      </Typography>
 

      {!!images && (
        <StateCarousel
          handleDiagnoticsClose={handleDiagnoticsClose}
          debug={settings === 'carousel'}
          images={shuffle(images)}
        />
      )}

      {!!subscriptions && (
        <SubscriptionList {...props} limit={5} source="home" />
      )}

      <CategoryList {...props} limited />
    </>
  );
};
HomeScreen.defaultProps = {};
export default HomeScreen;
