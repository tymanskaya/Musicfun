import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { toast } from 'react-toastify'
import { isErrorWithMessage } from '@/common/hooks/isErrorWithMessage.ts'
import { isErrorWithError } from '@/common/hooks'


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
  baseQuery:async (args, api, extraOptions)=>{
    await new Promise(resolve => setTimeout(resolve, 2000))
    //искусственная задержка все запросы будут улетать с задержкой 2000
    const result = await fetchBaseQuery({
      baseUrl: import.meta.env.VITE_BASE_URL,
      headers: {
        'API-KEY': import.meta.env.VITE_API_KEY,
      },
      prepareHeaders: headers => {
        headers.set('Authorization', `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`)
        return headers
      },
    })(args, api, extraOptions)
    if(result.error){
      switch (result.error.status){
        case 'TIMEOUT_ERROR':
          toast(result.error.error)
          break
        case 404:
          if (isErrorWithError(result.error.data)) {
            //if (isErrorWithProperty(result.error.data, error)) {-если использовать дженериковую функцию
            //проверяем или в ошибке есть data
            toast(result.error.data.error, { type: 'error', theme: 'colored' })
          } else {
            //если нет data
            toast(JSON.stringify(result.error.data), { type: 'error', theme: 'colored' })
          }
          break
        case 429:
          // ✅ 1. Type Assertions
          // toast((result.error.data as { message: string }).message, { type: 'error', theme: 'colored' })
          // ✅ 2. JSON.stringify
          // toast(JSON.stringify(result.error.data), { type: 'error', theme: 'colored' })
          // ✅ 3. Type Predicate
          if (isErrorWithMessage(result.error.data)) {
            //проверяем или в ошибке есть data
            toast(result.error.data.message, { type: 'error', theme: 'colored' })
          } else {
            //если нет data
            toast(JSON.stringify(result.error.data), { type: 'error', theme: 'colored' })
          }
          break
        default:
          toast('Some error occurred', { type: 'error', theme: 'colored' })
      }
    }
    return result
  },
  endpoints: () => ({}),
})