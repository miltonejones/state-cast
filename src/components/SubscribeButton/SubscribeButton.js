import React from 'react';
import { styled, Box, Collapse, Typography } from '@mui/material';
import { useMachine } from '@xstate/react'; 
import { menuMachine } from '../../machines';
 
const Layout = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center', 
  gap: 4,
  cursor: 'pointer'
}));
 
const SubscribeButton = ({ onChange, subscribed }) => {
  const [state, send] = useMachine(menuMachine, {
    services: {
      menuClicked: async (context, event) => {
        onChange && onChange(event.value);
      },
    },
  });
  
  const handleClose = (value) => () =>
    send({
      type: 'close',
      value,
    });
  const handleClick = () => send('open');
 return (
   <Layout onMouseEnter={handleClick}  onMouseLeave={handleClose()}>
     <Collapse sx={{m: 0,p: 0}} orientation="horizontal" in={state.matches('opened')}>
      <Box onClick={handleClose(!subscribed)}>
        <Typography variant="body2">{subscribed ? "unsubscribe" : "subscribe"}</Typography> 
      </Box> 
     </Collapse> 
     <i
      className={`fa-${
        subscribed ? 'solid' : 'regular'
      } fa-star`}
    ></i>

   </Layout>
 );
}
SubscribeButton.defaultProps = {};
export default SubscribeButton;
