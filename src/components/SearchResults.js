import React from 'react';
import { styled, Typography, Box, Pagination } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
// import { BackButton } from '../../../..';

const Layout = styled(Box)(({ theme }) => ({
  margin: theme.spacing(1),
}));

const SearchResults = ({ results, param, page, send }) => {
  const PAGE_SIZE = 10;
  const pageCount = Math.ceil(results?.length / PAGE_SIZE);
  const startNum = (page - 1) * PAGE_SIZE;
  const sorted = results?.sort((a, b) => (a.trackName > b.trackName ? 1 : -1));
  const visible = sorted?.slice(startNum, startNum + PAGE_SIZE);

  return (
    <Layout data-testid="test-for-SearchResults">
      {/* <BackButton send={send} /> */}

      <Typography sx={{ pt: 2, pb: 3 }} variant="h5">
        Search results for "{param}" ({results?.length})
      </Typography>

      {pageCount > 1 && (
        <Box>
          <Pagination
            count={pageCount}
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
        {visible &&
          visible.map((t) => (
            <ListItem
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                send({
                  type: 'DETAIL',
                  podcast: t,
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
            </ListItem>
          ))}
      </List>
    </Layout>
  );
};
SearchResults.defaultProps = {};
export default SearchResults;
