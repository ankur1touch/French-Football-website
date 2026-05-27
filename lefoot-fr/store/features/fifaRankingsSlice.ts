import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "@/lib/client";
import type { FifaRankingsData } from "@/types/fifa";

interface FifaRankingsState {
  data: FifaRankingsData | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: FifaRankingsState = {
  data: null,
  status: "idle",
  error: null,
};

export const fetchFifaRankings = createAsyncThunk("fifaRankings/fetch", async () => {
  const res = await axiosClient.post<FifaRankingsData>("/api/fifa-rankings");
  return res.data;
});

const fifaRankingsSlice = createSlice({
  name: "fifaRankings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFifaRankings.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFifaRankings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchFifaRankings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to load FIFA rankings";
      });
  },
});

export default fifaRankingsSlice.reducer;
