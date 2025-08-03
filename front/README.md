# HTTP/2 Frontend

A Next.js TypeScript frontend application that consumes data from an HTTP/2 API server.

## Features

- Next.js 14 with App Router
- TypeScript support
- Tailwind CSS for styling
- HTTP/2 API integration
- Responsive design
- Real-time data fetching
- Error handling and loading states

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server
- `pnpm run lint` - Run ESLint

## API Integration

The frontend communicates with the HTTP/2 server through Next.js API rewrites:

- `/api/users` - Fetch user data
- `/api/products` - Fetch product data
- `/api/posts` - Fetch post data
- `/api/stats` - Fetch statistics

## Project Structure

```
front/
├── app/                 # Next.js App Router
│   ├── api/            # API route handlers
│   │   ├── users/      # User API routes
│   │   ├── products/   # Product API routes
│   │   ├── posts/      # Post API routes
│   │   ├── stats/      # Stats API routes
│   │   └── [...path]/  # Catch-all API routes
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Main page component
├── lib/                # Utility functions
│   └── utils.ts        # Class name utilities
├── package.json        # Dependencies and scripts
├── next.config.js      # Next.js configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Lucide React** - Icon library
- **clsx & tailwind-merge** - Class name utilities

## Browser Support

The application requires a modern browser that supports:
- HTTP/2 protocol
- ES6+ features
- CSS Grid and Flexbox 