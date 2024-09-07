import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AccountDetails } from "../../types/Account";

interface AccountState {
  accountDetails: AccountDetails | null;
}

const initialState: AccountState = {
  accountDetails: null,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccountDetails: (state, action: PayloadAction<AccountDetails>) => {
      state.accountDetails = action.payload;
    },
    clearAccountDetails: (state) => {
      state.accountDetails = null;
    },
  },
});

export const { setAccountDetails, clearAccountDetails } = accountSlice.actions;

export default accountSlice.reducer;
