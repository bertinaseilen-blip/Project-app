# Middleware Task

## Purpose
A middleware that can check when a task is marked completed. 


## Problem
Without middleware, task completion logic would need to be written inside each route that updates a task, making the code harder to maintain.

## Behavior

- Checks if the task is marked as completed <br>
- Logs a message when a task is completed <br>
- Passes control to the next handler

## Testing
The middleware was tested by sending PUT requests to the /task endpoint with completed: true in the request body. The completion message was logged to the server console, confirming correct behavior.

# API task

The API (tasksAPI.mjs in routes folder) is designed to manage tasks/reminders created by the client.
Tasks can be created, retrieved, updated, and deleted using a REST’ish API.
The API is scaffolded using Express and tested using Insomnia.
An Insomnia collection is included in the repository/folder insomnia.