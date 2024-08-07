// src/components/TodoList.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog,
  DialogActions, DialogContent, DialogTitle, TextField, IconButton, MenuItem, Select
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { Todo } from '../interfaces/Todo';
import { statuses } from '../constants/statuses';

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [open, setOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);
  const [newTodo, setNewTodo] = useState<Todo>({ id: 0, name: '', description: '', status: 0 });

  useEffect(() => {
    axios.get(
      `${process.env.REACT_APP_API_URL}/todos`
    )
      .then(response => {
        setTodos(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the todos!', error);
      });
  }, []);

  const handleOpen = (todo?: Todo) => {
    setCurrentTodo(todo || null);
    setNewTodo(todo || { id: 0, name: '', description: '', status: 0 });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setNewTodo(prevState => ({
      ...prevState,
      [name as string]: name === 'status' ? Number(value) : value
    }));
  };

  const handleSave = () => {
    if (currentTodo) {
      axios.put(`${process.env.REACT_APP_API_URL}/todos/${currentTodo.id}`, newTodo)
        .then(response => {
          setTodos(todos.map(todo => (todo.id === currentTodo.id ? response.data : todo)));
          handleClose();
        });
    } else {
      axios.post(`${process.env.REACT_APP_API_URL}/todos`, newTodo)
        .then(response => {
          setTodos([...todos, response.data]);
          handleClose();
        });
    }
  };

  const handleDelete = (id: number) => {
    axios.delete(`${process.env.REACT_APP_API_URL}/todos/${id}`)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      });
  };

  return (
    <TableContainer component={Paper}>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add Todo
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {todos.map(todo => (
            <TableRow key={todo.id}>
              <TableCell>{todo.name}</TableCell>
              <TableCell>{todo.description}</TableCell>
              <TableCell>{statuses[todo.status]}</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => handleOpen(todo)}>
                  <Edit />
                </IconButton>
                <IconButton color="secondary" onClick={() => handleDelete(todo.id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentTodo ? 'Edit Todo' : 'Add Todo'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={newTodo.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            value={newTodo.description}
            onChange={handleChange}
          />
          <Select
            margin="dense"
            name="status"
            value={newTodo.status}
            onChange={(e:any)=>handleChange(e)}
            fullWidth
          >
            <MenuItem value={0}>Not Started</MenuItem>
            <MenuItem value={1}>In Progress</MenuItem>
            <MenuItem value={2}>Completed</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default TodoList;
