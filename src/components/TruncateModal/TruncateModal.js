import React from 'react';
import { styled, Box, Typography, Dialog } from '@mui/material';
import { useMachine } from '@xstate/react'; 
import { menuMachine } from '../../machines';
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0)
}));

const TextBlock = ( { children, ...props } ) => <Typography
        {...props}
        variant="body2"
        dangerouslySetInnerHTML={{
          __html: children,
        }}
      ></Typography>
 
const TruncateModal = ({ limit = 100, children }) => {
  const [state, send] = useMachine(menuMachine, {
    services: {
      menuClicked: async (context, event) => { 
        // do nothing
      },
    },
  });

  const handleClose = () => send('close');
  const handleClick = () => send('open');
  if (!children) return <i />
  if (children.length < limit) {
    return (
      <TextBlock>{children}</TextBlock>
    )
  }

 return (
   <Layout data-testid="test-for-TruncateModal">
      <TextBlock onClick={handleClick}>{children.substr(0, limit)}...</TextBlock>
      <Dialog onClose={handleClose} open={state.matches('opened')}>
      <Box sx={{p: 2}}>
      <TextBlock>{children}</TextBlock>
      </Box>
      </Dialog>
   </Layout>
 );
}
TruncateModal.defaultProps = {};
export default TruncateModal;
