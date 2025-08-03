# HTTP/2 API Server (TypeScript)

A Node.js/Express server with HTTP/2 support written in TypeScript, providing dummy data for testing.

## Features

- HTTP/2 protocol support with SSL/TLS
- RESTful API endpoints
- CORS enabled for frontend integration
- Compression and security headers
- Pagination support
- Filtering capabilities
- TypeScript with type safety

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Generate SSL certificates (required for HTTP/2):
```bash
pnpm run generate-certs
```

3. Build the TypeScript code:
```bash
pnpm run build
```

4. Start the server:
```bash
pnpm start
```

For development with auto-restart:
```bash
pnpm run dev
```

## Project Structure

```
server/
├── src/
│   ├── server.ts        # Main Express server setup
│   ├── http2-server.ts  # HTTP/2 server implementation
│   ├── types.ts         # TypeScript interfaces
│   └── generate-certs.ts # SSL certificate generator
├── dist/                # Compiled JavaScript (generated)
├── certs/               # SSL certificates (generated)
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

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

## Example Usage

```bash
# Get all users
curl -k https://localhost:3001/api/users

# Get products with filtering
curl -k https://localhost:3001/api/products?category=Electronics&minPrice=500

# Get posts by author
curl -k https://localhost:3001/api/posts?author=John
```

## Server Information

- **Protocol**: HTTP/2 with SSL/TLS
- **Port**: 3001
- **URL**: https://localhost:3001
- **CORS**: Enabled for http://localhost:3000
- **Language**: TypeScript
- **Build**: Compiled to JavaScript in `dist/` folder

## Dummy Data

The server includes sample data for:
- 5 users with different roles
- 5 products with various categories and prices
- 5 blog posts with different authors 