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
    const data = await response.json();

    if(!response.ok) {
        throw new HttpError(response, data);
    }

    return data;
}

const baseURL = process.env.BACKEND_URL || 'http://127.0.0.1:8000/api/v1/';
const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};

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
            ? `${baseURL}${resource}?${queryString}`
            : `${baseURL}${resource}`;

        return fetch(url, {
            method: 'GET',
            headers,
        })
        .then(handleResponse<PaginatedResponse<T>>);
    },
    getOne: <T>(resource: string, id: string | number): Promise<T> => {
        return fetch(`${baseURL}${resource}/${id}`, {
            method: 'GET',
            headers,
        })
        .then(handleResponse<T>);
    },
    create: <T>(resource: string, data: T): Promise<any> => {
        return fetch(`${baseURL}${resource}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        }).then(handleResponse<any>);
    },
    update: <T>(resource: string, id: string | number, data: T): Promise<any> => {
        return fetch(`${baseURL}${resource}/${id}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data),
        }).then(handleResponse<any>);
    },
    delete: (resource: string, id: string | number): Promise<any> => {
        return fetch(`${baseURL}${resource}/${id}`, {
            method: 'DELETE',
            headers,
        }).then(handleResponse<any>);
    },
};