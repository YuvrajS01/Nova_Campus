# Nova Campus 🎓

A modern, full-stack college companion application built with React and Express.

## 🏗️ Project Structure

```
nova-campus/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── ui/         # UI primitives (Button, Card, Input, etc.)
│   │   │   └── layout/     # Layout components (Header, BottomNav)
│   │   ├── pages/          # Page components organized by feature
│   │   │   ├── auth/       # Login, Register
│   │   │   ├── dashboard/
│   │   │   ├── admin/
│   │   │   └── ...
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service layer
│   │   ├── lib/            # Utilities and constants
│   │   └── types/          # TypeScript type definitions
│   └── ...
│
├── server/                 # Express.js backend
│   ├── prisma/             # Database schema
│   └── src/
│       ├── controllers/    # Request handlers
│       ├── middleware/     # Express middleware
│       ├── routes/         # API routes
│       └── lib/            # Utilities
│
└── package.json            # Workspace root
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Install all dependencies (root + all workspaces)
npm install

# Generate Prisma client
cd server && npx prisma generate && npx prisma db push
```

### Development

```bash
# Run both client and server concurrently
npm run dev

# Or run them separately:
npm run dev:client   # Frontend on http://localhost:3000
npm run dev:server   # Backend on http://localhost:5000
```

### Build

```bash
# Build the client
npm run build
```

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

### Backend
- **Express.js** - Web framework
- **Prisma** - Database ORM
- **SQLite** - Database
- **JWT** - Authentication

## 📱 Features

- 📊 **Dashboard** - Quick overview of classes, events, and announcements
- 📅 **Timetable** - Weekly class schedule
- 📢 **Announcements** - Important notices and updates
- 🎉 **Events** - Campus events and registration
- 📚 **Resources** - Study materials and documents
- 👤 **Profile** - User profile management
- 🔧 **Admin Panel** - Admin/Staff management tools

## 🔒 College Structure

Fixed constraints:
- **Branches**: CSE, EEE, ME, CE
- **Years**: 1, 2, 3, 4
- **Sections**: A, B

## 📄 License

ISC
