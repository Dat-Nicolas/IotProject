import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AcStateItem {
  id: string;
  name: string;
  status: 'ON' | 'OFF';
  currentTemp: number;
  mode: 'COOL' | 'DRY' | 'FAN' | 'AUTO';
}

interface AcState {
  byRoom: Record<string, AcStateItem[]>;
}

const initialState: AcState = {
  byRoom: {},
};

const acSlice = createSlice({
  name: 'ac',
  initialState,
  reducers: {
    setAcsForRoom: (
      state,
      action: PayloadAction<{ roomId: string; acs: AcStateItem[] }>,
    ) => {
      state.byRoom[action.payload.roomId] = action.payload.acs;
    },
  },
});

export const { setAcsForRoom } = acSlice.actions;
export default acSlice.reducer;
