import React from 'react';
import { Box, Button, styled } from '@mui/material';

export const Outer = styled(Box)(() => ({
  width: '100vw',
  display: 'flex',
  justifyContent: 'center',
}));

export const Inner = styled(Box)(({ wide }) => ({
  width: wide ? '100vw' : '60vw',
  overflow: 'hidden',
}));

export const Btn = styled(Button)(() => ({
  textTransform: 'capitalize',
}));
