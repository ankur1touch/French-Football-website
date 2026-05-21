import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "@/lib/client";
import type { Transfer } from "@/types/transfer";

interface TransfersState {
  transfers: Transfer[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TransfersState = {
  transfers: [],
  status: "idle",
  error: null,
};

export const fetchTransfers = createAsyncThunk("transfers/fetchAll", async () => {
  const res = await axiosClient.post<Transfer[]>("/api/transfers");
  return res.data;
});

const transfersSlice = createSlice({
  name: "transfers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransfers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTransfers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.transfers = action.payload;
      })
      .addCase(fetchTransfers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Erreur de chargement";
      });
  },
});

export default transfersSlice.reducer;
