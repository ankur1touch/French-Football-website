import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "@/lib/client";
import type { Match } from "@/types/match";

interface MatchesState {
  matches: Match[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: MatchesState = {
  matches: [],
  status: "idle",
  error: null,
};

export const fetchMatches = createAsyncThunk("matches/fetchAll", async () => {
  const res = await axiosClient.post<Match[]>("/api/matches");
  return res.data;
});

const matchesSlice = createSlice({
  name: "matches",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatches.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.matches = action.payload;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Erreur de chargement";
      });
  },
});

export default matchesSlice.reducer;
