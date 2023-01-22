import React from 'react';
import {
  Stack,
  Box,
  Card,
  Typography,
  CardMedia,
  CardContent,
} from '@mui/material';
import { Btn } from './styled';

export const CastCard = ({ subscription, send, source }) => {
  return (
    <Card
      key={subscription.artworkUrl100}
      onClick={() => {
        send({
          type: 'DETAIL',
          podcast: subscription,
          source,
        });
      }}
      sx={{ width: '9vw', cursor: 'pointer' }}
    >
      <CardMedia
        component="img"
        width="100%"
        height="auto"
        sx={{ borderRadius: 2 }}
        image={subscription.artworkUrl100}
        alt={subscription.trackName}
      />
      <CardContent>
        <Typography
          variant="body2"
          sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
          color="text.secondary"
        >
          {subscription.trackName}
        </Typography>
      </CardContent>
    </Card>
  );
};

export const SubscriptionList = ({
  subscriptions,
  send,
  source,
  limit,
  view,
}) => {
  const visible = !limit ? subscriptions : subscriptions.slice(0, limit);
  return (
    <>
      <Stack
        direction="row"
        sx={{ alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Typography variant="h6" sx={{ mt: 2 }}>
          {subscriptions.length} Subscriptions
        </Typography>

        {view !== 'subs' && (
          <Btn
            endIcon={<i class="fa-solid fa-arrow-right"></i>}
            onClick={() =>
              send({
                type: 'LINK',
                view: 'subs',
              })
            }
          >
            view all
          </Btn>
        )}
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
        {visible.map((subscription, i) => (
          <CastCard
            key={i}
            subscription={subscription}
            send={send}
            source={source}
          />
        ))}
      </Box>
    </>
  );
};

const Subscriptions = (props) => {
  if (!props.subscriptions?.length) {
    return <>You have no subscriptions</>;
  }

  return <SubscriptionList {...props} />;
};
Subscriptions.defaultProps = {};
export default Subscriptions;
