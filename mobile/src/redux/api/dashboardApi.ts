import { baseApi } from './baseApi';

interface DashboardStats {
  totalRooms: number;
  totalAcs: number;
  acOnCount: number;
  alerts: Array<{ id: string; action: string; timestamp: string }>;
}

interface RoomChartItem {
  timestamp: string;
  peopleCount: number;
  temperature: number;
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => '/dashboard/stats',
      transformResponse: (response: { data: DashboardStats }) => response.data,
      providesTags: ['Dashboard'],
    }),
    getRoomChart: builder.query<RoomChartItem[], string>({
      query: (roomId) => `/dashboard/room/${roomId}/chart`,
      transformResponse: (response: { data: RoomChartItem[] }) => response.data,
      providesTags: ['Dashboard'],
    }),
    getRoomHistory: builder.query<Array<Record<string, unknown>>, string>({
      query: (roomId) => `/dashboard/room/${roomId}/history`,
      transformResponse: (response: { data: Array<Record<string, unknown>> }) => response.data,
      providesTags: ['Dashboard'],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetRoomChartQuery,
  useGetRoomHistoryQuery,
} = dashboardApi;
