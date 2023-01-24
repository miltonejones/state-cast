import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import TruncateModal from './TruncateModal';
 
afterEach(() => cleanup());
 
describe('<TruncateModal/>', () => {
 it('TruncateModal mounts without failing', () => {
   render(<TruncateModal />);
   expect(screen.getAllByTestId("test-for-TruncateModal").length).toBeGreaterThan(0);
 });
});

