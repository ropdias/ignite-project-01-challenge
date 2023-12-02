import { randomUUID } from 'node:crypto';
import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      if (!req.body) {
        res.setHeader('Content-Type', 'application/json');
        return res.writeHead(404).end(
          JSON.stringify({
            error: 'body must be a valid JSON',
          })
        );
      }

      const { title, description } = req.body;

      if (!title || !description) {
        res.setHeader('Content-Type', 'application/json');
        return res.writeHead(404).end(
          JSON.stringify({
            error: 'title e description must exist',
          })
        );
      }

      const dateNow = Date.now();

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: dateNow,
        updated_at: null,
      };

      database.insert('tasks', task);

      return res.writeHead(201).end();
    },
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const tasks = database.select('tasks');
      return res.end(JSON.stringify(tasks));
    },
  },

  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;

      if (!req.body) {
        res.setHeader('Content-Type', 'application/json');
        return res.writeHead(404).end(
          JSON.stringify({
            error: 'body must be a valid JSON',
          })
        );
      }

      const { title, description } = req.body;

      if (!title || !description) {
        res.setHeader('Content-Type', 'application/json');
        return res.writeHead(404).end(
          JSON.stringify({
            error: 'title e description must exist',
          })
        );
      }

      const tasks = database.select('tasks');

      const rowIndex = tasks.findIndex((row) => row.id === id);

      if (rowIndex > -1) {
        let taskToUpdate = tasks[rowIndex];

        const dateNow = Date.now();

        taskToUpdate = {
          ...taskToUpdate,
          title,
          description,
          updated_at: dateNow,
        };

        database.update('tasks', id, taskToUpdate);
        return res.writeHead(204).end();
      } else {
        res.setHeader('Content-Type', 'application/json');
        return res
          .writeHead(404)
          .end(JSON.stringify({ error: 'id is not valid' }));
      }
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;

      const tasks = database.select('tasks');

      const rowIndex = tasks.findIndex((row) => row.id === id);

      if (rowIndex > -1) {
        database.delete('tasks', id);
        return res.writeHead(204).end();
      } else {
        res.setHeader('Content-Type', 'application/json');
        return res
          .writeHead(404)
          .end(JSON.stringify({ error: 'id is not valid' }));
      }
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params;

      const tasks = database.select('tasks');

      const rowIndex = tasks.findIndex((row) => row.id === id);

      if (rowIndex > -1) {
        let taskToUpdate = tasks[rowIndex];

        const dateNow = Date.now();

        taskToUpdate = {
          ...taskToUpdate,
          completed_at: dateNow,
        };

        database.update('tasks', id, taskToUpdate);
        return res.writeHead(204).end();
      } else {
        res.setHeader('Content-Type', 'application/json');
        return res
          .writeHead(404)
          .end(JSON.stringify({ error: 'id is not valid' }));
      }
    },
  },
];
