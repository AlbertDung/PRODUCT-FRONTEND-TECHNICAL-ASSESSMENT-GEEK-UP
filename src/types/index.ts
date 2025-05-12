export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
}

export interface Album {
  id: number;
  userId: number;
  title: string;
}

export interface Photo {
  id: number;
  albumId: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

export interface UserWithAvatar extends User {
  avatarUrl: string;
}

export interface AlbumWithUser extends Album {
  user: UserWithAvatar;
} 