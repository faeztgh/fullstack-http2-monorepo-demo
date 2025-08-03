"use client";

import { useState, useEffect } from "react";
import { Users, Package, FileText, BarChart3, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    stock: number;
}

interface Post {
    id: number;
    title: string;
    content: string;
    author: string;
    date: string;
}

interface Stats {
    totalUsers: number;
    totalProducts: number;
    totalPosts: number;
    averageProductPrice: string;
    totalStock: number;
}

export default function Home() {
    const [activeTab, setActiveTab] = useState<
        "users" | "products" | "posts" | "stats"
    >("users");
    const [users, setUsers] = useState<User[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async (endpoint: string) => {
        try {
            setLoading(true);
            setError(null);

            // Using axios to make HTTP requests to the HTTP/2 server
            const response = await axios.get(
                `https://localhost:3001/api/${endpoint}`,
                {
                    timeout: 10000,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response.data;
        } catch (err) {
            console.error("Error fetching data:", err);
            setError(err instanceof Error ? err.message : "An error occurred");
            return null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            const data = await fetchData(activeTab);
            if (data) {
                switch (activeTab) {
                    case "users":
                        setUsers((data as { users: User[] }).users || []);
                        break;
                    case "products":
                        setProducts(
                            (data as { products: Product[] }).products || []
                        );
                        break;
                    case "posts":
                        setPosts((data as { posts: Post[] }).posts || []);
                        break;
                    case "stats":
                        setStats(data as Stats);
                        break;
                }
            }
        };

        loadData();
    }, [activeTab]);

    const tabs = [
        { id: "users", label: "Users", icon: Users },
        { id: "products", label: "Products", icon: Package },
        { id: "posts", label: "Posts", icon: FileText },
        { id: "stats", label: "Statistics", icon: BarChart3 },
    ] as const;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container px-4 py-8 mx-auto">
                <div className="mb-8">
                    <h1 className="mb-2 text-4xl font-bold text-gray-900">
                        HTTP/2 Demo Frontend
                    </h1>
                    <p className="text-gray-600">
                        Next.js TypeScript app consuming HTTP/2 API data
                    </p>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2 mb-6">
                    <Activity
                        className={cn(
                            "w-4 h-4",
                            loading
                                ? "text-yellow-500 animate-pulse"
                                : error
                                ? "text-red-500"
                                : "text-green-500"
                        )}
                    />
                    <span className="text-sm text-gray-600">
                        {loading
                            ? "Loading..."
                            : error
                            ? `Error: ${error}`
                            : "Connected to HTTP/2 Server"}
                    </span>
                </div>

                {/* Tab Navigation */}
                <div className="flex p-1 mb-6 space-x-1 bg-white rounded-lg shadow-sm">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                                    activeTab === tab.id
                                        ? "bg-blue-500 text-white"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="p-6 bg-white rounded-lg shadow-sm">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-8 h-8 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                        </div>
                    ) : error ? (
                        <div className="py-12 text-center">
                            <p className="mb-4 text-red-600">{error}</p>
                            <button
                                onClick={() => fetchData(activeTab)}
                                className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <div>
                            {activeTab === "users" && (
                                <div className="space-y-4">
                                    <h2 className="mb-4 text-2xl font-semibold">
                                        Users
                                    </h2>
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {users.map((user) => (
                                            <div
                                                key={user.id}
                                                className="p-4 transition-shadow border rounded-lg hover:shadow-md"
                                            >
                                                <h3 className="text-lg font-semibold">
                                                    {user.name}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {user.email}
                                                </p>
                                                <span className="inline-block px-2 py-1 mt-2 text-xs text-blue-800 bg-blue-100 rounded-full">
                                                    {user.role}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === "products" && (
                                <div className="space-y-4">
                                    <h2 className="mb-4 text-2xl font-semibold">
                                        Products
                                    </h2>
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {products.map((product) => (
                                            <div
                                                key={product.id}
                                                className="p-4 transition-shadow border rounded-lg hover:shadow-md"
                                            >
                                                <h3 className="text-lg font-semibold">
                                                    {product.name}
                                                </h3>
                                                <p className="font-semibold text-green-600">
                                                    ${product.price}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {product.category}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Stock: {product.stock}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === "posts" && (
                                <div className="space-y-4">
                                    <h2 className="mb-4 text-2xl font-semibold">
                                        Posts
                                    </h2>
                                    <div className="space-y-4">
                                        {posts.map((post) => (
                                            <div
                                                key={post.id}
                                                className="p-4 transition-shadow border rounded-lg hover:shadow-md"
                                            >
                                                <h3 className="mb-2 text-lg font-semibold">
                                                    {post.title}
                                                </h3>
                                                <p className="mb-3 text-gray-600">
                                                    {post.content}
                                                </p>
                                                <div className="flex justify-between text-sm text-gray-500">
                                                    <span>
                                                        By {post.author}
                                                    </span>
                                                    <span>{post.date}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === "stats" && stats && (
                                <div className="space-y-4">
                                    <h2 className="mb-4 text-2xl font-semibold">
                                        Statistics
                                    </h2>
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                        <div className="p-4 rounded-lg bg-blue-50">
                                            <h3 className="text-sm font-medium text-blue-600">
                                                Total Users
                                            </h3>
                                            <p className="text-2xl font-bold text-blue-900">
                                                {stats.totalUsers}
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-lg bg-green-50">
                                            <h3 className="text-sm font-medium text-green-600">
                                                Total Products
                                            </h3>
                                            <p className="text-2xl font-bold text-green-900">
                                                {stats.totalProducts}
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-lg bg-purple-50">
                                            <h3 className="text-sm font-medium text-purple-600">
                                                Total Posts
                                            </h3>
                                            <p className="text-2xl font-bold text-purple-900">
                                                {stats.totalPosts}
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-lg bg-orange-50">
                                            <h3 className="text-sm font-medium text-orange-600">
                                                Avg Product Price
                                            </h3>
                                            <p className="text-2xl font-bold text-orange-900">
                                                ${stats.averageProductPrice}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

