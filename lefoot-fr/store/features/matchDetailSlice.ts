import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "@/lib/client";
import type { MatchDetail } from "@/types/matchDetail";

interface MatchDetailState {
  detail: MatchDetail | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: MatchDetailState = {
  detail: null,
  status: "idle",
  error: null,
};

export const fetchMatchDetail = createAsyncThunk(
  "matchDetail/fetch",
  async (matchId: string) => {
    const res = await axiosClient.post<MatchDetail>(`/api/matches/${matchId}`);
    return res.data;
  }
);

const matchDetailSlice = createSlice({
  name: "matchDetail",
  initialState,
  reducers: {
    resetMatchDetail: (state) => {
      state.detail = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatchDetail.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMatchDetail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.detail = action.payload;
      })
      .addCase(fetchMatchDetail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Erreur de chargement";
      });
  },
});

export const { resetMatchDetail } = matchDetailSlice.actions;
export default matchDetailSlice.reducer;
