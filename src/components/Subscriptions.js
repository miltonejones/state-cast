import React from 'react';
import {
  Stack,
  Box,
  Card,
  Typography,
  CardMedia,
  CardContent,
  Pagination
} from '@mui/material';
import { Btn } from './styled';
import { usePagination } from '.'

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
      sx={{ width: '11vw', cursor: 'pointer' }}
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
  page,
}) => {
  const visible = !limit ? subscriptions : subscriptions.slice(0, limit);
  
  const pages = usePagination(visible, { page, pageSize: 15 })
  

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

        
        {pages.pageCount > 1 && (
          <Box>
            <Pagination
              count={pages.pageCount}
              page={page}
              onChange={(e, index) => {
                send({
                  type: 'PAGE',
                  page: index,
                });
              }}
            />
          </Box>
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
        {pages.visible.map((subscription, i) => (
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
