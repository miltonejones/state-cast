import React from 'react';
import {
  Card,
  IconButton,
  Paper,
  Stack,
  Slider,
  Box,
  LinearProgress,
  Typography,
  Drawer,
  Badge,
  styled,
} from '@mui/material';
import Marquee from 'react-fast-marquee';
import { useMachine } from '@xstate/react';
import { audioMachine } from '../machines';
import { AudioConnector, frameLooper } from './eq';
import { Diagnostics } from '.';

const Bureau = styled(Paper)(({ open }) => ({
  position: 'fixed',
  bottom: open ? 0 : '-134vh',
  transition: 'bottom 0.2s linear',
  left: 0,
  width: '100vw',
}));

const connector = new AudioConnector();

export const useStatePlayer = () => {
  const services = {
    clearAudio: async (context) => {
      context.player.pause();
      context.player.src = null;
      await new Promise((go) => setTimeout(go, 999));
    },

    startAudio: async (context) => {
      try {
        context.player.src = context.src;
        context.player.play();
        return context.player;
      } catch (e) {
        throw new Error(e);
      }
    },
    loadAudio: async (context) => {
      const audio = new Audio();
      if (context.eq) {
        const { analyser } = connector.connect(audio);
        frameLooper(analyser, (coords) => {
          send({
            type: 'COORDS',
            coords,
          });
        });
      }

      audio.addEventListener('error', () => {
        send('ERROR');
      });

      audio.addEventListener('timeupdate', () => {
        // const coords = frameLooper(analyser);
        // console.log ({ coords })
        send({
          type: 'PROGRESS',
          currentTime: audio.currentTime,
          duration: audio.duration,
          // coords: frameLooper(analyser)
        });
      });
      return audio;
    },
  };
  const [state, send] = useMachine(audioMachine, { services });

  const { duration, currentTime, src } = state.context;

  const idle = state.matches('idle');

  const handleSeek = (event, newValue) => {
    const percent = newValue / 100;
    send({
      type: 'SEEK',
      value: duration * percent,
    });
  };

  const handleSkip = (secs) => {
    // alert(currentTime);
    // const percent = newValue / 100;
    send({
      type: 'SEEK',
      value: currentTime + Number(secs),
    });
  };

  const handlePlay = (value, title, image, owner, trackList) => {
    const replay = !!value && value !== src;
    if (state.matches('idle.loaded') || replay) {
      return send({
        type: 'OPEN',
        value,
        title,
        image,
        owner,
        trackList,
      });
    }

    return send({
      type: 'PAUSE',
    });
  };

  const handleEq = () => {
    send({
      type: 'EQ',
    });
  };

  const handleClose = () => {
    send({
      type: 'CLOSE',
    });
  };

  const icon = state.matches('opened.playing') ? (
    <i class="fa-regular fa-circle-pause"></i>
  ) : (
    <i class="fa-solid fa-circle-play"></i>
  );

  return {
    states: audioMachine.states,
    id: audioMachine.id,
    state,
    send,

    icon,
    idle,

    // player methods
    handleClose,
    handleSeek,
    handleSkip,
    handlePlay,
    handleEq,
    ...state.context,
  };
};

const Progress = ({ progress, handleSeek, src}) => {
  const open = Boolean(progress);
  if (!open)
    return (
      <>
        <LinearProgress />
        <Typography>Loading {src?.substr(0,50)}...</Typography>
      </>
    );
  return (
    <Slider
      min={0}
      max={100}
      sx={{ width: '100%' }}
      onChange={handleSeek}
      value={progress}
    />
  );
};

const StatePlayer = ({
  handleDiagnoticsClose,
  icon,
  idle,
  state,
  states,
  debug,
  id,

  // player methods
  handleClose,
  handleSeek,
  handlePlay,
  handleSkip,
  handleList,
  handleEq,

  // context vars
  src,
  title,
  owner,
  image,
  progress,
  duration,
  scrolling,
  current_time_formatted,
  duration_formatted,
  coords,
  trackList,
  eq,
  retries,
  ...rest
}) => {
  // const ref = useRef(null);
  // console.log({ progress });
  const red =
    'linear-gradient(0deg, rgba(2,160,5,1) 0%, rgba(226,163,15,1) 18px, rgba(255,0,42,1) 30px)';


  // if (idle) return <i />;
  return (
    <>
      {/* <Drawer anchor="top" open={!idle}>
        <pre>{JSON.stringify(trackList, 0, 2)}</pre>
      </Drawer> */}

      <Bureau
        elevation={4}
        open={!idle}
        ModalProps={{
          slots: { backdrop: 'div' },
          slotProps: {
            root: {
              //override the fixed position + the size of backdrop
              style: {
                position: 'absolute',
                top: 'unset',
                bottom: 'unset',
                left: 'unset',
                right: 'unset',
              },
            },
          },
        }}
      >
        {/* <pre>{JSON.stringify(rest, 0, 2)}</pre> */}
        <Stack spacing={2} sx={{ p: 2, alignItems: 'center' }} direction="row">
          {!!image && (
            <img
              style={{ borderRadius: 5 }}
              src={image}
              title={title}
              width={72}
              height={72}
            />
          )}

          <Stack sx={{ width: 300 }}>
            <Badge badgeContent={retries} color="secondary">
              <Typography>{owner}</Typography>
            </Badge>
            <Text scrolling={scrolling}>
              <Typography sx={{ whiteSpace: 'nowrap ' }} variant="body2">
                {title}
              </Typography>
            </Text>

            {/* <Typography variant="body1">{title}</Typography> */}
          </Stack>

          <Stack direction="row" sx={{ alignItems: 'center' }}>
            {!!handleList && <IconButton onClick={handleList}><i class="fa-solid fa-list-check"></i>
              </IconButton>}
            <ThirtyButton direction="left"  onClick={() => handleSkip(-30)} /> 
            <IconButton size="large" onClick={() => handlePlay()}>
              {icon}
            </IconButton>
            <ThirtyButton direction="right"  onClick={() => handleSkip(30)} /> 
          </Stack>

          <Typography variant="caption">{current_time_formatted}</Typography>

          <Box sx={{ ml: 1, mr: 1, width: 'calc(100vw - 500px)' }}> 
            {/* {state.matches('opened.error.fatal') && <>fatal error</>} */}
            {state.matches('opened.error.fatal') 
              ?  <Typography onClick={() => send('RECOVER')}>Could not load audio. Please try again later.</Typography>
              :  <Progress progress={progress} handleSeek={handleSeek} src={src} />
              }
           
         
          </Box>

          <Typography variant="caption">{duration_formatted}</Typography>

          {!!coords && eq && (
            <Box>
              <Card sx={{ width: 300, mb: 1 }}>
                <Stack
                  sx={{
                    alignItems: 'flex-end',
                    height: 40,
                    width: 300,
                    border: 'solid 1px',
                    borderColor: 'divider',
                    position: 'relative',
                  }}
                  direction="row"
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                    }}
                  >
                    <img src={bg()} alt="cover" />
                  </Box>

                  {coords.map((f) => (
                    <Box
                      sx={{
                        background: red,
                        ml: '1px',
                        width: '9px',
                        height: Math.abs(f.bar_height / 4),
                      }}
                    ></Box>
                  ))}
                </Stack>
              </Card>
            </Box>
          )}
          <IconButton onClick={handleClose}>
            <i class="fa-solid fa-xmark"></i>
          </IconButton>
        </Stack>
 
      </Bureau>

      <Diagnostics id={id} state={state} states={states} onClose={handleDiagnoticsClose} open={debug} />
    </>
  );
};

const ThirtyButton = ({ direction, onClick }) => {
  return (
    <IconButton
    onClick={onClick}
    sx={{ position: 'relative', width: 40, height: 40 }}
  >
    <i className={`fa-solid fa-arrow-rotate-${direction}`}></i>
    <Typography
      variant="caption"
      sx={{ fontSize: '0.5rem', fontWeight: 700, position: 'absolute' }}
    >
      30
    </Typography>
  </IconButton>
  )
}

const Text = ({ scrolling, children }) => {
  if (scrolling) {
    return (
      <Marquee play gradientColor="#222">
        {children}
      </Marquee>
    );
  }
  return children;
};

const rbg = () => {
  const hu = () => Math.ceil(Math.random() * 255);
  return `rgb(${hu()},${hu()},${hu()})`;
};

function bg() {
  var c = document.createElement('canvas');
  c.width = 300;
  c.height = 40;
  var ctx = c.getContext('2d');
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = 'white';
  ctx.beginPath();
  for (let y = 0; y < 100; y += 4) {
    ctx.moveTo(0, y);
    ctx.lineTo(300, y);
    ctx.stroke();
  }
  return c.toDataURL('image/png');
}

StatePlayer.defaultProps = {};
export default StatePlayer;
