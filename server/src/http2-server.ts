import * as http2 from "http2";
import * as fs from "fs";
import * as path from "path";
import { User, Product, Post, Stats } from "./types";

const PORT = process.env["PORT"] || 3001;

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

// Helper function to send JSON response
function sendJsonResponse(
    stream: http2.ServerHttp2Stream,
    statusCode: number,
    data: any
) {
    const response = JSON.stringify(data);
    stream.respond({
        ":status": statusCode,
        "content-type": "application/json",
        "content-length": Buffer.byteLength(response),
        "cache-control": "no-cache, no-store, must-revalidate",
        pragma: "no-cache",
        expires: "0",
        "x-protocol-version": "HTTP/2",
        "x-server-protocol": "h2",
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
        "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
        "access-control-allow-headers":
            "Content-Type, Authorization, Accept, Origin",
    });
    stream.end(response);
}

// Helper function to parse query parameters
function parseQueryParams(url: string): Record<string, string> {
    const queryString = url.split("?")[1];
    if (!queryString) return {};

    return queryString.split("&").reduce((params, param) => {
        const parts = param.split("=");
        if (parts.length >= 2) {
            const key = parts[0];
            const value = parts[1];
            if (key && value) {
                params[decodeURIComponent(key)] = decodeURIComponent(value);
            }
        }
        return params;
    }, {} as Record<string, string>);
}

// Helper function to parse URL parameters
function parseUrlParams(path: string, pattern: string): Record<string, string> {
    const pathParts = path.split("/");
    const patternParts = pattern.split("/");
    const params: Record<string, string> = {};

    for (let i = 0; i < patternParts.length; i++) {
        const patternPart = patternParts[i];
        if (patternPart && patternPart.startsWith(":")) {
            const paramName = patternPart.slice(1);
            params[paramName] = pathParts[i] || "";
        }
    }

    return params;
}

// Route handler
function handleRequest(
    stream: http2.ServerHttp2Stream,
    headers: http2.IncomingHttpHeaders
) {
    const method = headers[":method"];
    const path = headers[":path"];

    // Early return if method or path is undefined
    if (!method || !path) {
        sendJsonResponse(stream, 400, { error: "Invalid request" });
        return;
    }

    console.log(`${method} ${path}`);
    console.log("Headers:", JSON.stringify(headers, null, 2));

    // Handle CORS preflight
    if (method === "OPTIONS") {
        stream.respond({
            ":status": 200,
            "cache-control": "no-cache, no-store, must-revalidate",
            pragma: "no-cache",
            expires: "0",
            "x-protocol-version": "HTTP/2",
            "x-server-protocol": "h2",
            "access-control-allow-origin": "*",
            "access-control-allow-credentials": "true",
            "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
            "access-control-allow-headers":
                "Content-Type, Authorization, Accept, Origin",
        });
        stream.end();
        return;
    }

    // Root endpoint
    if (path === "/" && method === "GET") {
        sendJsonResponse(stream, 200, {
            message: "HTTP/2 API Server is running!",
            version: "1.0.0",
            protocol: "HTTP/2",
            endpoints: {
                users: "/api/users",
                products: "/api/products",
                posts: "/api/posts",
                health: "/api/health",
            },
        });
        return;
    }

    // Health endpoint
    if (path === "/api/health" && method === "GET") {
        sendJsonResponse(stream, 200, {
            status: "healthy",
            timestamp: new Date().toISOString(),
            protocol: "HTTP/2",
            httpVersion: "2.0",
        });
        return;
    }

    // Users endpoints
    if (path.startsWith("/api/users")) {
        if (method === "GET") {
            const urlParams = parseUrlParams(path, "/api/users/:id");

            if (urlParams["id"]) {
                // Get specific user
                const userId = parseInt(urlParams["id"]);
                if (isNaN(userId)) {
                    sendJsonResponse(stream, 400, { error: "Invalid user ID" });
                    return;
                }
                const user = dummyData.users.find((u) => u.id === userId);
                if (!user) {
                    sendJsonResponse(stream, 404, { error: "User not found" });
                    return;
                }
                sendJsonResponse(stream, 200, user);
                return;
            } else {
                // Get all users with pagination and filtering
                const queryParams = parseQueryParams(path);
                const { page = "1", limit = "10", role } = queryParams;
                let filteredUsers = dummyData.users;

                if (role) {
                    filteredUsers = filteredUsers.filter(
                        (user) => user.role === role
                    );
                }

                const startIndex = (parseInt(page) - 1) * parseInt(limit);
                const endIndex = startIndex + parseInt(limit);
                const paginatedUsers = filteredUsers.slice(
                    startIndex,
                    endIndex
                );

                sendJsonResponse(stream, 200, {
                    users: paginatedUsers,
                    total: filteredUsers.length,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(
                        filteredUsers.length / parseInt(limit)
                    ),
                });
                return;
            }
        }
    }

    // Products endpoints
    if (path.startsWith("/api/products")) {
        if (method === "GET") {
            const urlParams = parseUrlParams(path, "/api/products/:id");

            if (urlParams["id"]) {
                // Get specific product
                const productId = parseInt(urlParams["id"]);
                if (isNaN(productId)) {
                    sendJsonResponse(stream, 400, {
                        error: "Invalid product ID",
                    });
                    return;
                }
                const product = dummyData.products.find(
                    (p) => p.id === productId
                );
                if (!product) {
                    sendJsonResponse(stream, 404, {
                        error: "Product not found",
                    });
                    return;
                }
                sendJsonResponse(stream, 200, product);
                return;
            } else {
                // Get all products with pagination and filtering
                const queryParams = parseQueryParams(path);
                const {
                    page = "1",
                    limit = "10",
                    category,
                    minPrice,
                    maxPrice,
                } = queryParams;
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
                const paginatedProducts = filteredProducts.slice(
                    startIndex,
                    endIndex
                );

                sendJsonResponse(stream, 200, {
                    products: paginatedProducts,
                    total: filteredProducts.length,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(
                        filteredProducts.length / parseInt(limit)
                    ),
                });
                return;
            }
        }
    }

    // Posts endpoints
    if (path.startsWith("/api/posts")) {
        if (method === "GET") {
            const urlParams = parseUrlParams(path, "/api/posts/:id");

            if (urlParams["id"]) {
                // Get specific post
                const postId = parseInt(urlParams["id"]);
                if (isNaN(postId)) {
                    sendJsonResponse(stream, 400, { error: "Invalid post ID" });
                    return;
                }
                const post = dummyData.posts.find((p) => p.id === postId);
                if (!post) {
                    sendJsonResponse(stream, 404, { error: "Post not found" });
                    return;
                }
                sendJsonResponse(stream, 200, post);
                return;
            } else {
                // Get all posts with pagination and filtering
                const queryParams = parseQueryParams(path);
                const { page = "1", limit = "10", author } = queryParams;
                let filteredPosts = dummyData.posts;

                if (author) {
                    filteredPosts = filteredPosts.filter((post) =>
                        post.author.toLowerCase().includes(author.toLowerCase())
                    );
                }

                const startIndex = (parseInt(page) - 1) * parseInt(limit);
                const endIndex = startIndex + parseInt(limit);
                const paginatedPosts = filteredPosts.slice(
                    startIndex,
                    endIndex
                );

                sendJsonResponse(stream, 200, {
                    posts: paginatedPosts,
                    total: filteredPosts.length,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(
                        filteredPosts.length / parseInt(limit)
                    ),
                });
                return;
            }
        }
    }

    // Statistics endpoint
    if (path === "/api/stats" && method === "GET") {
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
        sendJsonResponse(stream, 200, stats);
        return;
    }

    // 404 for unmatched routes
    sendJsonResponse(stream, 404, { error: "Route not found" });
}

// Create HTTP/2 server with SSL
const options = {
    key: fs.readFileSync(path.join(__dirname, "..", "certs", "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "..", "certs", "cert.pem")),
    allowHTTP1: false, // Force HTTP/2 only
    maxSessionMemory: 64000,
    maxDeflateDynamicTableSize: 4096,
    maxReservedRemoteStreams: 200,
    maxSendHeaderBlockLength: 262144,
    paddingStrategy: 0,
    peerMaxConcurrentStreams: 100,
    maxConcurrentStreams: 100,
};

// Create HTTP/2 server
const server = http2.createSecureServer(options);

// HTTP/2 stream handler
server.on("stream", (stream, headers) => {
    try {
        handleRequest(stream, headers);
    } catch (error) {
        console.error("Error handling request:", error);
        console.error("Request path:", headers[":path"]);
        console.error("Request method:", headers[":method"]);
        sendJsonResponse(stream, 500, {
            error: "Internal server error",
            details: error instanceof Error ? error.message : String(error),
            path: headers[":path"],
            method: headers[":method"],
        });
    }
});

// HTTP/2 session handlers
server.on("session", (session) => {
    console.log("HTTP/2 Session established");

    session.on("connect", () => {
        console.log("HTTP/2 Session connected");
    });

    session.on("close", () => {
        console.log("HTTP/2 Session closed");
    });

    session.on("error", (err) => {
        console.error("HTTP/2 Session error:", err);
    });
});

server.on("error", (err) => {
    console.error("HTTP/2 Server error:", err);
});

server.listen(PORT, () => {
    console.log(`🚀 HTTP/2 Server running on https://localhost:${PORT}`);
    console.log(`📊 Available endpoints:`);
    console.log(`   - GET  /api/users`);
    console.log(`   - GET  /api/products`);
    console.log(`   - GET  /api/posts`);
    console.log(`   - GET  /api/stats`);
    console.log(`   - GET  /api/health`);
    console.log(`🔒 Protocol: HTTP/2 only (h2)`);
    console.log(`⚠️  Note: This server only accepts HTTP/2 connections`);
});

