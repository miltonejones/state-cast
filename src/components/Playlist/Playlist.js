import React from 'react';
import { styled, Drawer } from '@mui/material';
import { PodDetailList } from '..'
 
const Playlist = ({ trackList, send, open, ...props }) => {
  const onClose = () => {
    send({
      type: 'CHANGE',
      showList: false
    })
  }
 return (
   <Drawer anchor="left" open={open}  onClose={onClose}>
    <PodDetailList send={send} minimal trackList={trackList} {...props}/>
     {/* <pre>
      {JSON.stringify(podcast,0,2)}
     </pre> */}
   </Drawer>
 );
}
Playlist.defaultProps = {};
export default Playlist;
