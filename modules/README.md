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

<br>

# API for tasks
## Overview

This API is used by the Reminder Application client to create and manage tasks/reminders.
The API follows a REST’ish design and communicates using JSON over HTTP.

The API is scaffolded using Express and is not fully implemented.
Testing is performed using Insomnia/Bruno, and the test setup is included in the repository. (APItest/middlewereTest)

## Task Resource

A task represents a reminder.

Fields:
- id: string
- title: string
- completed: boolean

## Endpoints

### Get all tasks
GET /api/tasks

Returns a list of all tasks.

### Get task by ID
GET /api/tasks/:id

Returns a single task.

### Create task
POST /api/tasks

Body:
{
  "title": "Buy milk"
}

### Update task
PUT /api/tasks/:id

Body:
{
  "completed": true
}

### Delete task
DELETE /api/tasks/:id

Deletes a task.
