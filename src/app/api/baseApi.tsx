import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const baseApi = createApi({
  reducerPath: 'baseApi',
  keepUnusedDataFor: 5,
  //управление временем удалением из кэша, можно для определенного эдпоинда делать
  tagTypes: ['Playlist'],
  refetchOnFocus: true,
  //Возвращение во вкладку: Если пользователь переключился на другую вкладку или приложение,
  // а затем вернулся, система автоматически проверит, не устарели ли данные, и обновит их в фоновом режиме.
  // Синхронизация состояния: Если данные на сервере могли измениться за время отсутствия
  // пользователя (например, курс валют, список сообщений или статус заказа),
  // фоновое обновление подтянет свежую информацию.
  // Улучшение UX: Создает ощущение «живого» приложения,
  // где информация всегда актуальна без лишних кликов на кнопку «Обновить».
  refetchOnReconnect: true,
  //когда прервалось интернет-соединение, а мы что-то изменяли, данные автоматом обновятся
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    headers: {
      'API-KEY': import.meta.env.VITE_API_KEY,
    },
    prepareHeaders: headers => {
      headers.set('Authorization', `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`)
      return headers
    },
  }),
  endpoints: () => ({}),
})