import React from 'react';
import Playlist from './Playlist';
 
export default {
 title: 'Playlist',
 component: Playlist
};
 
const Template = (args) => <Playlist {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
