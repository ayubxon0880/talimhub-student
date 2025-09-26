import API from "../api/axios.tsx";
import type { TopicDTO } from "./models.tsx";

export const handleUpload = async (file: File | null): Promise<string | null> => {
    if (!file) {
        return null;
    }

    const formData = new FormData();
    formData.append("audio", file, "audio.webm");

    try {
        const response = await API.post<{ message: string }>("/audio/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data.message;
    } catch (error) {
        return null;
    }
};

export async function getRandomTopic(
    part: string,
    setTopic: React.Dispatch<React.SetStateAction<TopicDTO | null>>
): Promise<TopicDTO | null | false> {
    try {
        const response = await API.get<TopicDTO>(`/topic/random?part=${part}`);
        if (!response.data) {
            return null;
        }
        setTopic(response.data);
        return response.data;
    } catch (e) {
        console.error(e);
        return false;
    }
}
