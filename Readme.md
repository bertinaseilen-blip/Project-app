# Reminder app

## Description 
A full-stack reminder application that allows users to create notes/reminders, assign them to categories and set due dates. Users can change and delete reminders and assign to new categories. (and if possible and time allows, share reminders with other users.)

## Feature map

### User:
Add/create user <br>
Log in/ut <br>
Change/Edit <br>
Delete <br>
Reminders

### Reminder:
Add/create <br>
Edit <br>
Delete <br>
Mark completed <br>
Time/due date

### Category:
Add/create <br>
Edit <br>
Delete <br>
Asign reminder to category

### View:
View reminders <br>
View by category <br>
view by due date

### Offline and PWA:
View and create reminders offline <br>
Local storrage <br>
Sync with server when online


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

### Get task by ID
GET /api/tasks/:id

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

# Data Privacy Policy

We collect the minimum amount of personal data required to identify users in the system.
This includes a username and a unique identifier (id)
Data is used solely to associate reminders with a user account.
No data is shared with third parties.
Users may delete their account at any time, which removes all personal data.
By creating an account, users consent to this data usage.

## Data collected
- Username 
- Unique user ID (system-generated)
- Consent to Terms of Service

## Data NOT collected
- real names
- email
- passwords



# Terms of Service

Users retain ownership of all data they create.
By using the service, users grant the application permission to store and process their data for functionality purposes.
The service is provided as-is with no guarantees.
Users may delete their account at any time, which revokes consent and removes personal data.


# Client assignment
I structured the client by separating the UI, logic, and data handling into different folders. The UI (userComponent.mjs) is placed in the components folder and is responsible for rendering the page and handling user interactions like creating and deleting users. The controllers folder contains the logic that connects the UI to the API. It handles the communication between the frontend and the server.

All HTTP requests are centralized in a single fetchManager file inside the utils folder (copied and pasted from examples provided in canvas). This ensures that the client only uses one fetch call, as required in the assignment, and avoids repeating request code in multiple places. The client uses relative URLs when calling the API.