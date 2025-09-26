import API from "../api/axios.tsx";
import type {TopicDTO} from "./models.tsx";

export const handleUpload = async (file) => {
    if (!file) {
        return null;
    }

    const formData = new FormData();
    formData.append("audio", file,"audio.webm");

    try {
        const response = await API.post("/audio/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data.message;
    } catch (error: any) {
        return null;
    }
};

export async function getRandomTopic(part,setTopic) {
    try {
        const response = await API.get<TopicDTO>(`/topic/random?part=${part}`);
        if (!response.data) {
            return null;
        }
        setTopic(response.data);
    } catch (e) {
        console.error(e);
        return false;
    }
}
