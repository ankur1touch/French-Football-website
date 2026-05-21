import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "@/lib/client";
import type { RankingsData } from "@/types/ranking";

interface RankingsState {
  ligue1: RankingsData["ligue1"];
  championsLeague: RankingsData["championsLeague"];
  groups: RankingsData["groups"];
  leagueName: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: RankingsState = {
  ligue1: [],
  championsLeague: [],
  groups: [],
  leagueName: "Coupe du Monde",
  status: "idle",
  error: null,
};

export const fetchRankings = createAsyncThunk("rankings/fetchAll", async () => {
  const res = await axiosClient.post<RankingsData>("/api/rankings");
  return res.data;
});

const rankingsSlice = createSlice({
  name: "rankings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRankings.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchRankings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.ligue1 = action.payload.ligue1;
        state.championsLeague = action.payload.championsLeague ?? [];
        state.groups = action.payload.groups ?? [];
        state.leagueName = action.payload.leagueName ?? "Coupe du Monde";
      })
      .addCase(fetchRankings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Erreur de chargement";
      });
  },
});

export default rankingsSlice.reducer;
