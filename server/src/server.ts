import express, { Request, Response, NextFunction } from "express";
import * as http2 from "http2";
import * as fs from "fs";
import * as path from "path";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { User, Product, Post, Stats, QueryParams } from "./types";

const app = express();
const PORT = process.env["PORT"] || 3001;
const HTTP_PORT = process.env["HTTP_PORT"] || 3003;

// Middleware
app.use(helmet());
app.use(compression());
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
app.use(express.json());

// Dummy data
const dummyData = {
    users: [
        { id: 1, name: "John Doe", email: "john@example.com", role: "admin" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", role: "user" },
        { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "user" },
        {
            id: 4,
            name: "Alice Brown",
            email: "alice@example.com",
            role: "moderator",
        },
        {
            id: 5,
            name: "Charlie Wilson",
            email: "charlie@example.com",
            role: "user",
        },
    ] as User[],
    products: [
        {
            id: 1,
            name: "Laptop",
            price: 999.99,
            category: "Electronics",
            stock: 50,
        },
        {
            id: 2,
            name: "Smartphone",
            price: 699.99,
            category: "Electronics",
            stock: 100,
        },
        {
            id: 3,
            name: "Headphones",
            price: 199.99,
            category: "Audio",
            stock: 75,
        },
        {
            id: 4,
            name: "Coffee Maker",
            price: 89.99,
            category: "Kitchen",
            stock: 30,
        },
        {
            id: 5,
            name: "Running Shoes",
            price: 129.99,
            category: "Sports",
            stock: 60,
        },
    ] as Product[],
    posts: [
        {
            id: 1,
            title: "Getting Started with HTTP/2",
            content: "HTTP/2 is the latest version of the HTTP protocol...",
            author: "John Doe",
            date: "2024-01-15",
        },
        {
            id: 2,
            title: "Next.js Best Practices",
            content: "Next.js provides many features out of the box...",
            author: "Jane Smith",
            date: "2024-01-14",
        },
        {
            id: 3,
            title: "TypeScript Tips and Tricks",
            content: "TypeScript adds static typing to JavaScript...",
            author: "Bob Johnson",
            date: "2024-01-13",
        },
        {
            id: 4,
            title: "Express.js API Development",
            content:
                "Express.js is a minimal and flexible Node.js web application framework...",
            author: "Alice Brown",
            date: "2024-01-12",
        },
        {
            id: 5,
            title: "Modern Web Development",
            content: "Modern web development involves many technologies...",
            author: "Charlie Wilson",
            date: "2024-01-11",
        },
    ] as Post[],
};

// Routes
app.get("/", (req: Request, res: Response) => {
    res.json({
        message: "HTTP/2 API Server is running!",
        version: "1.0.0",
        protocol: req.httpVersion,
        endpoints: {
            users: "/api/users",
            products: "/api/products",
            posts: "/api/posts",
            health: "/api/health",
        },
    });
});

app.get("/api/health", (req: Request, res: Response) => {
    res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        protocol: req.protocol,
        httpVersion: req.httpVersion,
    });
});

// Users endpoints
app.get(
    "/api/users",
    (req: Request<{}, {}, {}, QueryParams>, res: Response) => {
        const { page = "1", limit = "10", role } = req.query;
        let filteredUsers = dummyData.users;

        if (role) {
            filteredUsers = filteredUsers.filter((user) => user.role === role);
        }

        const startIndex = (parseInt(page) - 1) * parseInt(limit);
        const endIndex = startIndex + parseInt(limit);
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

        res.json({
            users: paginatedUsers,
            total: filteredUsers.length,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(filteredUsers.length / parseInt(limit)),
        });
    }
);

app.get("/api/users/:id", (req: Request<{ id: string }>, res: Response) => {
    const user = dummyData.users.find((u) => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    return res.json(user);
});

// Products endpoints
app.get(
    "/api/products",
    (req: Request<{}, {}, {}, QueryParams>, res: Response) => {
        const {
            page = "1",
            limit = "10",
            category,
            minPrice,
            maxPrice,
        } = req.query;
        let filteredProducts = dummyData.products;

        if (category) {
            filteredProducts = filteredProducts.filter(
                (product) => product.category === category
            );
        }

        if (minPrice) {
            filteredProducts = filteredProducts.filter(
                (product) => product.price >= parseFloat(minPrice)
            );
        }

        if (maxPrice) {
            filteredProducts = filteredProducts.filter(
                (product) => product.price <= parseFloat(maxPrice)
            );
        }

        const startIndex = (parseInt(page) - 1) * parseInt(limit);
        const endIndex = startIndex + parseInt(limit);
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

        res.json({
            products: paginatedProducts,
            total: filteredProducts.length,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(filteredProducts.length / parseInt(limit)),
        });
    }
);

app.get("/api/products/:id", (req: Request<{ id: string }>, res: Response) => {
    const product = dummyData.products.find(
        (p) => p.id === parseInt(req.params.id)
    );
    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }
    return res.json(product);
});

// Posts endpoints
app.get(
    "/api/posts",
    (req: Request<{}, {}, {}, QueryParams>, res: Response) => {
        const { page = "1", limit = "10", author } = req.query;
        let filteredPosts = dummyData.posts;

        if (author) {
            filteredPosts = filteredPosts.filter((post) =>
                post.author.toLowerCase().includes(author.toLowerCase())
            );
        }

        const startIndex = (parseInt(page) - 1) * parseInt(limit);
        const endIndex = startIndex + parseInt(limit);
        const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

        res.json({
            posts: paginatedPosts,
            total: filteredPosts.length,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(filteredPosts.length / parseInt(limit)),
        });
    }
);

app.get("/api/posts/:id", (req: Request<{ id: string }>, res: Response) => {
    const post = dummyData.posts.find((p) => p.id === parseInt(req.params.id));
    if (!post) {
        return res.status(404).json({ error: "Post not found" });
    }
    return res.json(post);
});

// Statistics endpoint
app.get("/api/stats", (_req: Request, res: Response) => {
    const stats: Stats = {
        totalUsers: dummyData.users.length,
        totalProducts: dummyData.products.length,
        totalPosts: dummyData.posts.length,
        averageProductPrice: (
            dummyData.products.reduce((sum, p) => sum + p.price, 0) /
            dummyData.products.length
        ).toFixed(2),
        totalStock: dummyData.products.reduce((sum, p) => sum + p.stock, 0),
    };
    return res.json(stats);
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    return res.status(500).json({ error: "Something went wrong!" });
});

app.use((_req: Request, res: Response) => {
    return res.status(404).json({ error: "Route not found" });
});

// Create HTTPS server with SSL (HTTP/2 compatible)
const options = {
    key: fs.readFileSync(path.join(__dirname, "..", "certs", "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "..", "certs", "cert.pem")),
    allowHTTP1: true, // Allow HTTP/1.1 fallback for compatibility
};

// Create HTTP/2 server with SSL
const server = http2.createSecureServer(options, app as any);

// HTTP/2 specific event handlers
server.on("stream", (_stream, headers) => {
    console.log("HTTP/2 Stream:", headers[":path"]);
});

server.on("session", (session) => {
    console.log("HTTP/2 Session established");

    session.on("connect", () => {
        console.log("HTTP/2 Session connected");
    });

    session.on("close", () => {
        console.log("HTTP/2 Session closed");
    });
});

// Also create HTTP server for development
const http = require("http");
const httpServer = http.createServer(app);

server.listen(PORT, () => {
    console.log(`🚀 HTTP/2 Server running on https://localhost:${PORT}`);
    console.log(`📊 Available endpoints:`);
    console.log(`   - GET  /api/users`);
    console.log(`   - GET  /api/products`);
    console.log(`   - GET  /api/posts`);
    console.log(`   - GET  /api/stats`);
    console.log(`   - GET  /api/health`);
    console.log(`🔒 Protocol: HTTP/2 with SSL/TLS`);
});

httpServer.listen(HTTP_PORT, () => {
    console.log(`🌐 HTTP Server running on http://localhost:${HTTP_PORT}`);
    console.log(`📊 Same endpoints available on HTTP`);
});
