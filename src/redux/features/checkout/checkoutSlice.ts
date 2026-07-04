import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppliedCoupon {
  code: string;
  discount: number;
}

interface CheckoutState {
  coupon: AppliedCoupon | null;
}

const initialState: CheckoutState = {
  coupon: null,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setCoupon(state, action: PayloadAction<AppliedCoupon | null>) {
      state.coupon = action.payload;
    },
  },
});

export const { setCoupon } = checkoutSlice.actions;
export default checkoutSlice.reducer;
