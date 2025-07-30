# Register Funds Backend API

Backend API for the Register Funds application, built with Express.js, TypeScript, and Firebase.

## Features

- User authentication with Firebase Auth
- School profile management
- Campaign creation and management
- School updates and announcements
- File uploads to Firebase Storage

## Tech Stack

- Node.js & Express.js
- TypeScript
- Firebase Admin SDK (Auth, Firestore, Storage)
- JWT for API authentication

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase project with Firestore and Storage enabled

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and fill in your Firebase credentials
4. Start the development server:
   ```bash
   npm run dev
   ```

### Build for Production

```bash
npm run build
```

### Run in Production

```bash
npm start
```

## API Documentation

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/reset-password` - Request password reset
- `GET /api/auth/verify` - Verify authentication token

### Schools

- `POST /api/schools` - Create school profile
- `GET /api/schools/:id?` - Get school profile
- `PUT /api/schools/:id?` - Update school profile

### Campaigns

- `POST /api/campaigns` - Create a new campaign
- `GET /api/campaigns` - Get all campaigns
- `GET /api/campaigns/:id` - Get campaign by ID
- `GET /api/campaigns/school/:schoolId?` - Get campaigns by school ID
- `PUT /api/campaigns/:id` - Update campaign

### Updates

- `POST /api/updates` - Create a new update
- `GET /api/updates` - Get all updates
- `GET /api/updates/:id` - Get update by ID
- `PUT /api/updates/:id` - Update an update
- `DELETE /api/updates/:id` - Delete an update

## License

ISC





## Package Details

Here's what each package does:

- **`jest`** - Main testing framework
- **`@types/jest`** - TypeScript definitions for Jest
- **`supertest`** - HTTP assertion library for testing Express apps
- **`@types/supertest`** - TypeScript definitions for Supertest
- **`ts-jest`** - TypeScript preprocessor for Jest

## Verify Installation

After installation, your <mcfile name="package.json" path="c:\Users\HP\Desktop\Algo-Peers\Register1\Backend\package.json"></mcfile> should include these in `devDependencies`:
```json