import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Room {
  id: string;
  name: string;
  location: string;
  currentPeople: number;
  currentTemperature: number;
}

interface RoomState {
  rooms: Room[];
  selectedRoomId: string | null;
}

const initialState: RoomState = {
  rooms: [],
  selectedRoomId: null,
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRooms: (state, action: PayloadAction<Room[]>) => {
      state.rooms = action.payload;
    },
    setSelectedRoomId: (state, action: PayloadAction<string | null>) => {
      state.selectedRoomId = action.payload;
    },
  },
});

export const { setRooms, setSelectedRoomId } = roomSlice.actions;
export default roomSlice.reducer;
