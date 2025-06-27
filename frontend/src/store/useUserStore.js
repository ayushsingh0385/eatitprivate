import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";
import { toast } from "sonner";
import { useHealthProfileStore } from "./useUserInformationStore";

const API_END_POINT = `${import.meta.env.VITE_URL || 'http://localhost:3000'}/api/v1/user`; 
axios.defaults.withCredentials = true;

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isCheckingAuth: true,
      loading: false,
      // signup api implementation
      signup: async (input) => {
        try {
          set({ loading: true });
          
          const response = await axios.post(`${API_END_POINT}/signup`, input, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          });
          if (response.data.success) {
            toast.success(response.data.message);
            set({ loading: false, user: response.data.user, isAuthenticated: true });
          } else {
            set({ loading: false }); // ✅ Ensure loading is set to false
            throw new Error(response.data.message);
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Signup failed"); // ✅ Correct way
          set({ loading: false });
          throw error;
        }
        
        
        
      },
      login: async (input) => {
        try {
          set({ loading: true });
          const loginRes = await axios.post(
            `${API_END_POINT}/login`,
            input,
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );
      
          if (loginRes.data.success) {
            // Store token in localStorage and set Authorization header
            if (loginRes.data.token) {
              localStorage.setItem('token', loginRes.data.token);
              axios.defaults.headers.common['Authorization'] = `Bearer ${loginRes.data.token}`;
            }
            toast.success(loginRes.data.message);
            set({ loading: false, user: loginRes.data.user, isAuthenticated: true });

            // Fetch and set profile after login
            try {
              const profileRes = await axios.get(`${import.meta.env.VITE_URL || 'http://localhost:3000'}/api/v1/profile/me`, {
                withCredentials: true,
              });
              if (profileRes.data && profileRes.data.user) {
                useHealthProfileStore.getState().setProfile(profileRes.data.user);
              }
            } catch (profileErr) {
              // Optionally handle profile fetch error
              console.error("Failed to fetch profile after login", profileErr);
            }
            return loginRes.data.success
          }
        } catch (error) {
          console.error("Login error:", error); // Debugging
      
          // Handle cases where error.response is undefined
          const errorMessage =
            error.response?.data?.message || "Something went wrong. Please try again.";
          
          toast.error(errorMessage);
          set({ loading: false });
        }
      },      
      verifyEmail: async (verificationCode) => {
        try {
          set({ loading: true });
          const response = await axios.post(
            `${API_END_POINT}/verify-email`,
            { verificationCode },
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );
          if (response.data.success) {
            toast.success(response.data.message);
            set({ loading: false, user: response.data.user, isAuthenticated: true });
            return response.data.user
          }
        } catch (error) {
          toast.success(error.response.data.message);
          set({ loading: false });
        }
      },
      checkAuthentication: async () => {
        const state = useUserStore.getState();
      
        // ✅ Skip API call if user is already stored from localStorage
        if (state.user && state.isAuthenticated) {
          set({ isCheckingAuth: false });
          return;
        }
      
        try {
          set({ isCheckingAuth: true });
      
          const response = await axios.get(`${API_END_POINT}/check-auth`, {
            withCredentials: true,
          });
      
          if (response.data.success) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              isCheckingAuth: false,
            });
          } else {
            set({ isAuthenticated: false, isCheckingAuth: false });
          }
        } catch (error) {
          set({ isAuthenticated: false, isCheckingAuth: false });
        }
      },
          
      logout: async () => {
        try {
          set({ loading: true });
          const response = await axios.post(`${API_END_POINT}/logout`, {}, {
            withCredentials: true,
          });
          if (response.data.success) {
            // Clear token from localStorage and Authorization header
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            
            toast.success(response.data.message);
            set({ loading: false, user: null, isAuthenticated: false });
          }
        } catch (error) {
          // Clear token even if logout request fails
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
          
          toast.error(error.response.data.message);
          set({ loading: false, user: null, isAuthenticated: false });
        }
      },
      forgotPassword: async (email) => {
        try {
          set({ loading: true });
          const response = await axios.post(
            `${API_END_POINT}/forgot-password`,
            { email },
            {
              withCredentials: true,
            }
          );
          if (response.data.success) {
            toast.success(response.data.message);
            set({ loading: false });
          }
        } catch (error) {
          toast.error(error.response.data.message);
          set({ loading: false });
        }
      },
      resetPassword: async (take) => {
        try {
          set({ loading: true });
          const response = await axios.post(
            `${API_END_POINT}/reset-password`,
            { take },
            {
              withCredentials: true,
            }
          );
          if (response.data.success) {
            toast.success(response.data.message);
            set({ loading: false });
          }
        } catch (error) {
          toast.error(error.response.data.message);
          set({ loading: false });
        }
      },
      updateProfile: async (input) => {
        try {
          const response = await axios.put(
            `${API_END_POINT}/profile/update`,
            input,
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );
          if (response.data.success) {
            toast.success(response.data.message);
            set({ user: response.data.user, isAuthenticated: true });
          }
        } catch (error) {
          toast.error(error.response.data.message);
        }
      },
    }),
    {
      name: "user-name",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
