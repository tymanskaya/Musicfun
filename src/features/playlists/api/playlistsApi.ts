
import type {
  CreatePlaylistArgs, FetchPlaylistsArgs,
  PlaylistData,
  PlaylistsResponse, UpdatePlaylistArgs,
} from '@/features/playlists/api/playlistsApi.types.ts'
import { baseApi } from '@/app/api/baseApi.tsx'
import type { Images } from '@/common/types'
import { playlistCreateResponseSchema, playlistsResponseSchema } from '@/features/playlists/model/playlists.schemas.ts'
import { errorToast, withZodCatch } from '@/common/utils'
import { imagesSchema } from '@/common/schemas'

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
      ...withZodCatch(playlistsResponseSchema),
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
      ...withZodCatch(playlistCreateResponseSchema),
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
      async onQueryStarted({ playlistId, body }, { dispatch, queryFulfilled, getState }) {
        //сюда мы сразу попадем
        //{ playlistId, body }- то что пришло в query запроса
        //{ dispatch, queryFulfilled } - методы которые есть у onQueryStarted
        const args = playlistsApi.util.selectCachedArgsForQuery(getState(), 'fetchPlaylists')
        const patchResults: any[] = []
        args.forEach(arg => {
          patchResults.push(
            dispatch(
              playlistsApi.util.updateQueryData(
                // название эндпоинта, в котором нужно обновить кэш
                'fetchPlaylists',
                // аргументы для эндпоинта
                {
                  pageNumber: arg.pageNumber,
                  pageSize: arg.pageSize,
                  search: arg.search,
                },
                state => {
                  //здесь мы изменяем данные в кэше
                  const index = state.data.findIndex(playlist => playlist.id === playlistId)
                  if (index !== -1) {
                    state.data[index].attributes = { ...state.data[index].attributes, ...body }
                  }
                }
              )
            )
          )
        })

        try {
          await queryFulfilled
        }
        catch {
          patchResults.forEach(patchResult => {
            patchResult.undo()
            //если что-то пойдет не так отменится обновление в кэше до первоночального состояния
          })
        }
      },
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
      ...withZodCatch(imagesSchema),
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
