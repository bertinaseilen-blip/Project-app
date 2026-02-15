
## Client assignment
I structured the client by separating the UI, logic, and data handling into different folders. The UI (userComponent.mjs) is placed in the components folder and is responsible for rendering the page and handling user interactions like creating and deleting users. The controllers folder contains the logic that connects the UI to the API. It handles the communication between the frontend and the server.

All HTTP requests are centralized in a single fetchManager file inside the utils folder (copied and pasted from examples provided in canvas). This ensures that the client only uses one fetch call, as required in the assignment, and avoids repeating request code in multiple places. The client uses relative URLs when calling the API.