import { baseApi } from './baseApi';

export interface RoomResponse {
  id: string;
  name: string;
  location: string;
  currentPeople: number;
  currentTemperature: number;
}

export const roomApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRooms: builder.query<RoomResponse[], void>({
      query: () => '/rooms',
      transformResponse: (response: { data: RoomResponse[] }) => response.data,
      providesTags: ['Room'],
    }),
    getRoomById: builder.query<RoomResponse, string>({
      query: (id) => `/rooms/${id}`,
      transformResponse: (response: { data: RoomResponse }) => response.data,
      providesTags: ['Room'],
    }),
    createRoom: builder.mutation<RoomResponse, { name: string; location: string }>({
      query: (body) => ({
        url: '/rooms',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: RoomResponse }) => response.data,
      invalidatesTags: ['Room'],
    }),
    updateRoom: builder.mutation<
      RoomResponse,
      { id: string; data: Partial<{ name: string; location: string }> }
    >({
      query: ({ id, data }) => ({
        url: `/rooms/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: { data: RoomResponse }) => response.data,
      invalidatesTags: ['Room'],
    }),
  }),
});

export const {
  useGetRoomsQuery,
  useGetRoomByIdQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
} = roomApi;
