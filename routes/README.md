# API for tasks (tasksAPI.mjs)
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


# API for users (userAPI.mjs)

## User Data

The following data is collected for a user:

- id – unique identifier

- username – chosen display name

- consentToToS – boolean indicating consent to the Terms of Service

No additional personal data is collected.

## Consent

Users must actively consent to the Terms of Service in order to create an account.
Consent is required during user creation and is stored as part of the user data.

Users can retract their consent by deleting their account, which removes all associated personal data.

## Endpoints

### Create user
POST /user

Body:
{
  "username": "Ole",
  "consentToToS": true
}
Creates a new user.

If consent is not given, the request is rejected

## Get all users
GET /user

Returns a list of all users.


### Delete user
DELETE /user/:id

Deletes the specified user and retracts their consent.
All stored personal data for the user is removed.


