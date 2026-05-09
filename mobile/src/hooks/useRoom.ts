import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { setSelectedRoomId } from '../redux/slices/roomSlice';

export const useRoom = () => {
  const dispatch = useDispatch<AppDispatch>();
  const rooms = useSelector((state: RootState) => state.room.rooms);
  const selectedRoomId = useSelector((state: RootState) => state.room.selectedRoomId);

  return {
    rooms,
    selectedRoomId,
    selectRoom: (roomId: string | null) => dispatch(setSelectedRoomId(roomId)),
  };
};
