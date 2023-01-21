import React from 'react';
import { styled, Typography, Divider, Stack, Card, Box } from '@mui/material';
import { Chip } from '@mui/material';

const TargetNode = ({ id, target, prefix }) => {
  const item = Array.isArray(target) ? target.pop() : target;

  if (item) {
    return (
      <Typography sx={{ lineHeight: 0.9 }} variant="caption">
        ↳ <em>{item.replace(`${id}.`, '').replace(`${prefix}.`, '')}</em>
      </Typography>
    );
  }

  return <i />;
};

const EventNode = ({ event, id, prefix, name, transitions }) => {
  if (event?.target) {
    return (
      <>
        <TargetNode target={event.target} />
      </>
    );
  }

  if (transitions) {
    const transition = transitions.find((t) => t.event === name);
    const target = transition.target[0];
    return (
      <>
        <TargetNode id={id} target={target.id || target} prefix={prefix} />
      </>
    );
    // return JSON.stringify(target.id || target)
  }
  return <i />;
};

const StatusChip = ({ id, prefix, name, previous, events, transitions }) => {
  return (
    <Chip
      color={name === previous ? 'error' : 'primary'}
      label={
        <Stack>
          <Typography sx={{ lineHeight: 0.9 }} variant="subtitle2">
            {name}
          </Typography>
          <EventNode
            id={id}
            event={events[name]}
            name={name}
            transitions={transitions}
            prefix={prefix}
          />

          {/* {!!events[name].target && (
            <Typography sx={{ lineHeight: 0.9 }} variant="caption">
              ↳ <em>{events[name].target}</em>
            </Typography>
          )} */}
        </Stack>
      }
      sx={{ mb: 1 }}
      variant="outlined"
    />
  );
};

const Layout = styled(Box)(({ theme }) => ({
  margin: theme.spacing(2),
}));

const StateName = ({ state }) => {
  if (typeof state === 'string') {
    return state;
  }
  return (
    <>
      {Object.keys(state)[0]}.{Object.values(state)[0]}
    </>
  );
};

const Diagnostics = ({ id, state, states }) => {
  const { previous } = state.context;
  const event =
    typeof state.value === 'string'
      ? states[state.value]
      : states[Object.keys(state.value)[0]].states[
          Object.values(state.value)[0]
        ];
  if (!event) return <>{JSON.stringify(state.value)}</>;

  const events = event.on;
  const prefix =
    typeof state.value === 'string' ? state.value : Object.keys(state.value)[0];

  return (
    <Card sx={{ mt: 2, width: 'fit-content', minWidth: 400 }}>
      <Layout data-testid="test-for-Diagnostics">
        <Typography variant="body2">
          <b>Machine ID: "{id}"</b>
        </Typography>

        <Divider sx={{ m: (t) => t.spacing(0.5, 0) }} />

        <Typography variant="body2">
          Current state:{' '}
          <b>
            <StateName state={state.value} />
          </b>
        </Typography>

        <Divider sx={{ m: (t) => t.spacing(0.5, 0) }} />

        {!!previous && (
          <>
            <Typography variant="body2">
              Last event: <b>{JSON.stringify(previous)}</b>
            </Typography>
            <Divider sx={{ m: (t) => t.spacing(0.5, 0) }} />
          </>
        )}

        <Stack>
          <Typography variant="caption">
            Events available in{' '}
            <em>
              <StateName state={state.value} />
            </em>{' '}
            state
          </Typography>
          <Stack direction="row" sx={{ flexWrap: 'wrap' }} spacing={1}>
            {!!events &&
              Object.keys(events).map((key) => (
                <StatusChip
                  id={id}
                  prefix={prefix}
                  key={key}
                  name={key}
                  previous={previous}
                  events={events}
                  transitions={event.transitions}
                />
              ))}
          </Stack>
        </Stack>
      </Layout>
      {/* <pre>
     {JSON.stringify(states,0,2)}
    </pre> */}
    </Card>
  );
};
Diagnostics.defaultProps = {};
export default Diagnostics;
