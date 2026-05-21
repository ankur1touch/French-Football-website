import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "@/lib/client";
import type { Tournament } from "@/types/tournament";

interface TournamentsState {
  tournaments: Tournament[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TournamentsState = {
  tournaments: [],
  status: "idle",
  error: null,
};

export const fetchTournaments = createAsyncThunk("tournaments/fetchAll", async () => {
  const res = await axiosClient.post<Tournament[]>("/api/tournaments");
  return res.data;
});

const tournamentsSlice = createSlice({
  name: "tournaments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTournaments.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTournaments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tournaments = action.payload;
      })
      .addCase(fetchTournaments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Erreur de chargement";
      });
  },
});

export default tournamentsSlice.reducer;
