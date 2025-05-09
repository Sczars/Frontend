export interface UserDetail {
  id: number;
  email: string;
  password: string;
  refreshToken: string;
  username: string;
  createdAt: string;
  role: boolean;
  isActive: boolean;
}

export interface UserInList {
  id: number;
  email: string;
  username: string;
  isActive: boolean;
  role: boolean;
  createdAt: string;
  messageCount: number;
}

export interface CurrUser {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  role: boolean;
  isActive: boolean;
}

export interface ChatMessages {
  id: number,
  sender: number,
  receiver: number,
  content: string,
  createdAt: string,
  updatedAt: string,
}