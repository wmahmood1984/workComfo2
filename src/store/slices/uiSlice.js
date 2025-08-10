import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    showMobileMenu: false,
    showDropdown: false,
    showNotifications: false,
  },
  reducers: {
    toggleMobileMenu: (state) => {
      state.showMobileMenu = !state.showMobileMenu;
    },
    toggleDropdown: (state) => {
      state.showDropdown = !state.showDropdown;
    },
    toggleNotifications: (state) => {
      state.showNotifications = !state.showNotifications;
    },
    closeAll: (state) => {
      state.showMobileMenu = false;
      state.showDropdown = false;
      state.showNotifications = false;
    },
  },
});

export const { toggleMobileMenu, toggleDropdown, toggleNotifications, closeAll } = uiSlice.actions;
export default uiSlice.reducer;
