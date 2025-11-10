# Form Cards UI – Angular Test Task

**Test Assignment for Angular Developer Position**

---

## Project Overview

This project demonstrates a dynamic form cards interface built with **Angular 20**, **Angular Material 20**, and **Bootstrap 5**. Users can create, edit, validate, and submit multiple forms simultaneously. The submission process includes a timer with a cancel option, simulating real-world form handling scenarios.

**Key features:**

- Dynamic creation of multiple form cards (up to 10)  
- Input validation with custom directive messages  
- Backend simulation using an HTTP interceptor  
- Submit all forms at once with a countdown timer and cancel option  
- Reusable, clean Angular components following good architecture and code separation principles  

---

## Features

### Form Inputs

Each form card has three inputs:

1. **Country**  
   - Text input with suggestions from `Country` enum (`src/app/shared/enum/country.ts`)  
   - Validation prevents submission of values not listed in the enum  

2. **Username**  
   - Text input with backend validation (`/api/checkUsername`)  
   - If the backend returns `{ isAvailable: true }`, the username is available. Otherwise, the user must choose another username  
   - Backend emulator implemented in the interceptor: any username containing `new` returns available  

3. **Birthday**  
   - Datepicker input  
   - Birthdays cannot be later than the current date  

### Validation Messages

- Implemented via a **custom directive**  
- Invalid inputs are highlighted, and messages appear below the input:  
  `"Please provide a correct Country/Username/Birthday"`  

### Form Card Management

- **Add new form card:** Large button to create additional cards  
- **Delete card:** Small “x” button on each card removes it  
- **Invalid forms counter:** Displays the number of forms that are invalid next to the submit button  

### Submission

- **Submit all forms button:**  
  - Blocks editing for all forms  
  - Starts a 5-second countdown timer  
  - Button changes to “Cancel” during the countdown  
- **Cancel button:** Stops the timer and allows editing again  
- **Automatic submission:** If timer runs out, sends form array to `/api/submitForm`, clears forms, and resets the timer/button  

---

## Technologies Used

- Angular 20 (Standalone Components)  
- Angular Material 20  
- Bootstrap 5  
- RxJS  
- TypeScript  
- Jest for unit testing  

---

## Project Structure

- `src/app/components` – Reusable Angular components (`CardComponent`, `MultiCardComponent`)  
- `src/app/shared/directives` – Custom validation directive  
- `src/app/shared/mock-backend` – Backend emulator interceptor  
- `src/app/shared/enum` – Country enum for validation  
- `src/app/services` – Services for data handling  
- `src/custom-theme.scss` – Angular Material & Bootstrap theme integration  

---

## Installation & Running the App

1. Install dependencies:  
   ```bash
   npm install
   ```

2. Start the development server:  
   ```bash
   npm start
   ```

3. Open your browser at [http://localhost:4200](http://localhost:4200)  

---

## Notes

- Bootstrap is already added and can be used freely  
- The backend emulator is in `src/app/shared/mock-backend/mock-backend.interceptor.ts`  
  - `/api/checkUsername` — returns `{isAvailable: true}` if username contains "new", otherwise `{isAvailable: false}`  
  - `/api/submitForm` — receives the array of form values  
- Styling of the page is not the main focus — functionality and structure matter more  
- Comments in code explain implementation decisions where necessary  

---

## Acceptance Criteria

- Form validations work correctly  
- Invalid data cannot be submitted  
- Input validation messages display properly  
- Number of invalid forms is shown  
- Adding/removing form cards works  
- Submit timer and cancel functionality work correctly  

---

## License

This project is for demonstration purposes and is part of a test assignment.
