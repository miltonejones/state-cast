import React from 'react';
import { Typography, Stack, Chip, Button } from '@mui/material';
import { PodGroup } from '.';

const CategoryList = (props) => {
  const { send, pods, limited } = props;

  const groups = pods?.reduce((out, pod) => {
    const genre = pod.primaryGenreName;
    out[genre] = (out[genre] || []).concat(pod);
    return out;
  }, {});

  const limit = limited ? 10 : 5;

  const handleNavigate = (where) =>
    send({
      type: 'LINK',
      view: where,
    });
  return (
    <>
      <Typography sx={{ mt: 3 }} variant="h4">
        Categories
      </Typography>

      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        <Chip
          color="primary"
          onClick={() => handleNavigate('home')}
          variant={limited ? 'filled' : 'outlined'}
          sx={{ fontWeight: limited ? 600 : 400 }}
          label="Featured"
        />
        <Chip
          color="primary"
          onClick={() => handleNavigate('list')}
          variant={!limited ? 'filled' : 'outlined'}
          sx={{ fontWeight: !limited ? 600 : 400 }}
          label="Genres"
        />
      </Stack>

      {!!groups &&
        Object.keys(groups)

          .filter((group) => groups[group].length > limit)
          .map((key) => (
            <PodGroup key={key} name={key} send={send} group={groups[key]} />
          ))}
    </>
  );
};

export default CategoryList;
