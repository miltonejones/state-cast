import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import SubscribeButton from './SubscribeButton';
 
afterEach(() => cleanup());
 
describe('<SubscribeButton/>', () => {
 it('SubscribeButton mounts without failing', () => {
   render(<SubscribeButton />);
   expect(screen.getAllByTestId("test-for-SubscribeButton").length).toBeGreaterThan(0);
 });
});

