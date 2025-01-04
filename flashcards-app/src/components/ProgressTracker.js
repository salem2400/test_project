import React from 'react';
import { Container, Typography } from '@mui/material';

const ProgressTracker = ({ progress }) => {
  return (
    <Container>
      <Typography variant="h4" component="h2" gutterBottom>
        Progress
      </Typography>
      <Typography variant="body1">
        {progress} cards reviewed
      </Typography>
    </Container>
  );
};

export default ProgressTracker;
