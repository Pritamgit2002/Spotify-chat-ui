"use client";

import { useState, useRef, useEffect } from "react";
import { Chat as ChatType } from "@/app/types/chat";
import { useCreateChat, useFetchAllChats } from "../api/hooks/chat";
import { useQueryClient } from "@tanstack/react-query";

export const Chat = () => {
    const [inputValue, setInputValue] = useState("");
    const [currentlyPlayingUri, setCurrentlyPlayingUri] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();
    
    const { data: chatsData, isLoading: isLoadingChats } = useFetchAllChats(
        {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        }
    );

    const { mutateAsync: createChat, isPending: isCreatingChat } = useCreateChat({
        onSuccess: () => {
            console.log("Chat created successfully", createChat);
            queryClient.invalidateQueries({ queryKey: ["useFetchAllChats"] });
        },
        onError: (error) => {
            console.error("Failed to create chat:", error);
        },
    });

    const messages: ChatType[] = chatsData?.messages || [];
    const isLoading = isLoadingChats || isCreatingChat;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend =  () => {
        if (!inputValue.trim() || isLoading) return;

        const messageText = inputValue.trim();
        setInputValue("");

       createChat({ sessionId: "123", userMessage: messageText });
    };

    const handlePlayPause = (uri: string) => {
        console.log("Song URI:", uri);
        // If clicking the same song that's playing, pause it
        // Otherwise, pause the current song and play the new one
        if (currentlyPlayingUri === uri) {
            setCurrentlyPlayingUri(null);
            createChat({ sessionId: "123", userMessage: `Pause ${uri}` });
        } else {
            setCurrentlyPlayingUri(uri);
            createChat({ sessionId: "123", userMessage: `Play ${uri}` });
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="max-w-4xl mx-auto space-y-4">
                    {messages.length === 0 ? (
                        <div className="text-center text-gray-500 mt-16">
                            <div className="text-lg font-medium">No messages yet</div>
                            <div className="text-sm mt-2">Start a conversation!</div>
                        </div>
                    ) : (
                        messages.map((message, index) => (
                            <div key={index} className="space-y-3">
                                {/* User Message - Left */}
                                {message.userMessage && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                            U
                                        </div>
                                        <div className="flex-1 flex justify-start">
                                            <div className="max-w-[75%] md:max-w-[60%]">
                                                <div className="bg-blue-500 text-white rounded-2xl rounded-bl-md px-4 py-3 shadow-md">
                                                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                                        {message.userMessage}
                                                    </p>
                                                </div>
                                                {message.createdAt && (
                                                    <span className="text-xs text-gray-500 mt-1 block px-2">
                                                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Assistant Message - Right */}
                                {message.assistantMessage && (
                                    <div className="flex items-start gap-3 justify-end">
                                        <div className="flex-1 flex justify-end">
                                            <div className="max-w-[75%] md:max-w-[60%]">
                                                <div className="bg-white text-gray-900 rounded-2xl rounded-br-md px-4 py-3 shadow-md border border-gray-200">
                                                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                                        {message.assistantMessage}
                                                    </p>
                                                    {message.tracks ? message.tracks.map((track) => (
                                                        <div key={track.id} className="flex items-center gap-2 mt-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                                            <button
                                                                onClick={() => handlePlayPause(track.uri)}
                                                                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                                                                aria-label={currentlyPlayingUri === track.uri ? "Pause" : "Play"}
                                                            >
                                                                {currentlyPlayingUri === track.uri ? (
                                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                                                    </svg>
                                                                )}
                                                            </button>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium truncate">{track.name}</p>
                                                                <p className="text-xs text-gray-500 truncate">{track.artist} • {track.album}</p>
                                                            </div>
                                                        </div>
                                                    )) : <></>}
                                                </div>
                                                {message.createdAt && (
                                                    <span className="text-xs text-gray-500 mt-1 block px-2 text-right">
                                                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                            A
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                    {isLoading && (
                        <div className="flex items-center gap-2 text-gray-500">
                            
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            <span className="ml-2 text-sm">Thinking...</span>
                        </div>
                    )}
                </div>
                <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-200 bg-white p-4 md:p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder="Type your message..."
                            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all text-black placeholder:text-gray-500"
                            disabled={isCreatingChat}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputValue.trim() || isLoading}
                            className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg disabled:shadow-none"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

