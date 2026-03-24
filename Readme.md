# Reminder app
Web service URL: https://reminder-app-demo.onrender.com/

- You can create an account, update your password, and delete your account at any time.
After logging in, you can create, edit, and delete reminders with a title, description, date, and category.
Reminders are automatically organized by category, and completed reminders are moved to a dedicated completed section.
- i18n: added translation for engish and norwegian. the buttons and errors/alerts changes to the correct language based on the browsers language. 


- Added PWA support:
  - Implemented a service worker to cache app files.
  - Offline functionality enabled — the app works even without an internet connection.
  - App is now installable as a Progressive Web App (PWA) on supported devices.

## Description 
A full-stack reminder application that allows users to create notes/reminders, assign them to categories and set due dates. Users can change and delete reminders and assign to new categories. (and if possible and time allows, share reminders with other users.)

## Feature map

### User:
- Add/create user
- Log in/ut
- Change/Edit
- Delete 
- Reminders

### Reminder:
- Add/create 
- Edit
- Delete
- Mark completed
- Time/due date

### Category:
- Add/create
- Edit 
- Delete
- Assign reminder to category

### View:
- View reminders
- View by category 
- view by due date

### Offline and PWA:
- View and create reminders offline
- Local storrage
- Sync with server when online


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

# API for users

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

# Client assignment
I structured the client by separating the UI, logic, and data handling into different folders. The UI (userComponent.mjs) is placed in the components folder and is responsible for rendering the page and handling user interactions like creating and deleting users. The controllers folder contains the logic that connects the UI to the API. It handles the communication between the frontend and the server.

All HTTP requests are centralized in a single fetchManager file inside the utils folder (copied and pasted from examples provided in canvas). This ensures that the client only uses one fetch call, as required in the assignment, and avoids repeating request code in multiple places. The client uses relative URLs when calling the API.

(Previous middleware and tasks API used in earlier assignments have been removed and are no longer part of the application.)