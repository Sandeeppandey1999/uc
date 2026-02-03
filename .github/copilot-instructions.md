# Copilot Instructions - User Management React App

## Project Overview
This is a React-based user management CRUD application built with Material-UI (MUI) components. The app communicates with a backend API at `http://localhost:9090` for all data operations.

## Architecture & Key Files

- **`src/App.js`** - Main application component containing all business logic, state management, and CRUD operations
- **`src/components/columns.js`** - DataGrid column configuration with action buttons (Edit/Delete)
- **`src/components/navbar.js`** - Top navigation bar with search functionality and "Add User" button
- **`src/components/deleteConfirm.js`** - Reusable confirmation dialog for delete operations
- **`package.json`** - Contains critical dependencies: MUI v7, DataGrid v8, Axios, React 19

## State Management Pattern

All state lives in `App.js` using React hooks. No external state management library is used. Key state patterns:

```javascript
// Form state - single object for all fields
const [value, setValue] = React.useState({ firstName: '', lastName: '', age: '', gender: '', number: '', email: '', address: '' });

// Validation state - mirrors form fields
const [errors, setErrors] = React.useState({ firstName: '', lastName: '', ... });

// UI state - dialogs, notifications, search
const [open, setOpen] = React.useState(false);  // Add/Edit dialog
const [openDeleteConfirm, setOpenDeleteConfirm] = React.useState(false);
const [notify, setNotify] = React.useState({ message: '', type: '' });
```

## API Integration

All API calls use Axios POST requests to `http://localhost:9090/api/v1/`:

- **List:** `POST /listUser` - Returns array of user objects
- **Create:** `POST /createUser` - Body: user object (no id)
- **Update:** `POST /updateUser/{id}` - Body: user object with id
- **Delete:** `POST /deleteUser/{id}` - No body required

**Important:** API uses POST for all operations (not RESTful). User objects require: `firstName`, `lastName`, `age`, `gender`, `number`, `email`, `address`.

## Form Validation Rules

Real-time validation runs on every form value change via `useEffect`:

- **firstName/lastName:** Must not be empty or whitespace only
- **email:** Required, must match regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- **age:** Must be 0-120
- **gender:** Must be "male" or "female" (radio buttons enforce this)
- **number:** Must be exactly 10 digits (`/^\d{10}$/`)
- **address:** Must be at least 5 characters after trim

Form submission checks both validation errors AND empty fields before making API calls.

## Component Communication Pattern

Props are passed down for callbacks (no context or Redux):

```javascript
// columns.js receives callbacks as function parameters
const columns = (onEdit, onDelete) => [...]

// Navbar receives handlers as props
<Navbar handleSearch={handleSearch} handleOpen={handleOpen} refresh={refresh} />

// DeleteConfirm receives state and handlers
<DeleteConfirm open={openDeleteConfirm} onClose={handleCloseDeleteConfirm} onDelete={onDeleteAgree} />
```

## MUI Specifics

- **DataGrid:** Uses `@mui/x-data-grid` v8 with pagination (5, 10, 20, 50 items per page)
- **Grid v2:** Uses the new `Grid` component with `size` prop (not `xs`/`md`/`lg`)
- **Styling:** Uses `sx` prop for inline styles (no separate style files for components)
- **Forms:** Standard MUI `TextField` with `variant="standard"` throughout
- **Notifications:** `Snackbar` with `Alert` component (bottom-right position, 5s duration)

## Development Workflow

```bash
npm start    # Starts dev server on localhost:3000
npm test     # Runs Jest tests
npm run build # Creates production build
```

**Backend requirement:** The backend API server must be running on `http://localhost:9090` for the app to function.

## Search Implementation

Client-side filtering on ALL user fields (firstName, lastName, email, address, number, gender, age):

```javascript
useEffect(() => {
  if (searchTerm) {
    const filteredUsers = users.filter(user =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // ... checks all fields
    );
    setFilteredUsers(filteredUsers);
  } else {
    setFilteredUsers(users);
  }
}, [searchTerm, users]);
```

## Code Conventions

- Use `React.useState` instead of direct `useState` import
- All axios calls include `.catch()` error handling with console logging
- Success/error messages always trigger `setNotify` + `setOnOpen(true)`
- Dialog forms reset with `handleClose()` which clears all form state
- Edit mode detected by checking `if (value.id)` in `onSubmit`

## Common Tasks

**Adding a new user field:**
1. Add to `value` and `errors` state objects in `App.js`
2. Add validation logic in the validation `useEffect`
3. Add `TextField` in the Dialog form Grid
4. Add column definition in `components/columns.js`
5. Update API payload structure if backend requires it

**Modifying validation:**
Edit the validation `useEffect` in `App.js` (lines 67-108). Each field has its own validation block.

**Changing API endpoint:**
Update the base URL in all axios calls (currently `http://localhost:9090/api/v1/`).
