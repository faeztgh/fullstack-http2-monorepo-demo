# HTTP/2 Demo Project

A full-stack demonstration of HTTP/2 protocol with a Node.js/Express TypeScript backend and Next.js TypeScript frontend.

## Project Structure

```
http2-demo/
├── server/              # HTTP/2 API Server (TypeScript)
│   ├── src/            # TypeScript source files
│   │   ├── server.ts   # Main server file
│   │   ├── http2-server.ts # HTTP/2 server implementation
│   │   ├── types.ts    # TypeScript interfaces
│   │   └── generate-certs.ts # SSL certificate generator
│   ├── dist/           # Compiled JavaScript (generated)
│   ├── certs/          # SSL certificates (generated)
│   ├── package.json    # Server dependencies
│   └── README.md       # Server documentation
├── front/              # Next.js Frontend
│   ├── app/           # Next.js App Router
│   │   ├── api/       # API route handlers
│   │   ├── globals.css # Global styles
│   │   ├── layout.tsx # Root layout
│   │   └── page.tsx   # Main page component
│   ├── lib/           # Utility functions
│   ├── package.json   # Frontend dependencies
│   └── README.md      # Frontend documentation
├── package.json        # Root workspace configuration
├── pnpm-workspace.yaml # pnpm workspace configuration
└── README.md          # This file
```

## Features

### Backend (Server)
- HTTP/2 protocol support with SSL/TLS
- Express.js REST API written in TypeScript
- Type-safe development with interfaces
- CORS enabled for frontend
- Compression and security headers
- Pagination and filtering
- Dummy data for testing

### Frontend (Client)
- Next.js 14 with App Router
- TypeScript support
- Tailwind CSS styling
- HTTP/2 API integration
- Responsive design
- Real-time data fetching
- Error handling and loading states

## Quick Start

### 1. Setup Project (Recommended)

```bash
# Install all dependencies and build server
pnpm setup

# Start both server and frontend in development mode
pnpm dev
```

### 2. Manual Setup

#### Setup Server
```bash
cd server
pnpm install
pnpm run generate-certs
pnpm run build
pnpm start
```

The server will run on `https://localhost:3001`

#### Setup Frontend
```bash
cd front
pnpm install
pnpm run dev
```

The frontend will run on `http://localhost:3000`

### 3. Access the Application

- Frontend: http://localhost:3000
- API Server: https://localhost:3001

## Available Scripts

### Root Level (Workspace)
- `pnpm setup` - Install all dependencies and build server
- `pnpm dev` - Start both server and frontend in development mode
- `pnpm dev:server` - Start only the server in development mode
- `pnpm dev:front` - Start only the frontend in development mode
- `pnpm build` - Build both server and frontend
- `pnpm start:server` - Start the server in production mode
- `pnpm start:front` - Start the frontend in production mode

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Users
- `GET /api/users` - Get all users (with pagination)
- `GET /api/users/:id` - Get user by ID
- Query parameters: `page`, `limit`, `role`

### Products
- `GET /api/products` - Get all products (with pagination)
- `GET /api/products/:id` - Get product by ID
- Query parameters: `page`, `limit`, `category`, `minPrice`, `maxPrice`

### Posts
- `GET /api/posts` - Get all posts (with pagination)
- `GET /api/posts/:id` - Get post by ID
- Query parameters: `page`, `limit`, `author`

### Statistics
- `GET /api/stats` - Get overall statistics

## Development

### Workspace Development (Recommended)
```bash
# Start both server and frontend in development mode
pnpm dev

# Or start them individually
pnpm dev:server  # Auto-restart on changes
pnpm dev:front   # Hot reload enabled
```

### Individual Development

#### Server Development
```bash
cd server
pnpm run dev  # Auto-restart on changes
```

#### Frontend Development
```bash
cd front
pnpm run dev  # Hot reload enabled
```

## HTTP/2 Benefits

This project demonstrates several HTTP/2 advantages:

1. **Multiplexing** - Multiple requests over a single connection
2. **Server Push** - Proactive resource delivery
3. **Header Compression** - Reduced overhead
4. **Binary Protocol** - More efficient than HTTP/1.1
5. **Stream Prioritization** - Better resource management

## Security Notes

- The server uses self-signed certificates for development
- In production, use proper SSL certificates
- CORS is configured for localhost development
- Helmet.js provides security headers

## Troubleshooting

### Certificate Issues
If you encounter SSL certificate warnings:
1. Ensure certificates are generated: `pnpm run generate-certs` (in server directory)
2. Accept the self-signed certificate in your browser
3. For API testing, use `-k` flag with curl: `curl -k https://localhost:3001/api/health`

### Port Conflicts
- Server runs on port 3001 (HTTPS)
- Frontend runs on port 3000 (HTTP)
- Ensure ports are available

### CORS Issues
- Server is configured to allow requests from `http://localhost:3000`
- Frontend uses Next.js rewrites to proxy API calls

### Workspace Issues
- Ensure you're using pnpm: `npm install -g pnpm`
- Run `pnpm setup` to install all dependencies and build the server
- Use `pnpm dev` to start both services simultaneously

## Technologies Used

### Backend
- Node.js
- Express.js
- TypeScript
- HTTP/2 with SSL/TLS
- CORS
- Helmet.js
- Compression

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Lucide React
- Fetch API

## License

MIT License - feel free to use this project for learning and development purposes. 