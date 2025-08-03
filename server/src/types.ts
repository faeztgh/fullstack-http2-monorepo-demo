export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    stock: number;
}

export interface Post {
    id: number;
    title: string;
    content: string;
    author: string;
    date: string;
}

export interface Stats {
    totalUsers: number;
    totalProducts: number;
    totalPosts: number;
    averageProductPrice: string;
    totalStock: number;
}

export interface PaginatedResponse<T> {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    [key: string]: T[] | number;
}

export interface QueryParams {
    page?: string;
    limit?: string;
    role?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    author?: string;
}
