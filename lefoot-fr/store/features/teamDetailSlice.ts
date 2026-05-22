import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "@/lib/client";
import type { TeamDetailResponse } from "@/types/team";
import type { TeamInfo, DetailSquadPlayer, TeamDetailStandingRow } from "@/types/team";
import type { H2HMatch } from "@/types/matchDetail";

interface TeamDetailState {
  team: TeamInfo | null;
  squad: DetailSquadPlayer[];
  fixtures: H2HMatch[];
  results: H2HMatch[];
  standings: TeamDetailStandingRow[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TeamDetailState = {
  team: null,
  squad: [],
  fixtures: [],
  results: [],
  standings: [],
  status: "idle",
  error: null,
};

export const fetchTeamDetail = createAsyncThunk(
  "teamDetail/fetch",
  async (teamId: string) => {
    const res = await axiosClient.post<TeamDetailResponse>(`/api/teams/${teamId}`);
    return res.data;
  }
);

const teamDetailSlice = createSlice({
  name: "teamDetail",
  initialState,
  reducers: {
    resetTeamDetail: (state) => {
      state.team = null;
      state.squad = [];
      state.fixtures = [];
      state.results = [];
      state.standings = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamDetail.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTeamDetail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.team = action.payload.team;
        state.squad = action.payload.squad;
        state.fixtures = action.payload.fixtures;
        state.results = action.payload.results;
        state.standings = action.payload.standings;
      })
      .addCase(fetchTeamDetail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Erreur de chargement";
      });
  },
});

export const { resetTeamDetail } = teamDetailSlice.actions;
export default teamDetailSlice.reducer;
