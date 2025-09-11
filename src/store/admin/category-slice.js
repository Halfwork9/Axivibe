import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async ({ name, icon }) => {
    const res = await axios.post("http://localhost:5000/api/admin/categories", { name, icon });
    return res.data;
  }
);

export const fetchAllCategories = createAsyncThunk(
  "categories/fetchAllCategories",
  async () => {
    const res = await axios.get("http://localhost:5000/api/admin/categories");
    return res.data;
  }
);

export const deleteCategory = createAsyncThunk(
  'adminCategories/deleteCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/categories/${categoryId}`);
      return categoryId; // Return the ID on success
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const categorySlice = createSlice({
  name: "adminCategories",
  initialState: {
    categoryList: [],
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categoryList = action.payload.data;
      })
      .addCase(fetchAllCategories.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categoryList.push(action.payload.category);
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categoryList = state.categoryList.filter(
          (category) => category._id !== action.payload
        );
      });
  },
});

export default categorySlice.reducer;
