import { configureStore } from "@reduxjs/toolkit";
import newsReducer from "./features/newsSlice";
import matchesReducer from "./features/matchesSlice";
import rankingsReducer from "./features/rankingsSlice";
import transfersReducer from "./features/transfersSlice";
import livescoresReducer from "./features/livescoresSlice";
import tournamentsReducer from "./features/tournamentsSlice";
import teamsReducer from "./features/teamsSlice";
import playersReducer from "./features/playersSlice";
import matchDetailReducer from "./features/matchDetailSlice";
import playerDetailReducer from "./features/playerDetailSlice";
import teamDetailReducer from "./features/teamDetailSlice";
import fifaRankingsReducer from "./features/fifaRankingsSlice";
import searchReducer from "./features/searchSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      news: newsReducer,
      matches: matchesReducer,
      rankings: rankingsReducer,
      transfers: transfersReducer,
      livescores: livescoresReducer,
      tournaments: tournamentsReducer,
      teams: teamsReducer,
      players: playersReducer,
      matchDetail: matchDetailReducer,
      playerDetail: playerDetailReducer,
      teamDetail: teamDetailReducer,
      fifaRankings: fifaRankingsReducer,
      search: searchReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
