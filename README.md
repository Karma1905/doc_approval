# Document Approval Hub

A lightweight document submission and approval system where a writer uploads a document, previews extracted content, and submits it for manager approval. The manager receives an email summary with actionable approve/reject links.

This project was built as part of an SDE Internship assignment, with a focus on correctness, clarity, and clean separation of concerns.

---

## Features

* Upload `.docx`, `.txt`, or `.md` files
* Auto-extract:

  * Optional image reference (URL or markdown image syntax)
  * Title (first meaningful line)
  * Content (remaining text)
* Draft → Pending → Approved / Rejected workflow
* Email notification on submission with approve/reject links
* Simple role-based UI for Writer and Manager
* JSON-based storage (no heavy database)

---

## Tech Stack

### Frontend

* React (Vite)
* TypeScript
* Minimal, clean UI

### Backend

* Node.js
* Express
* Multer (file uploads)
* Mammoth (DOCX parsing)
* Nodemailer (email notifications)
* JSON file storage (in-memory alternative allowed)

### Testing

* Vitest (unit tests)

---

## Login Credentials

Authentication is intentionally kept simple with hard-coded credentials.

**Writer**

* Email: `writer@example.com`
* Password: `writer123`

**Manager**

* Email: `manager@example.com`
* Password: `manager123`

---

## Workflow Overview

1. Writer uploads a document
2. The system extracts image (if any), title, and content
3. The document is saved in `draft` state
4. Writer submits the document for approval
5. Manager receives an email containing:

   * Document title
   * Content snippet (first 100 characters)
   * Approve and Reject links
6. Manager approves or rejects the document
7. Document status updates accordingly

Invalid state transitions (for example, approving an already approved document) are prevented.

---

## Email Notification

Emails are sent using Gmail SMTP via Nodemailer.

* Email is triggered when a document is submitted for approval
* Contains title, content snippet, and approval links
* Approval links call backend endpoints to update document status

**Fallback behavior**:
If SMTP is unavailable or blocked by the provider, the application logs the email content (including approval links) to the console. This ensures the approval workflow can still be verified during evaluation.

---

## Running the Project Locally

### Backend Setup

```bash
cd backend
npm install
node src/app.js
```

Create a `.env` file in the `backend` directory:

```env
GMAIL_USER=yourgmail@gmail.com
GMAIL_PASS=your_app_password
```

> Note: `GMAIL_PASS` must be a Gmail App Password, not your normal Gmail password.

Backend runs on:

```
http://localhost:8000
```

---

### Frontend Setup

```bash
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

A proxy is configured so frontend requests to `/api/*` are forwarded to the backend.

---

## Tests

Basic unit tests are included to validate core logic.

* Parser tests: verify image, title, and content extraction
* Workflow tests: verify valid and invalid state transitions

Run tests with:

```bash
cd backend
npm test
```

---

## Project Structure

The backend is structured to maintain clear separation of concerns:

* `routes/` – API route definitions
* `controllers/` – Request handling and workflow logic
* `services/` – Parsing, storage, and email logic
* `data/` – JSON file storage
* `tests/` – Unit tests

This avoids a monolithic design and makes the code easier to reason about and extend.

---

## One Thing I’d Improve

Given more time, I would replace JSON file storage with a persistent database and add authentication for real multi-user usage. I would also add retry logic and better observability for email delivery.

---

## Notes

This project intentionally avoids heavy frameworks, databases, and authentication systems to keep the focus on parsing correctness, workflow logic, and clean backend design, as required by the assignment.
