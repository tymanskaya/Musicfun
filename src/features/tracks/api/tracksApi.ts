import { baseApi } from '@/app/api/baseApi.tsx'
import type { FetchTracksResponse } from '@/features/tracks/api/tracksApi.types.ts'


export const tracksApi = baseApi.injectEndpoints({
  endpoints: build => ({
    fetchTracks: build.infiniteQuery<FetchTracksResponse, void, string | undefined>({
      //FetchTracksResponse - Описывает структуру данных, которую возвращает сервер за один запрос (одна страница).
      //void: Тип аргумента, который ты передаешь в хук (например, ID плейлиста). Если параметров нет, пишем void.
      //string | undefined: Тип самого курсора (pageParam). В твоем случае это строка, которая приходит с бэкенда.
      infiniteQueryOptions: {
        initialPageParam: undefined,
        //Значение, которое будет использовано для самого первого запроса, когда приложение только открылось.
        getNextPageParam: lastPage => {
          //Функция-селектор. Она вызывается каждый раз, когда сервер прислал данные.
          return lastPage.meta.nextCursor || undefined

        },
      },
      query: ({ pageParam }) => {
        return {
          url: 'playlists/tracks',
          params: { cursor: pageParam, pageSize: 5, paginationType: 'cursor' },
        }
      },
    }),
  }),
})
export const { useFetchTracksInfiniteQuery } = tracksApi