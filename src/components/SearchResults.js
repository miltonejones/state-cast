import React from 'react';
import {
  styled,
  Typography,
  Box,
  ListItemSecondaryAction,
  Pagination,
} from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { SubscribeButton, usePagination } from '.';

// import { BackButton } from '../../../..';

const Layout = styled(Box)(({ theme }) => ({
  margin: theme.spacing(1),
}));

const SearchResults = ({ results, subscriptions, param, page, send }) => {

  const pages = usePagination(results, { page, pageSize: 10, sortkey: 'trackName'})
  // const PAGE_SIZE = 10;
  // const pageCount = Math.ceil(results?.length / PAGE_SIZE);
  // const startNum = (page - 1) * PAGE_SIZE;
  // const sorted = results?.sort((a, b) => (a.trackName > b.trackName ? 1 : -1));
  // const visible = sorted?.slice(startNum, startNum + PAGE_SIZE);

  const subscribed = (podcast) =>
    subscriptions?.some((f) => f.feedUrl === podcast?.feedUrl);

  return (
    <Layout data-testid="test-for-SearchResults">
      {/* <BackButton send={send} /> */}

      <Typography sx={{  pb: 3 }} variant="h5">
        Search results for "{param}" ({results?.length})
      </Typography>

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

      <List dense sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {pages.visible &&
         pages.visible.map((t) => (
            <ListItem
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                send({
                  type: 'DETAIL',
                  podcast: t,
                  source: 'results',
                });
              }}
            >
              <ListItemAvatar>
                <Avatar
                  variant="rounded"
                  sx={{ width: 60, height: 60, mr: 1 }}
                  alt={t.trackName}
                  src={t.artworkUrl100}
                ></Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography variant="h6">{t.trackName}</Typography>}
                secondary={t.artistName}
              />
              <ListItemSecondaryAction
                onClick={() => {
                  send({
                    type: 'SUBSCRIBE',
                    podcast: t,
                  });
                }}
              >
                <SubscribeButton subscribed={subscribed(t)}  />
                {/* <i
                  className={`fa-${
                    subscribed(t) ? 'solid' : 'regular'
                  } fa-star`}
                ></i> */}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
      </List>
    </Layout>
  );
};
SearchResults.defaultProps = {};
export default SearchResults;
