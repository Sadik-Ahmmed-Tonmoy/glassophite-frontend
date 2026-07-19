/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../api/baseApi";

export interface PrescriptionLens {
  id: string;
  name: string;
  description?: string;
  price: number;
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const lensApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPrescriptionLenses: builder.query<{ success: boolean; data: PrescriptionLens[] }, { isAvailable?: boolean } | void>({
      query: (params) => ({ url: "prescription-lenses", params: params || undefined }),
      providesTags: ["lenses" as any],
    }),
    getPrescriptionLensById: builder.query<{ success: boolean; data: PrescriptionLens }, string>({
      query: (id) => ({ url: `prescription-lenses/${id}` }),
      providesTags: (_result, _err, id) => [{ type: "lens" as any, id }],
    }),
    createPrescriptionLens: builder.mutation<{ success: boolean; data: PrescriptionLens }, Partial<PrescriptionLens>>({
      query: (body) => ({ url: "prescription-lenses", method: "POST", body }),
      invalidatesTags: ["lenses" as any],
    }),
    updatePrescriptionLens: builder.mutation<{ success: boolean; data: PrescriptionLens }, { id: string } & Partial<PrescriptionLens>>({
      query: ({ id, ...body }) => ({ url: `prescription-lenses/${id}`, method: "PATCH", body }),
      invalidatesTags: (_result, _err, { id }) => ["lenses" as any, { type: "lens" as any, id }],
    }),
    deletePrescriptionLens: builder.mutation<{ success: boolean; data: PrescriptionLens }, string>({
      query: (id) => ({ url: `prescription-lenses/${id}`, method: "DELETE" }),
      invalidatesTags: ["lenses" as any],
    }),
  }),
});

export const {
  useGetPrescriptionLensesQuery,
  useGetPrescriptionLensByIdQuery,
  useCreatePrescriptionLensMutation,
  useUpdatePrescriptionLensMutation,
  useDeletePrescriptionLensMutation,
} = lensApi;
