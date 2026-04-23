
# UI/UX Features (TSX + CSS)
## Navigation & Information Architecture

- **Clear route structure** via React Router:
	- Landing (`/`) → Login/Register → Dashboard (`/dashboard`) → Presentation editor (`/presentation/:id?slide=slideno`).
- **Protected routes**: `ProtectedRoute` redirects unauthenticated users to Login, preventing confusing “empty” pages and keeping flows predictable.
- **In-page navigation**:
	- Dashboard cards navigate to a presentation editor.
	- Presentation editor has a **Back to dashboard** action.

## Layout & Visual Hierarchy

- **Consistent dark theme**: black background with white text for strong contrast and reduced visual noise.
- **Intent-driven button styling**:
	- Primary actions: `.btn-primary` (e.g., “New Presentation”, “Create”, “+ New Slide”).
	- Secondary actions: `.btn-secondary` (e.g., “Back”, “Edit thumbnail”).
	- Destructive actions: `.btn-logout`red styling (e.g., “Delete”, “Delete Slide”, logout).
- **Structured spacing & alignment** using flex/grid:
	- Dashboard header uses aligned actions on the right.
	- Presentations are displayed in a responsive grid with consistent card aspect ratio.

## Responsive Design

- **Mobile-friendly sizing**: global CSS reduces `.btn` padding and text size under `640px`.
- The UI avoids horizontal scrolling (root is `overflow-x: hidden`), helping usability on smaller screens.

## Input Validation

- Email format checking.
- Password required checks and minimum length (register).
- Confirm-password matching (register).
- Forms use `noValidate` to ensure the application’s error messages remain consistent and predictable across browsers.

## Error Feedback

- **ErrorPopup** component provides clear feedback when API/auth operations fail:
	- Auto-dismiss after 3 seconds (reduces persistent clutter).
	- Manual “Close” button for user control.
- Confirmation is required for presentation deletion

## Modals & Progressive Disclosure

- The interface uses modals to keep the main screen uncluttered:
	- Creating a new presentation (Dashboard).
	- Editing title/thumbnail (Presentation editor).
	- Adding/editing slide elements (AddElementModal).
- **Click-outside to dismiss** on modal overlays gives a quick escape route.

## Presentation Editor Usability

- Slide editing is centered on a consistent **2:1 stage area**, matching the card layout on the dashboard.
- **Element creation tool palette**:
	- Quick add buttons for Text/Image/Video.
	- Tooltips explain abbreviated controls.
- **Editing gestures** for efficiency:
	- Double-click element to edit.
	- Right-click (context menu) to delete an element.
- **Slide navigation**:
	- Previous/Next buttons are disabled at boundaries.
	- Keyboard shortcuts: Left/Right arrow keys move between slides.