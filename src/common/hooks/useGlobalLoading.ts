
import { useSelector } from 'react-redux'
import type { RootState } from '@/app/model/store.ts'
import { playlistsApi } from '@/features/playlists/api/playlistsApi.ts'
import { tracksApi } from '@/features/tracks/api/tracksApi.ts'

const excludedEndpoints = [
  playlistsApi.endpoints.fetchPlaylists.name,
  tracksApi.endpoints.fetchTracks.name,
]
//Плюсы такого подхода:
// Type Safety -- TypeScript проверит, что endpoint существует 🚀
// Refactoring Safety -- если переименуете endpoint, изменения подтянутся автоматически 🚀
// Читаемость -- сразу понятно, какой именно endpoint исключается


export const useGlobalLoading = () => {
  return useSelector((state: RootState) => {
    // Получаем все активные запросы из RTK Query API
    const queries = Object.values(state.baseApi.queries || {})
    const mutations = Object.values(state.baseApi.mutations || {})
    // Object.values - достаем значения

    // Проверяем, есть ли активные запросы (статус 'pending')
    const hasActiveQueries = queries.some(query => {
      if (query?.status !== 'pending') return
      if (excludedEndpoints.includes(query.endpointName)) {
        const completedQueries = queries.filter(q => q?.status === 'fulfilled')
        return completedQueries.length > 0
      }
    })
    const hasActiveMutations = mutations.some(mutation => mutation?.status === 'pending')

    return hasActiveQueries || hasActiveMutations
  })
}