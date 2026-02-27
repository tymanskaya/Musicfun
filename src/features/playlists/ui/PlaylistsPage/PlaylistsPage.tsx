
import s from './PlaylistsPage.module.css'

import { CreatePlaylistForm } from '@/features/playlists/ui/PlaylistsPage/CreatePlaylistForm'

import { useFetchPlaylistsQuery } from '@/features/playlists/api/playlistsApi.ts'

import { type ChangeEvent, useEffect, useState } from 'react'
import { useDebounceValue } from '@/common/hooks'
import { Pagination } from '@/common/componets'
import { PlaylistsList } from '@/features/playlists/ui/PlaylistsPage/PlaylistsList/PlaylistsList.tsx'
import { PlaylistSkeleton} from '@/features/playlists/ui/PlaylistsPage/PlaylistSkeleton.tsx'
import { toast } from 'react-toastify'

export const PlaylistsPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(2)

  const [search, setSearch] = useState('')
  const debounceSearch = useDebounceValue(search)

  const { data, isLoading, error} = useFetchPlaylistsQuery({
    search: debounceSearch,
    pageNumber: currentPage,
    pageSize,
  }, {refetchOnFocus: true, refetchOnReconnect: true,
    skipPollingIfUnfocused: true,})


//refetchOnFocus: true автомотическое обновление данных именно для этого эдпоинта
  //pollingInterval: 3000- автоматически через 3000 уйдет запрос за обновлением данных
  //skipPollingIfUnfocused-не делать запросы, когда перехожу в другую вкладку
  const changePageSizeHandler = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  const searchPlaylistHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value)
    setCurrentPage(1)
  }
  useEffect(() => {
    if (error) {
      if ('status' in error) {
        //проверяем есть ли свойство статус в ошибке  и это будет FetchBaseQueryError
        //так как есть свойство статус
        const errMsg = 'error' in error ? error.error : ((error.data as {error: string}).error ||
          (error.data as {message: string}).message|| 'Something went wrong')
        //  const errMsg = 'error' in error ? error.error : ((error.data as {error: string}).error ||
        //  (error.data as {message: string}).message|| 'Something went wrong')
        // as  не безопасен! так как, если измнится название свойства, то мы не сможем найти
        toast(errMsg, { type: 'error', theme: 'colored' })
      } else {
        // SerializedError
        const errMsg = error.message || 'Something went wrong'
        toast(errMsg, { type: 'error', theme: 'colored' })

      }
      // toast(error.data.error, { type: 'error', theme: 'colored' })
    }
  }, [error])

  if (isLoading) return <PlaylistSkeleton/>
  return (
    <div className={s.container}>
      <h1>Playlists page</h1>
      <CreatePlaylistForm setPage={setCurrentPage}/>
      <input
        type="search"
        placeholder={'Search playlist by title'}
        onChange={searchPlaylistHandler}
      />
      <PlaylistsList playlists={data?.data || []} isPlaylistsLoading={isLoading} />
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pagesCount={data?.meta.pagesCount || 1}
        pageSize={pageSize}
        changePageSize={changePageSizeHandler}
      />
    </div>
  )
}

