
import type {
  CreatePlaylistArgs, FetchPlaylistsArgs,
  PlaylistData,
  PlaylistsResponse, UpdatePlaylistArgs,
} from '@/features/playlists/api/playlistsApi.types.ts'
import { baseApi } from '@/app/api/baseApi.tsx'
import type { Images } from '@/common/types'

// `createApi` - функция из `RTK Query`, позволяющая создать объект `API`
// для взаимодействия с внешними `API` и управления состоянием приложения
export const playlistsApi = baseApi.injectEndpoints({
  // `endpoints` - метод, возвращающий объект с эндпоинтами для `API`, описанными
  // с помощью функций, которые будут вызываться при вызове соответствующих методов `API`
  // (например `get`, `post`, `put`, `patch`, `delete`)
  endpoints: build => ({
    fetchPlaylists: build.query<PlaylistsResponse, FetchPlaylistsArgs>({
      //FetchPlaylistsArgs - аргументы которые можно передавать при запросе
      //если один только параметр то вместо FetchPlaylistsArgs пишем {search: string}
      //а в url: `playlists?search=${search}`,
      query: (params) => {
        //params - входящие параметры
        return {
          url: `playlists`,
          params
          //передаем на сервер, чтобы оттуда вернулись треки, которые удовлетворяют введенным параметрам
        } },

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
    uploadPlaylistCover: build.mutation<Images, { playlistId: string; file: File }>({
      query: ({ playlistId, file }) => {
        const formData = new FormData()
        //new FormData чтобы передавать какие-то файлы(в нашем случае картинку) на сервер
        formData.append('file', file)
        //formData.append длбавляет одно значение
        //'file' - это ждет бекенд (смотрим в документации
        return {
          url: `playlists/${playlistId}/images/main`,
          method: 'post',
          body: formData,
        }
      },
      invalidatesTags: ['Playlist'],
    }),
    deletePlaylistCover: build.mutation<void, { playlistId: string }>({
      query: ({ playlistId }) => ({ url: `playlists/${playlistId}/images/main`, method: 'delete' }),
      invalidatesTags: ['Playlist'],
    }),
  }),
})

// `createApi` создает объект `API`, который содержит все эндпоинты в виде хуков,
// определенные в свойстве `endpoints`
export const { useFetchPlaylistsQuery,
  useCreatePlaylistMutation,
  useDeletePlaylistMutation,
  useUpdatePlaylistMutation,
  useUploadPlaylistCoverMutation,
useDeletePlaylistCoverMutation} = playlistsApi
