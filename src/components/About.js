import React from 'react';
import { Stack, Divider, Typography, Link } from '@mui/material';

import { docs } from '../machines';

const About = () => {
  return (
    <Stack sx={{ m: 4 }}>
      Statecast is a collection of xstate state machines running in a browser.
      These are the machines.
      <Divider sx={{ width: '100%', m: (t) => t.spacing(1, 0) }} />
      {Object.keys(docs).map((doc) => (
        <Stack sx={{ mb: 2 }} key={doc}>
          <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
            {doc}
          </Typography>
          <Typography variant="caption">
            <em>{docs[doc].machine.id}</em>
          </Typography>
          <Typography variant="body2">{docs[doc].description}</Typography>
          <Divider sx={{ width: '100%', m: (t) => t.spacing(1, 0) }} />
          {docs[doc].machine.id} has the following states:
          <ul>
            {Object.keys(docs[doc].states).map((state) => (
              <li key={state}>
                <Stack>
                  <Typography variant="subtitle2">{state}</Typography>
                  <Typography variant="body2">
                    {docs[doc].states[state]}
                  </Typography>
                </Stack>
              </li>
            ))}
          </ul>
          <Typography>
            Click{' '}
            <Link href={docs[doc].url} target="_blank">
              here to view the state machine diagram.
            </Link>{' '}
          </Typography>
        </Stack>
      ))}
      t
    </Stack>
  );
};

export default About;
