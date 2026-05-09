import { baseApi } from './baseApi';

interface PaginatedLogResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  items: T[];
}

export const logApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSensorLogs: builder.query<PaginatedLogResponse<Record<string, unknown>>, string>({
      query: (roomId) => `/logs/sensor/${roomId}`,
      transformResponse: (response: { data: PaginatedLogResponse<Record<string, unknown>> }) =>
        response.data,
      providesTags: ['Logs'],
    }),
    getActivityLogs: builder.query<PaginatedLogResponse<Record<string, unknown>>, string>({
      query: (roomId) => `/logs/activity/${roomId}`,
      transformResponse: (response: { data: PaginatedLogResponse<Record<string, unknown>> }) =>
        response.data,
      providesTags: ['Logs'],
    }),
  }),
});

export const { useGetSensorLogsQuery, useGetActivityLogsQuery } = logApi;
