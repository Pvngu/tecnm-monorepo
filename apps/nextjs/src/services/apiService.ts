import { PaginatedResponse } from '../types/api';
import { objectToQueryString } from '@/lib/queryUtils';

class HttpError extends Error {
    response: Response;
    data: any;

    constructor(response: Response, data: any) {
        super(`HTTP Error: ${response.status}`);
        this.name = "HttpError";
        this.response = response;
        this.data = data;
    }
}

async function handleResponse<T>(response: Response): Promise<T> {
    // Si la respuesta es 204 No Content, devolver objeto vacío
    if (response.status === 204) {
        return {} as T;
    }
    
    const data = await response.json();

    if(!response.ok) {
        throw new HttpError(response, data);
    }

    return data;
}

// Helper to get CSRF token from cookie
function getCsrfTokenFromCookie(): string | null {
    if (typeof document === 'undefined') return null;
    
    const name = 'XSRF-TOKEN=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');
    
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(name) === 0) {
            return decodeURIComponent(cookie.substring(name.length));
        }
    }
    return null;
}

// Helper to get headers with CSRF token
function getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    };
    
    const csrfToken = getCsrfTokenFromCookie();
    if (csrfToken) {
        headers['X-XSRF-TOKEN'] = csrfToken;
    }
    
    return headers;
}

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
const apiBaseURL = `${baseURL}/api/v1/`;

export const apiService = {
    getList: <T>(
        resource: string,
        queryParams: Record<string, any> = {},
    ): Promise<PaginatedResponse<T>> => {
        const { per_page, ...restParams } = queryParams;
        const apiParams = {
            ...restParams,
            per_page: per_page || 10,
        }

        const queryString = objectToQueryString(apiParams);
        const url = queryString
            ? `${apiBaseURL}${resource}?${queryString}`
            : `${apiBaseURL}${resource}`;

        return fetch(url, {
            method: 'GET',
            headers: getHeaders(),
            credentials: 'include',
        })
        .then(handleResponse<PaginatedResponse<T>>);
    },
    getOne: <T>(resource: string, id: string | number): Promise<T> => {
        return fetch(`${apiBaseURL}${resource}/${id}`, {
            method: 'GET',
            headers: getHeaders(),
            credentials: 'include',
        })
        .then(handleResponse<T>);
    },
    create: <T>(resource: string, data: T): Promise<any> => {
        return fetch(`${apiBaseURL}${resource}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
            credentials: 'include',
        }).then(handleResponse<any>);
    },
    update: <T>(resource: string, id: string | number, data: T): Promise<any> => {
        return fetch(`${apiBaseURL}${resource}/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
            credentials: 'include',
        }).then(handleResponse<any>);
    },
    delete: (resource: string, id: string | number): Promise<any> => {
        return fetch(`${apiBaseURL}${resource}/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
            credentials: 'include',
        }).then(handleResponse<any>);
    },
};