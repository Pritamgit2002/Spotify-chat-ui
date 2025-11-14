"use client";

import { api } from "@/app/lib/api";
import {  TApiError, TApiSuccess, TMutationOpts, TQueryOpts } from "@/app/types/api";
import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Chat } from "@/app/types/chat";

type CreateChatBody = {
    sessionId: string;
    userMessage: string;
}

export type ChatSuccessResponse = {
    message: string;
};

type FetchAllChatsResponse = {
    messages: Chat[];
}

type FetchChatsPayload = {
      sessionId: string;
  }

// creating CHAT
const createChat = (props: CreateChatBody): Promise<ChatSuccessResponse> => {
    return api.post("/chat", props);
}

export const useCreateChat = (
    options?: TMutationOpts<CreateChatBody>
  ) => {
    return useMutation({
      mutationKey: ["useCreateChat"],
      mutationFn: createChat,
      ...options,
    });
  };


// fetching all CHATS
const fetchAllChats =  (): Promise<FetchAllChatsResponse> => {
    return api.get(`/chat`);
}

// export const useFetchAllChats = (
//     params: FetchChatsPayload,
//     options?: TQueryOpts<FetchAllChatsResponse>
//   ) => {
//     return useQuery({
//       queryKey: ["useFetchAllChats", params.sessionId],
//       queryFn: () => fetchAllChats(params),
//       ...options,
//     });
//   };

export const useFetchAllChats = (
  options?: Omit<UseQueryOptions<FetchAllChatsResponse, TApiError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<FetchAllChatsResponse, TApiError>({
    queryKey: ["useFetchAllChats"] as const,
    queryFn: fetchAllChats,
    ...options,
  });
};