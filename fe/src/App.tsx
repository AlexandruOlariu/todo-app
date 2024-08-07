import React from 'react';
import TodoList from './components/TodoList';
import { Container, CssBaseline, Typography } from '@mui/material';

const App: React.FC = () => {
  return (
    <Container>
      <CssBaseline />
      <Typography variant="h4" component="h1" gutterBottom>
        Todo List
      </Typography>
      <TodoList />
    </Container>
  );
};

export default App;
