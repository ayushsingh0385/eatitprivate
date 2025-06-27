import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";


export const useHealthProfileStore = create(
  persist(
    (set) => ({
      profile: null,
      loading: false,
      error: null,

      // Create profile
      enterProfileDetails: async (input) => {
        // try {
        console.log("user:    ",input.user);
          set({ profile: input.user, loading: false });
          // set({ loading: true, error: null });

          // const response = await axios.post(`${API_URL}/Enter-Personal-Details`, input, {
          //   headers: { "Content-Type": "application/json" },
          // });
          // if (response.data.success) {
          //   toast.success(response.data.message);
          //   return response.data
          // } else {
          //   console.log(response)
          //   toast.error(response.data.message)
          //   set({ loading: false, error: response.data.message });
          //   return response.data
          // }
        // } catch (error) {
        //   const errMsg = error?.data?.message || "Failed to save profile";
        //   toast.error(errMsg);
        //   set({ loading: false, error: errMsg });
         
        //   return errMsg
        // }
      },

      // Update profile
      updateProfileDetails: async (input) => {
        set({ profile: input, loading: false });
        // try {

        //   set({ loading: true, error: null });

        //   const response = await axios.put(`${API_URL}/Update-Personal-Details`, input, {
        //     headers: { "Content-Type": "application/json" },
        //   });

        //   if (response.data.success) {
        //     toast.success(response.data.message);
            
        //   } else {
        //     throw new Error(response.data.message);
        //   }
        // } catch (error) {
        //   const errMsg = error.response?.data?.message || "Profile update failed";
        //   toast.error(errMsg);
        //   set({ loading: false, error: errMsg });
        // }
      },

      // Optional: fetch profile if needed
    }),
    {
      name: "health-profile",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
