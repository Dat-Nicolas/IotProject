import { baseApi } from './baseApi';

// ─── Types ────────────────────────────────────────────────────────────────────

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface ScheduleResponse {
  id: string;
  roomId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;   // "HH:mm"
  endTime: string;     // "HH:mm"
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  room?: {
    id: string;
    name: string;
    location?: string;
  };
}

export interface CreateSchedulePayload {
  roomId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  isActive?: boolean;
}

export interface UpdateSchedulePayload {
  dayOfWeek?: DayOfWeek;
  startTime?: string;
  endTime?: string;
  isActive?: boolean;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const scheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchedules: builder.query<ScheduleResponse[], { roomId?: string } | void>({
      query: (params) => {
        const q = params && params.roomId ? `?roomId=${params.roomId}` : '';
        return `/schedules${q}`;
      },
      transformResponse: (response: { data: ScheduleResponse[] }) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Schedule' as const, id })),
              { type: 'Schedule', id: 'LIST' },
            ]
          : [{ type: 'Schedule', id: 'LIST' }],
    }),

    getScheduleById: builder.query<ScheduleResponse, string>({
      query: (id) => `/schedules/${id}`,
      transformResponse: (response: { data: ScheduleResponse }) => response.data,
      providesTags: (_result, _err, id) => [{ type: 'Schedule', id }],
    }),

    createSchedule: builder.mutation<ScheduleResponse, CreateSchedulePayload>({
      query: (body) => ({
        url: '/schedules',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: ScheduleResponse }) => response.data,
      invalidatesTags: [{ type: 'Schedule', id: 'LIST' }],
    }),

    updateSchedule: builder.mutation<
      ScheduleResponse,
      { id: string; data: UpdateSchedulePayload }
    >({
      query: ({ id, data }) => ({
        url: `/schedules/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: { data: ScheduleResponse }) => response.data,
      invalidatesTags: (_result, _err, { id }) => [{ type: 'Schedule', id }],
    }),

    deleteSchedule: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/schedules/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: { data: { id: string } }) => response.data,
      invalidatesTags: (_result, _err, id) => [
        { type: 'Schedule', id },
        { type: 'Schedule', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSchedulesQuery,
  useGetScheduleByIdQuery,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
} = scheduleApi;
