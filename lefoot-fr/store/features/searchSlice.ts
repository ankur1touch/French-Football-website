import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "@/lib/client";
import type { SearchResults } from "@/lib/football/services";

interface SearchState {
  results: SearchResults | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: SearchState = {
  results: null,
  status: "idle",
  error: null,
};

export const fetchSearch = createAsyncThunk("search/fetch", async (q: string) => {
  const res = await axiosClient.post<SearchResults>("/api/search", { q });
  return res.data;
});

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    resetSearch: (state) => {
      state.results = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearch.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSearch.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.results = action.payload;
      })
      .addCase(fetchSearch.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Search failed";
      });
  },
});

export const { resetSearch } = searchSlice.actions;
export default searchSlice.reducer;
