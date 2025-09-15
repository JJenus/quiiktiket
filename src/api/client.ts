import axios, {
	AxiosInstance,
	AxiosResponse,
	InternalAxiosRequestConfig,
} from "axios";
import { APIResponse, AuthTokens } from "../types";

class APIClient {
	private instance: AxiosInstance;
	private tokens: AuthTokens | null = null;
	private refreshPromise: Promise<AuthTokens> | null = null;

	constructor() {
		this.instance = axios.create({
			baseURL: import.meta.env.VITE_API_BASE_URL || "/api", // Use relative path
			timeout: 10000,
			headers: {
				"Content-Type": "application/json",
			},
		});

		this.setupInterceptors();
	}

	private setupInterceptors() {
		// Request interceptor
		this.instance.interceptors.request.use(
			(config: InternalAxiosRequestConfig) => {
				// Add auth token
				if (this.tokens?.accessToken) {
					config.headers.Authorization = `Bearer ${this.tokens.accessToken}`;
				}

				// Add tenant header
				const tenantId = localStorage.getItem("currentTenantId");
				if (tenantId) {
					config.headers["X-Tenant-ID"] = tenantId;
				}

				// Add idempotency key for critical operations
				if (
					["post", "put", "patch"].includes(
						config.method?.toLowerCase() || ""
					)
				) {
					if (
						config.url?.includes("/orders") ||
						config.url?.includes("/payments")
					) {
						config.headers["Idempotency-Key"] = crypto.randomUUID();
					}
				}

				return config;
			},
			(error) => Promise.reject(error)
		);

		// Response interceptor
		this.instance.interceptors.response.use(
			(response: AxiosResponse) => response,
			async (error) => {
				const originalRequest = error.config;

				if (
					error.response?.status === 401 &&
					!originalRequest._retry &&
					this.tokens?.refreshToken
				) {
					originalRequest._retry = true;

					try {
						// Use existing refresh promise or create new one
						if (!this.refreshPromise) {
							this.refreshPromise = this.refreshToken();
						}

						const newTokens = await this.refreshPromise;
						this.refreshPromise = null;

						// Update auth header and retry original request
						originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
						return this.instance(originalRequest);
					} catch (refreshError) {
						// Refresh failed, redirect to login
						this.tokens = null;
						localStorage.removeItem("auth_tokens");
						window.location.href = "/login";
						return Promise.reject(refreshError);
					}
				}

				// Format error for consistent handling
				const formattedError = {
					message: error.response?.data?.message || error.message,
					status: error.response?.status,
					data: error.response?.data,
				};

				return Promise.reject(formattedError);
			}
		);
	}

	setTokens(tokens: AuthTokens | null) {
		this.tokens = tokens;
		if (tokens) {
			localStorage.setItem("auth_tokens", JSON.stringify(tokens));
		} else {
			localStorage.removeItem("auth_tokens");
		}
	}

	private async refreshToken(): Promise<AuthTokens> {
		const response = await this.instance.post<APIResponse<AuthTokens>>(
			"/auth/refresh",
			{
				refreshToken: this.tokens?.refreshToken,
			}
		);

		const newTokens = response.data.data;
		this.setTokens(newTokens);
		return newTokens;
	}

	async get<T>(url: string, params?: any): Promise<APIResponse<T>> {
		const response = await this.instance.get<APIResponse<T>>(url, {
			params,
		});
		return response.data;
	}

	async post<T>(url: string, data?: any): Promise<APIResponse<T>> {
		const response = await this.instance.post<APIResponse<T>>(url, data);
		return response.data;
	}

	async put<T>(url: string, data?: any): Promise<APIResponse<T>> {
		const response = await this.instance.put<APIResponse<T>>(url, data);
		return response.data;
	}

	async patch<T>(url: string, data?: any): Promise<APIResponse<T>> {
		const response = await this.instance.patch<APIResponse<T>>(url, data);
		return response.data;
	}

	async delete<T>(url: string): Promise<APIResponse<T>> {
		const response = await this.instance.delete<APIResponse<T>>(url);
		return response.data;
	}

	// File upload with progress
	async upload<T>(
		url: string,
		file: File,
		onProgress?: (progress: number) => void
	): Promise<APIResponse<T>> {
		const formData = new FormData();
		formData.append("file", file);

		const response = await this.instance.post<APIResponse<T>>(
			url,
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
				onUploadProgress: (progressEvent) => {
					if (onProgress && progressEvent.total) {
						const progress = Math.round(
							(progressEvent.loaded * 100) / progressEvent.total
						);
						onProgress(progress);
					}
				},
			}
		);

		return response.data;
	}
}

export const apiClient = new APIClient();
