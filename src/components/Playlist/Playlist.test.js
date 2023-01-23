import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import Playlist from './Playlist';
 
afterEach(() => cleanup());
 
describe('<Playlist/>', () => {
 it('Playlist mounts without failing', () => {
   render(<Playlist />);
   expect(screen.getAllByTestId("test-for-Playlist").length).toBeGreaterThan(0);
 });
});

