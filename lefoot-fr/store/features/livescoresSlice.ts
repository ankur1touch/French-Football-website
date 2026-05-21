import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "@/lib/client";
import type { LiveScore } from "@/types/match";

interface LiveScoresState {
  scores: LiveScore[];
  lastUpdated: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: LiveScoresState = {
  scores: [],
  lastUpdated: null,
  status: "idle",
  error: null,
};

export const fetchLiveScores = createAsyncThunk("livescores/fetchAll", async () => {
  const res = await axiosClient.post<{ scores: LiveScore[]; lastUpdated: string }>(
    "/api/livescores"
  );
  return res.data;
});

const livescoresSlice = createSlice({
  name: "livescores",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLiveScores.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchLiveScores.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.scores = action.payload.scores;
        state.lastUpdated = action.payload.lastUpdated;
      })
      .addCase(fetchLiveScores.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Erreur de chargement";
      });
  },
});

export default livescoresSlice.reducer;
