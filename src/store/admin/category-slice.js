import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/api';

const initialState = {
  categoryList: [],
  isLoading: false,
  error: null,
};

export const createCategory = createAsyncThunk(
  'adminCategories/createCategory',
  async ({ name, icon }, { rejectWithValue }) => {
    try {
      const res = await api.post('/admin/categories', { name, icon });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create category');
    }
  }
);

export const fetchAllCategories = createAsyncThunk(
  'adminCategories/fetchAllCategories',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/admin/categories');
      console.log('fetchAllCategories: Response:', res.data);
      return res.data; // expect { success: true, data: [...] }
    } catch (error) {
      console.error('fetchAllCategories: Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || 'Failed to fetch categories');
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'adminCategories/deleteCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/categories/${categoryId}`);
      return categoryId;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete category');
    }
  }
);

const categorySlice = createSlice({
  name: 'adminCategories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categoryList = Array.isArray(action.payload.data) ? action.payload.data : [];
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
        state.categoryList = [];
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        if (action.payload.success && action.payload.data) {
          state.categoryList.push(action.payload.data);
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categoryList = state.categoryList.filter((cat) => cat._id !== action.payload);
      });
  },
});

export default categorySlice.reducer;
