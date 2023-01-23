import React from 'react';
import { Box, Button, styled } from '@mui/material';

export const Outer = styled(Box)(({ theme }) => ({
  width: '100vw',
  display: 'flex',
  justifyContent: 'center',
  minHeight: '80vh',
  paddingBottom: theme.spacing(8)
}));

export const Inner = styled(Box)(({ theme, wide }) => ({
  width: wide ? '100vw' : '60vw',
  overflow: 'hidden',
  paddingBottom: theme.spacing(3)
}));

export const Btn = styled(Button)(() => ({
  textTransform: 'capitalize',
}));
