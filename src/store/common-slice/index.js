// store/common-slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const addFeatureImage = createAsyncThunk(
  "common/addFeatureImage",
  async (imageUrl) => {
    const response = await axios.post("http://localhost:5000/api/common/feature/add", {
      image: imageUrl,
    });
    return response.data;
  }
);

export const getFeatureImages = createAsyncThunk(
  "common/getFeatureImages",
  async () => {
    const response = await axios.get("http://localhost:5000/api/common/feature/get");
    return response.data;
  }
);

// ✅ NEW: Delete feature image
export const deleteFeatureImage = createAsyncThunk(
  "common/deleteFeatureImage",
  async (id) => {
    const response = await axios.delete(
      `http://localhost:5000/api/common/feature/delete/${id}`
    );
    return { ...response.data, id };
  }
);

const commonSlice = createSlice({
  name: "common",
  initialState: {
    featureImageList: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addFeatureImage.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.featureImageList.push(action.payload.data);
        }
      })
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.featureImageList = action.payload.data;
        }
      })
      .addCase(deleteFeatureImage.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.featureImageList = state.featureImageList.filter(
            (img) => img._id !== action.payload.id
          );
        }
      });
  },
});

export default commonSlice.reducer;
