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
// import { BackButton } from '../../../..';

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
  source,
  subscriptions,
  page = 1,
  send,
}) => {
  const recurse = (elements, out = [], level = 0) => {
    !!elements &&
      elements.map((element, e) => {
        const cdata = element.elements?.find((e) => e.type === 'cdata');
        const text = element.elements?.find((e) => e.type === 'text');
        if (text) {
          out.push({
            [element.name]: text.text,
            ...element.attributes,
            level,
          });
        } else if (cdata) {
          out.push({
            [element.name]: cdata.cdata,
            ...element.attributes,
            level,
          });
        } else {
          out.push({
            ...element.attributes,
            level,
          });
          recurse(element.elements, out, ++level);
        }

        return out;
      });

    return out;
  };

  const getImageProps = (items) => {
    const isPic = (img) =>
      ['jpg', 'jpeg', 'png'].some((pic) => !!img && img.indexOf(pic) > 0);

    if (!items) return {};

    const imageMap = items.find((f) => isPic(f.url) || isPic(f.href));
    if (imageMap) {
      return {
        image: isPic(imageMap.url) ? imageMap.url : imageMap.href,
        ...imageMap,
      };
    }

    return {};
  };

  const elementList = recurse(detail.elements);
  const listMap = Array.from(new Set(elementList.map((f) => f.level))).reduce(
    (out, res) => {
      const items = elementList.filter((f) => f.level === res);
      const node = items.reduce((item, row) => {
        Object.keys(row).map((m, i) => {
          item[m] = Object.values(row)[i];
          return item;
        });
        return item;
      }, {});
      return out.concat(node);
    },
    []
  );

  const trackList = listMap?.filter((f) => !!f['itunes:duration'] && !!f.url);
  // const titleNode = listMap?.find((f) => !!f.generator);
  const imageNode =
    listMap?.find(
      (f) =>
        !!f.href && (f.href.indexOf('jpg') > 0 || f.href.indexOf('jpeg') > 0)
    ) || {};

  const PAGE_SIZE = 5;
  const pageCount = Math.ceil(trackList.length / PAGE_SIZE);
  const startNum = (page - 1) * PAGE_SIZE;
  const visible = trackList?.slice(startNum, startNum + PAGE_SIZE);

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
      {/* <BackButton send={send} />  */}
      {/* [{source}] */}
      {/* <pre>
[{JSON.stringify(subscribed,0,3)}]
</pre> */}
      {/* [{JSON.stringify(subscriptions)}] */}
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
                {(track?.href || imageNode?.href) && (
                  <Avatar
                    variant="rounded"
                    sx={{ width: 60, height: 60, mr: 1 }}
                    src={track?.href || imageNode?.href}
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
                          image: track?.href || imageNode?.href,
                        },
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
                              image: track?.href || imageNode?.href,
                            },
                          });
                        }}
                        endIcon={<i className="fa-solid fa-play fa-2xs"></i>}
                        size="small"
                        variant="outlined"
                      >
                        Play
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
        {/* [ <pre>{JSON.stringify(listMap, 0, 2)}</pre>] */}
      </Box>

      {/* <Stack
        direction="row"
        spacing={2}
        sx={{ maxWidth: '80vw', alignItems: 'flex-start' }}
      >
      </Stack> */}
      {/* 
 <pre>
    {JSON.stringify(imageProps,0,2)}
    </pre> */}
      {/*
<pre>
    {JSON.stringify(imageNode,0,2)}
    </pre>
    <pre>
    {JSON.stringify(detail.elements,0,2)}
    </pre> */}
    </Layout>
  );
};
PodDetail.defaultProps = {};
export default PodDetail;
