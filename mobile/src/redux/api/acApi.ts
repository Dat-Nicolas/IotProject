import { baseApi } from './baseApi';

export interface AirConditioner {
  id: string;
  name: string;
  status: 'ON' | 'OFF';
  mode: 'COOL' | 'DRY' | 'FAN' | 'AUTO';
  currentTemp: number;
}

export const acApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAcsByRoom: builder.query<AirConditioner[], string>({
      query: (roomId) => `/air-conditioners?roomId=${roomId}`,
      transformResponse: (response: { data: AirConditioner[] }) => response.data,
      providesTags: ['AC'],
    }),
    controlAc: builder.mutation<
      AirConditioner,
      {
        id: string;
        data: Partial<Pick<AirConditioner, 'status' | 'mode' | 'currentTemp'>>;
      }
    >({
      query: ({ id, data }) => ({
        url: `/air-conditioners/${id}/control`,
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: { data: AirConditioner }) => response.data,
      invalidatesTags: ['AC', 'Room', 'Dashboard'],
    }),
  }),
});

export const { useGetAcsByRoomQuery, useControlAcMutation } = acApi;
