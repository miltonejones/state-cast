import React from 'react';
import { Typography } from '@mui/material';
import { PodGroup } from '.';

const CategoryList = (props) => {
  const { send, pods, limited } = props;

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

      {!!groups &&
        Object.keys(groups)

          .filter((group) => !limited || groups[group].length > 10)
          .map((key) => (
            <PodGroup key={key} name={key} send={send} group={groups[key]} />
          ))}
    </>
  );
};

export default CategoryList;
