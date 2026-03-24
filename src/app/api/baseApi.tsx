import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { handleErrors} from '@/common/utils'
import { AUTH_KEYS } from '@/common/constants'

export const baseApi = createApi({
  reducerPath: 'baseApi',
  keepUnusedDataFor: 5,
  //управление временем удалением из кэша, можно для определенного эдпоинда делать
  tagTypes: ['Playlist', 'Auth'],
  refetchOnFocus: false,
  //Возвращение во вкладку: Если пользователь переключился на другую вкладку или приложение,
  // а затем вернулся, система автоматически проверит, не устарели ли данные, и обновит их в фоновом режиме.
  // Синхронизация состояния: Если данные на сервере могли измениться за время отсутствия
  // пользователя (например, курс валют, список сообщений или статус заказа),
  // фоновое обновление подтянет свежую информацию.
  // Улучшение UX: Создает ощущение «живого» приложения,
  // где информация всегда актуальна без лишних кликов на кнопку «Обновить».
  refetchOnReconnect: false,
  //когда прервалось интернет-соединение, а мы что-то изменяли, данные автоматом обновятся
  baseQuery:async (args, api, extraOptions)=>{

    const result = await fetchBaseQuery({
      baseUrl: import.meta.env.VITE_BASE_URL,
      headers: {
        'API-KEY': import.meta.env.VITE_API_KEY,
      },
      prepareHeaders: headers => {
        const accessToken = localStorage.getItem(AUTH_KEYS.accessToken)
        if (accessToken) {
          headers.set('Authorization', `Bearer ${accessToken}`)
        }
        return headers
      },
    })(args, api, extraOptions)
    if (result.error) {
      handleErrors(result.error)
    }
    return result
  },
  endpoints: () => ({}),
})