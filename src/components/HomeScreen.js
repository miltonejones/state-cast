import React from 'react';
import { Button, Box, Typography, Stack } from '@mui/material';
import { SubscriptionList, CastCard, CategoryList } from '.';

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

const HomeScreen = (props) => {
  const { send, subscriptions, pods } = props;

  const groups = pods?.reduce((out, pod) => {
    const genre = pod.primaryGenreName;
    out[genre] = (out[genre] || []).concat(pod);
    return out;
  }, {});

  return (
    <>
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
