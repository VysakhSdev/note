// redux/modalSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isModalOpen: false,
  isEditOpen: false,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state) => {
      state.isModalOpen = true;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
    },
    openEditModal: (state) => {
      state.isEditOpen = true;
    },
    closeEditModal: (state) => {
      state.isEditOpen = false;
    },
  },
});

export const { openModal, closeModal, openEditModal, closeEditModal } = modalSlice.actions;
export default modalSlice.reducer;
