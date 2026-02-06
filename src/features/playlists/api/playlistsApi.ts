
import type {
  CreatePlaylistArgs,
  PlaylistData,
  PlaylistsResponse, UpdatePlaylistArgs,
} from '@/features/playlists/api/playlistsApi.types.ts'
import { baseApi } from '@/app/api/baseApi.tsx'

// `createApi` - функция из `RTK Query`, позволяющая создать объект `API`
// для взаимодействия с внешними `API` и управления состоянием приложения
export const playlistsApi = baseApi.injectEndpoints({
  // `endpoints` - метод, возвращающий объект с эндпоинтами для `API`, описанными
  // с помощью функций, которые будут вызываться при вызове соответствующих методов `API`
  // (например `get`, `post`, `put`, `patch`, `delete`)
  endpoints: build => ({
    fetchPlaylists: build.query<PlaylistsResponse, void>({
      query: () => ({ url: `playlists` }),
      providesTags: ['Playlist'],
    }),
    createPlaylist: build.mutation<{ data: PlaylistData }, CreatePlaylistArgs>({
      // Оборачиваем плоский объект из формы в структуру JSON:API
      query: (args) => ({
        url: 'playlists',
        method: 'POST',
        body: {
          data: {
            type: 'playlists',
            attributes: { ...args }
          }
        }
      }),
      invalidatesTags: ['Playlist'],
    }),

    updatePlaylist: build.mutation<void, { playlistId: string; body: UpdatePlaylistArgs }>({
      // Здесь тоже нужна обертка + поле ID внутри data
      query: ({ playlistId, body }) => ({
        url: `playlists/${playlistId}`,
        method: 'PUT',
        body: {
          data: {
            id: playlistId,
            type: 'playlists',
            attributes: { ...body }
          }
        }
      }),
      invalidatesTags: ['Playlist'],
    }),
    deletePlaylist: build.mutation<void, string>({
      query: playlistId => ({ url: `playlists/${playlistId}`, method: 'delete' }),
      invalidatesTags: ['Playlist'],
    }),

  }),
})

// `createApi` создает объект `API`, который содержит все эндпоинты в виде хуков,
// определенные в свойстве `endpoints`
export const { useFetchPlaylistsQuery, useCreatePlaylistMutation, useDeletePlaylistMutation, useUpdatePlaylistMutation } = playlistsApi
