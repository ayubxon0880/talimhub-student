
export interface Topic {
    id: number;
    topic: string;
    image1?: string;
    image2?: string;
  }
  
  export interface SpeakingForm {
    audio: Blob;
    topic: number;
    part: number;
  }
  

  // src/types.ts

export interface Topic {
  id: number;
  topic: string;
}

export interface UserDTO {
  id: number;
  fullName: string;
}

export interface Speaking {
  id: number;
  speakingType: number;
  topic: Topic;
  userDTOSpeaking: UserDTO;
  audioUrl: string;
  likes: number;
  liked: boolean;
}

export interface Grade {
  degree: string;
  feedback: string;
  checkedAt: string;
  supervisorId: number;
  supervisorFullName: string;
}

export interface SpeakingResponse {
  speaking: Speaking;
  grade: Grade | null;
}

export interface SpeakingListResponse {
  speakings: Speaking[];
  totalPages: number;
}

export interface LikeItem {
  speaking_id: number;
  topic: string;
  userFirstname: string;
  userLastname: string;
  likePressedDate: string;
}

export interface LikesResponse {
  likes: LikeItem[];
  totalLikes: number;
}
