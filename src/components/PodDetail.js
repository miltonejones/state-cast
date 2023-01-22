import React from 'react';
import {
  styled,
  Box,
  Stack,
  Button,
  Typography,
  Pagination,
  ListItemSecondaryAction,
  Divider,
} from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { parseRss, getImageProps } from '../util';

const Layout = styled(Box)(({ theme }) => ({
  margin: theme.spacing(0),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
}));

const PodDetail = ({
  detail,
  podcast,
  track: currentTrack,
  subscriptions,
  page = 1,
  send,
}) => {
  const detailJSON = typeof detail === 'string' ? JSON.parse(detail) : detail;

  // return <pre>{JSON.stringify(detailJSON, 0, 6)}</pre>;
  const listMap = parseRss(detailJSON.elements);
  const src = currentTrack?.url;

  const trackList = listMap?.filter((f) => !!f['itunes:duration'] && !!f.url);

  if (!trackList.length) {
    return <>No results</>;
  }

  const PAGE_SIZE = 5;
  const pageCount = Math.ceil(trackList.length / PAGE_SIZE);
  const startNum = (page - 1) * PAGE_SIZE;
  const visible = trackList.slice(startNum, startNum + PAGE_SIZE);

  const subscribed = subscriptions?.some((f) => f.feedUrl === podcast?.feedUrl);
  const imageProps = getImageProps(listMap);
  const descNode = listMap.find((f) => !!f.description);

  return (
    <Layout data-testid="test-for-PodDetail">
      {!!imageProps && (
        <Stack
          direction="row"
          spacing={2}
          sx={{
            height: 200,
            width: '100vw',
            pt: 2,
            pb: 2,
            pl: 4,
            mb: 2,
            backgroundColor: 'aliceblue',
          }}
        >
          {!!imageProps?.image && (
            <img width={200} src={imageProps.image} alt={imageProps.title} />
          )}
          <Box>
            <Typography
              variant="h6"
              onClick={() => {
                send({
                  type: 'SUBSCRIBE',
                  podcast,
                });
              }}
            >
              <i
                className={`fa-${subscribed ? 'solid' : 'regular'} fa-star`}
              ></i>
              {imageProps?.title || imageProps['itunes:name']}
            </Typography>
            <Typography variant="caption">
              {trackList.length} episodes
            </Typography>

            <Box sx={{ maxWidth: '60vw' }}>
              <Typography
                variant="body2"
                dangerouslySetInnerHTML={{
                  __html: descNode?.description,
                }}
              ></Typography>
            </Box>
          </Box>
        </Stack>
      )}

      <Box sx={{ width: '50vw' }}>
        {pageCount > 1 && (
          <Box sx={{ ml: 10 }}>
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
        <List sx={{ ml: 2, maxWidth: '45vw' }}>
          {visible.map((track) => (
            <ListItem
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
              }}
            >
              <ListItemAvatar>
                {(track?.href || imageProps?.image) && (
                  <Avatar
                    variant="rounded"
                    sx={{ width: 60, height: 60, mr: 1 }}
                    src={track?.href || imageProps?.image}
                  ></Avatar>
                )}
              </ListItemAvatar>

              <ListItemText
                primary={
                  <div
                    onClick={() => {
                      send({
                        type: 'PLAY',
                        track: {
                          ...track,
                          owner: imageProps?.title,
                          image: track?.href || imageProps?.image,
                        },
                        trackList,
                      });
                    }}
                    dangerouslySetInnerHTML={{ __html: track.title }}
                  />
                }
                secondary={
                  <Stack>
                    <Typography
                      variant="body2"
                      dangerouslySetInnerHTML={{
                        __html: track['itunes:summary']?.substr(0, 200),
                      }}
                    ></Typography>

                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ mt: 1, alignItems: 'center' }}
                    >
                      <Button
                        onClick={() => {
                          send({
                            type: 'PLAY',
                            track: {
                              ...track,
                              owner: imageProps?.title,
                              image: track?.href || imageProps?.image,
                            },
                          });
                        }}
                        endIcon={
                          <i
                            className={
                              track.url === src
                                ? 'fa-regular fa-circle-stop'
                                : 'fa-solid fa-play fa-2xs'
                            }
                          ></i>
                        }
                        size="small"
                        variant="outlined"
                      >
                        {track.url === src ? 'Stop' : 'Play'}
                      </Button>
                      <Typography variant="caption">
                        {track['itunes:duration']}
                      </Typography>
                    </Stack>
                  </Stack>
                }
              />
              <ListItemSecondaryAction
                onClick={() => {
                  send({
                    type: 'PLAY',
                    track,
                  });
                }}
              >
                <i className="fa-solid fa-chevron-right"></i>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Box>
    </Layout>
  );
};
PodDetail.defaultProps = {};
export default PodDetail;
