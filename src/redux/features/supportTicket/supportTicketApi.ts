import { baseApi } from "../../api/baseApi";

const supportTicketApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSupportTicket: builder.mutation({
      query: (body) => ({ url: "support-tickets", method: "POST", body }),
      invalidatesTags: ["supportTickets"],
    }),
    getMySupportTickets: builder.query({
      query: () => ({ url: "support-tickets/my-tickets" }),
      providesTags: ["supportTickets"],
    }),
    getSupportTicketById: builder.query({
      query: (id: string) => ({ url: `support-tickets/${id}` }),
      providesTags: (_result, _err, id) => [{ type: "supportTicket", id }],
    }),
    getAllSupportTickets: builder.query({
      query: (params = {}) => ({ url: "support-tickets", params }),
      providesTags: ["supportTickets"],
    }),
    updateSupportTicketStatus: builder.mutation({
      query: ({ id, status }) => ({ url: `support-tickets/${id}/status`, method: "PATCH", body: { status } }),
      invalidatesTags: ["supportTickets"],
    }),
    addSupportReply: builder.mutation({
      query: ({ id, message }) => ({ url: `support-tickets/${id}/reply`, method: "POST", body: { message } }),
      invalidatesTags: (_result, _err, { id }) => [{ type: "supportTicket", id }],
    }),
  }),
});

export const {
  useCreateSupportTicketMutation,
  useGetMySupportTicketsQuery,
  useGetSupportTicketByIdQuery,
  useGetAllSupportTicketsQuery,
  useUpdateSupportTicketStatusMutation,
  useAddSupportReplyMutation,
} = supportTicketApi;
