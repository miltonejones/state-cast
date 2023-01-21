import React from 'react';
import { TextField, Button, Box, Typography, Stack } from '@mui/material';
import { SubscriptionList, CastCard } from '.';

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
  const { send, param, subscriptions, pods } = props;

  const groups = pods?.reduce((out, pod) => {
    const genre = pod.primaryGenreName;
    out[genre] = (out[genre] || []).concat(pod);
    return out;
  }, {});

  const handleSearch = (event) => {
    send({
      type: 'CHANGE',
      value: event.target.value,
    });
  };
  return (
    <>
      <Typography sx={{ mt: 3 }} variant="h4">
        Listen Now
      </Typography>

      {!!subscriptions && (
        <SubscriptionList {...props} limit={5} source="home" />
      )}

      {!!groups &&
        Object.keys(groups)

          .filter((group) => groups[group].length > 10)
          .map((key) => (
            <PodGroup key={key} name={key} send={send} group={groups[key]} />
          ))}
    </>
  );
};
HomeScreen.defaultProps = {};
export default HomeScreen;
