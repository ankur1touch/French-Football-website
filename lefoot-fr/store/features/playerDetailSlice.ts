import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "@/lib/client";
import type { PlayerDetailResponse } from "@/types/player";
import type { H2HMatch } from "@/types/matchDetail";
import type { PlayerInfo, PlayerStatistics } from "@/types/player";

interface PlayerDetailState {
  player: PlayerInfo | null;
  statistics: PlayerStatistics[];
  fixtures: H2HMatch[];
  bio: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: PlayerDetailState = {
  player: null,
  statistics: [],
  fixtures: [],
  bio: "",
  status: "idle",
  error: null,
};

export const fetchPlayerDetail = createAsyncThunk(
  "playerDetail/fetch",
  async (playerId: string) => {
    const res = await axiosClient.post<PlayerDetailResponse>(`/api/players/${playerId}`);
    return res.data;
  }
);

const playerDetailSlice = createSlice({
  name: "playerDetail",
  initialState,
  reducers: {
    resetPlayerDetail: (state) => {
      state.player = null;
      state.statistics = [];
      state.fixtures = [];
      state.bio = "";
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlayerDetail.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPlayerDetail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.player = action.payload.player;
        state.statistics = action.payload.statistics;
        state.fixtures = action.payload.recentFixtures;
        state.bio = action.payload.bio ?? "";
      })
      .addCase(fetchPlayerDetail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Erreur de chargement";
      });
  },
});

export const { resetPlayerDetail } = playerDetailSlice.actions;
export default playerDetailSlice.reducer;
