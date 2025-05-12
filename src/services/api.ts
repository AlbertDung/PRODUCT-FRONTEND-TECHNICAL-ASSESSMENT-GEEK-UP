import axios from 'axios';
import type { Album, Photo, User } from '../types';

const BASE_URL = 'https://jsonplaceholder.typicode.com';
const AVATAR_URL = 'https://ui-avatars.com/api';

const api = axios.create({
  baseURL: BASE_URL,
});

export const getUsers = async (): Promise<User[]> => {
  const { data } = await api.get<User[]>('/users');
  return data;
};

export const getUser = async (id: number): Promise<User> => {
  const { data } = await api.get<User>(`/users/${id}`);
  return data;
};

export const getAlbums = async (): Promise<Album[]> => {
  const { data } = await api.get<Album[]>('/albums');
  return data;
};

export const getAlbum = async (id: number): Promise<Album> => {
  const { data } = await api.get<Album>(`/albums/${id}`);
  return data;
};

export const getAlbumPhotos = async (albumId: number): Promise<Photo[]> => {
  const { data } = await api.get<Photo[]>(`/albums/${albumId}/photos`);
  return data;
};

export const getUserAlbums = async (userId: number): Promise<Album[]> => {
  const { data } = await api.get<Album[]>(`/users/${userId}/albums`);
  return data;
};

export const getAvatarUrl = (name: string, size: number = 40): string => {
  return `${AVATAR_URL}/?name=${encodeURIComponent(name)}&size=${size}&background=random`;
}; 