import React from 'react';
import { Box, styled } from '@mui/material';

export const Outer = styled(Box)(() => ({
  width: '100vw',
  display: 'flex',
  justifyContent: 'center',
}));

export const Inner = styled(Box)(({ wide }) => ({
  width: wide ? '100vw' : '50vw',
  overflow: 'hidden',
}));
