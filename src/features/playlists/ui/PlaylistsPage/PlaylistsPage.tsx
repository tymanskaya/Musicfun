
import s from './PlaylistsPage.module.css'

import { CreatePlaylistForm } from '@/features/playlists/ui/PlaylistsPage/CreatePlaylistForm'

import { useFetchPlaylistsQuery } from '@/features/playlists/api/playlistsApi.ts'

import { type ChangeEvent, useState } from 'react'
import { useDebounceValue } from '@/common/hooks'
import { Pagination } from '@/common/componets'
import { PlaylistsList } from '@/features/playlists/ui/PlaylistsPage/PlaylistsList/PlaylistsList.tsx'
import { PlaylistSkeleton} from '@/features/playlists/ui/PlaylistsPage/PlaylistSkeleton.tsx'

export const PlaylistsPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(2)

  const [search, setSearch] = useState('')
  const debounceSearch = useDebounceValue(search)

  const { data, isLoading} = useFetchPlaylistsQuery({
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

