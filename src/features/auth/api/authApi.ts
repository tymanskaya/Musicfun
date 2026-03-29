import { baseApi } from '@/app/api/baseApi.tsx'
import type { LoginArgs, LoginResponse, MeResponse } from '@/features/auth/api/authApi.types.ts'
import { AUTH_KEYS } from '@/common/constants'
import { withZodCatch } from '@/common/utils'
import { LoginResponseSchema, meResponseSchema } from '@/features/auth/model/auth.schemas.ts'



export const authApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getMe: build.query<MeResponse, void>({
      query: () => `auth/me`,
      ...withZodCatch(meResponseSchema),
      providesTags: ['Auth']
    }),
    login: build.mutation<LoginResponse, LoginArgs>({
      query: payload => ({
        url: `auth/login`,
        method: 'post',
        body: { ...payload, accessTokenTTL: '10m' },
        //accessTokenTTL: '10m' - время сколько живет accessToken, по истечению будет реавторизауия. будет отправлен рефрештокен,
        //который вернет новый accessToken
      }),
      onQueryStarted: async (_args, {dispatch, queryFulfilled})=>{

        try {
          //прежде чем залогиниться мы попадем сюда, сделаем запрос на сервер
          const res = await queryFulfilled

          //в res мы получим refreshToken, accessToken
          //теперь нум нужно refreshToken, accessToken полжить в localStorage
          localStorage.setItem(AUTH_KEYS.accessToken, res.data.accessToken)
          localStorage.setItem(AUTH_KEYS.refreshToken, res.data.refreshToken)

          dispatch(authApi.util.invalidateTags(['Auth']))
        }
        catch (error) {
          // Здесь можно обработать ошибку логина, чтобы приложение не зависло

          console.error('Login failed:', error)
        }


},
        ...withZodCatch(LoginResponseSchema),
    }

      ),
    logout: build.mutation<void, void>({
      query: () => {
        const refreshToken = localStorage.getItem(AUTH_KEYS.refreshToken)
        return { url: 'auth/logout', method: 'post', body: { refreshToken } }
      },
      async onQueryStarted(_args, { queryFulfilled, dispatch }) {
        await queryFulfilled
        //после запроса удаляем данные из localStorage
        localStorage.removeItem(AUTH_KEYS.accessToken)
        localStorage.removeItem(AUTH_KEYS.refreshToken)
        dispatch(baseApi.util.resetApiState())
        //resetApiState сбрасывает состояние всего API slice, включая кэш запросов и треки и плейлисты
      },
    }),
  }),
})

export const { useGetMeQuery, useLoginMutation, useLogoutMutation } = authApi