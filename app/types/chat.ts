export type SpotifyTrack = {
    name: string;
    artist: string;
    album: string;
    uri: string;
    id: string;
    preview_url: string | null;
};

export type Chat = {
    assistantMessage?: string;
    userMessage?: string;
    tracks: SpotifyTrack[];
    sessionId: string;
    createdAt: string;
    updatedAt: string;
}