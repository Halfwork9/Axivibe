import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/api";

const initialState = {
  categoryList: [],
  isLoading: false,
  error: null,
};

export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async ({ name, icon }) => {
    const res = await api.post("/admin/categories", { name, icon });
    return res.data; // expect { data: { _id, name, icon } }
  }
);

export const fetchAllCategories = createAsyncThunk(
  "categories/fetchAllCategories",
  async () => {
    const res = await api.get("/admin/categories");
    return res.data; // expect { data: [...] }
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/categories/${categoryId}`);
      return categoryId; // return only id
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const categorySlice = createSlice({
  name: "adminCategories",
  initialState,
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
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categoryList.push(action.payload.data);
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categoryList = state.categoryList.filter(
          (category) => category._id !== action.payload
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export default categorySlice.reducer;
