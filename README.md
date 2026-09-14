# BlogIt 

BlogIt is a full-stack blogging platform I built using the **MERN stack**. It started as a simple blogging application, but I gradually extended it to solve some problems I would expect in a real application — like authentication, role-based access, protecting users' work with drafts and autosave, and keeping track of previous versions of a blog.

The project also integrates **Gemini AI** for assisting with blog content generation and **Cloudinary** for image storage.

## Live Demo

**Website:** [https://blog-it-fawn-nu.vercel.app/]

### Demo Admin Account

- **Email:** asthatanwar@123
- **Password:** asthatanwar
  
## Why I Built This

I wanted to understand what goes into building a complete application rather than just creating individual frontend or backend features.

While working on BlogIt, I ended up dealing with things like authentication, API authorization, file uploads, environment variables, autosave timing, and user permissions. These problems made the project much more useful as a learning experience because I had to think about how different parts of a real application work together.

## Features

### Public Blogging

* Browse published blogs
* Search blogs by title
* Filter blogs by category
* View individual blog posts
* Add comments to blogs
* Admin moderation of comments

### Authentication & Role-Based Access

BlogIt uses **JWT-based authentication** with password hashing using bcrypt.

There are three supported roles:

* **Admin** – can manage the platform and all blogs
* **Author** – can create and manage their own blogs
* **User** – can access the public blogging experience

Backend authorization ensures that users cannot modify resources they do not own.

### Blog Management

* Create blogs using a rich-text editor
* Upload blog images through Cloudinary
* Publish/unpublish blogs
* Update and delete blogs
* Category-based organization
* Gemini AI-assisted content generation for supported admin functionality

### Draft Autosave

One of the features I added was **automatic draft saving**.

While writing a blog, changes are automatically saved after a short delay instead of requiring the user to manually save every change.

The autosave system uses debouncing so that a request isn't sent for every keystroke.

### Version History

BlogIt also supports explicit blog version snapshots.

A user can save a version of the current blog and later view previous snapshots through the **Version History** section.

I intentionally kept **autosave and version history separate**:

> Autosave protects the current draft, while a version represents a meaningful snapshot that the user explicitly chooses to save.

This prevents normal typing from creating hundreds of unnecessary versions.

## Tech Stack

| Area              | Technology        |
| ----------------- | ----------------- |
| Frontend          | React, Vite       |
| Backend           | Node.js, Express  |
| Database          | MongoDB, Mongoose |
| Authentication    | JWT               |
| Password Security | bcrypt            |
| AI                | Google Gemini     |
| Image Storage     | Cloudinary        |
| Styling           | Tailwind CSS      |
| Rich Text Editor  | React Quill       |
| HTTP Client       | Axios             |
| Animations        | Framer Motion     |
| Notifications     | React Hot Toast   |

## Architecture
Authentication and authorization middleware protect backend routes before requests reach the relevant controllers.

##  Authentication Flow

1. User submits login credentials.
2. Backend verifies the user and compares the password using bcrypt.
3. Backend generates a JWT containing the authenticated user's information and role.
4. The frontend stores the token for the session.
5. Axios sends the token with protected API requests.
6. Authentication middleware verifies the token.
7. Authorization middleware checks whether the user's role and ownership allow the requested action.

The frontend also performs role-based checks for a better user experience, but **backend authorization remains the final security layer**.

##  Gemini AI Integration

BlogIt integrates Google's Gemini API to assist with blog content generation.

The backend communicates with Gemini rather than exposing the API key to the frontend.

The Gemini API key is stored in an environment variable:

```env
GEMINI_API_KEY=
```

Secrets are intentionally excluded from the repository.

## Image Uploads

Blog images are uploaded to **Cloudinary** instead of being stored directly in the application server.

The general flow is:

```text
React -> Express API -> Multer / temporary file-> Cloudinary -> Secure image URL -> MongoDB
```

Only the resulting image URL is stored with the blog document.

## Security Considerations

Some of the improvements I made while developing the project include:

* JWT authentication
* bcrypt password hashing
* Role-based authorization
* Blog ownership checks
* Environment variables for sensitive credentials
* Protected backend routes
* Expiring JWTs
* Separation of authentication and authorization
* Frontend role checks backed by server-side authorization

Sensitive credentials such as API keys, database credentials, and JWT secrets are **not stored in Git**.

## Important API Endpoints

### Authentication

```text
POST /api/admin/login
```

Authenticates an existing account and returns a JWT.

### Blogs

```text
POST   /api/blog/add
GET    /api/blog/all
GET    /api/blog/:id
PUT    /api/blog/:id
DELETE /api/blog/:id
```

### Drafts

```text
POST /api/blog/draft
PUT  /api/blog/:id/draft
```

### Version History

```text
POST /api/blog/:id/version
GET  /api/blog/:id/versions
```

### Comments

Comment-related endpoints are available for submitting and managing blog comments.

> Authentication and role requirements vary by endpoint. Backend authorization is enforced before protected operations are performed.

## Getting Started

### Prerequisites

Make sure you have:

* Node.js installed
* MongoDB
* A Cloudinary account
* A Google Gemini API key

### Clone the Repository

```bash
git clone https://github.com/Astha-codes16/BlogIt_mern_project.git
cd BlogIt_mern_project
```

### Backend Setup

```bash
cd server
npm install
```

Create:

```text
server/.env
```

Add:

```env
MONGODB_URI=
JWT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

GEMINI_API_KEY=
```

**Never commit `.env` to Git.**

### Start the Backend

```bash
npm run server
```

### Frontend Setup

Open another terminal:

```bash
cd Client
npm install
npm run dev
```

The frontend will then be available at the local Vite development URL shown in your terminal.

## Challenges & What I Learned

The most useful part of building BlogIt was dealing with problems that weren't obvious when I started.

For example, implementing autosave made me think about **when** requests should be sent rather than simply making an API call whenever something changes. I also had to deal with authentication state being restored asynchronously, which could cause the frontend to attempt a protected request before the token was available.

Another important lesson was separating **authentication from authorization**. Knowing that someone is logged in isn't enough — the backend also needs to determine whether that person is actually allowed to perform a particular action.

I also learned the importance of keeping secrets out of source code after dealing with environment variables, API keys, and deployment configuration.

## 💡 Key Design Decisions

### Autosave vs Version History

I deliberately kept these as two separate operations.

Autosave continuously updates the current draft, while version history only records a snapshot when the user explicitly chooses to save one.

This keeps the history meaningful instead of filling it with snapshots from every small edit.

### Backend as the Source of Truth

The frontend hides controls based on the user's role, but this is only for user experience.

The backend independently checks authentication, role, and blog ownership before allowing protected operations.

This prevents someone from bypassing the frontend and directly calling the API.

### Environment-Based Configuration

API keys, database credentials, and authentication secrets are loaded from environment variables instead of being hardcoded into the application.

This makes the application safer to share publicly and easier to configure across development and deployment environments.

## Future Improvements

Some improvements I would like to add next:

* Author-specific draft listing and editing
* Blog version restoration
* Password reset
* Email verification
* More advanced comment moderation
* Automated backend and frontend tests
* Scheduled publishing
* Blog analytics
* Improved search and recommendations

## 📸 Screenshots

Screenshots of the application can be added here as the project UI evolves.

## What I Built Beyond the Basic Blog

The project became more than a basic CRUD blogging application as I worked on it.

The features I focused on most were:

```text
Authentication ->Role-Based Access Control -> Blog Ownership -> Draft Autosave -> Version History -> AI-Assisted Writing -> Deployment & Production Configuration
```

These additions helped me understand how individual features connect to form a complete application.

##  Author

**Astha**

GitHub: [Astha-codes16](https://github.com/Astha-codes16)

---

