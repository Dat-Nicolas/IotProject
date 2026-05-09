import { baseApi } from './baseApi';

export interface RoomConfig {
  roomId: string;
  peoplePerAC: number;
  minTemp: number;
  maxTemp: number;
  defaultTemp: number;
  autoMode: boolean;
  startTime: string;
  endTime: string;
}

export const configApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConfigByRoom: builder.query<RoomConfig, string>({
      query: (roomId) => `/configs/${roomId}`,
      transformResponse: (response: { data: RoomConfig }) => response.data,
      providesTags: ['Config'],
    }),
    updateConfigByRoom: builder.mutation<RoomConfig, { roomId: string; data: Partial<RoomConfig> }>({
      query: ({ roomId, data }) => ({
        url: `/configs/${roomId}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: { data: RoomConfig }) => response.data,
      invalidatesTags: ['Config', 'Room'],
    }),
  }),
});

export const { useGetConfigByRoomQuery, useUpdateConfigByRoomMutation } = configApi;
