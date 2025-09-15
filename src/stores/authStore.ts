import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { User, AuthTokens, APIResponse, LoadingState } from "../types";
import { apiClient } from "../api/client";

interface AuthState {
	currentUser: User | null;
	tokens: AuthTokens | null;
	isAuthenticated: boolean;
	loading: LoadingState;
	error: string | null;
}

interface AuthActions {
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
	register: (userData: {
		name: string;
		email: string;
		password: string;
		role: "organizer" | "customer";
	}) => Promise<void>;
	refreshToken: () => Promise<void>;
	loadFromStorage: () => void;
	clearError: () => void;
	updateProfile: (updates: Partial<User>) => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
	subscribeWithSelector(
		persist(
			(set, get) => ({
				// State
				currentUser: null,
				tokens: null,
				isAuthenticated: false,
				loading: "idle",
				error: null,

				// Actions
				login: async (email: string, password: string) => {
					try {
						set({ loading: "loading", error: null });

						const response = await apiClient.post<{
							user: User;
							tokens: AuthTokens;
						}>("/auth/login", { email, password });

						const { user, tokens } = response.data;

						apiClient.setTokens(tokens);

						set({
							currentUser: user,
							tokens,
							isAuthenticated: true,
							loading: "success",
							error: null,
						});
					} catch (error: any) {
						set({
							loading: "error",
							error: error.message || "Login failed",
						});
						throw error;
					}
				},

				register: async (userData) => {
					try {
						set({ loading: "loading", error: null });

						const response = await apiClient.post<{
							user: User;
							tokens: AuthTokens;
						}>("/auth/register", userData);

						const { user, tokens } = response.data;

						apiClient.setTokens(tokens);

						set({
							currentUser: user,
							tokens,
							isAuthenticated: true,
							loading: "success",
							error: null,
						});
					} catch (error: any) {
						set({
							loading: "error",
							error: error.message || "Registration failed",
						});
						throw error;
					}
				},

				logout: () => {
					apiClient.setTokens(null);
					set({
						currentUser: null,
						tokens: null,
						isAuthenticated: false,
						loading: "idle",
						error: null,
					});
				},

				refreshToken: async () => {
					try {
						const { tokens } = get();
						if (!tokens?.refreshToken) {
							throw new Error("No refresh token available");
						}

						const response = await apiClient.post<AuthTokens>(
							"/auth/refresh",
							{
								refreshToken: tokens.refreshToken,
							}
						);

						const newTokens = response.data;
						apiClient.setTokens(newTokens);

						set((state) => ({
							tokens: newTokens,
						}));
					} catch (error) {
						// Refresh failed, logout user
						get().logout();
						throw error;
					}
				},

				// In your auth store, update the loadFromStorage function:
				loadFromStorage: () => {
					try {
						set({ loading: "loading" }); // Set loading state when starting

						const storedTokens =
							localStorage.getItem("auth_tokens");
						if (storedTokens) {
							const tokens: AuthTokens = JSON.parse(storedTokens);

							// Check if token is expired
							if (new Date(tokens.expiresAt) > new Date()) {
								apiClient.setTokens(tokens);

								// Fetch current user info
								apiClient
									.get<User>("/auth/me")
									.then((response) => {
										set({
											currentUser: response.data,
											tokens,
											isAuthenticated: true,
											loading: "success", // Set to success when done
										});
									})
									.catch(() => {
										// Failed to fetch user, logout
										set({ loading: "idle" }); // Reset loading state
										get().logout();
									});
							} else {
								// Token expired, try to refresh
								get()
									.refreshToken()
									.catch(() => {
										set({ loading: "idle" }); // Reset loading state
										get().logout();
									});
							}
						} else {
							// No stored tokens, set loading to idle
							set({ loading: "idle" });
						}
					} catch (error) {
						console.error(
							"Failed to load auth from storage:",
							error
						);
						set({ loading: "idle" }); // Reset loading state on error
						get().logout();
					}
				},

				updateProfile: async (updates: Partial<User>) => {
					try {
						set({ loading: "loading", error: null });

						const response = await apiClient.patch<User>(
							"/auth/profile",
							updates
						);
						const updatedUser = response.data;

						set({
							currentUser: updatedUser,
							loading: "success",
							error: null,
						});
					} catch (error: any) {
						set({
							loading: "error",
							error: error.message || "Profile update failed",
						});
						throw error;
					}
				},

				clearError: () => {
					set({ error: null });
				},
			}),
			{
				name: "auth-storage",
				partialize: (state) => ({
					tokens: state.tokens,
				}),
			}
		)
	)
);

// Initialize auth on app start
useAuthStore.getState().loadFromStorage();
