import { useGetMeQuery } from '@/features/auth/api/authApi.ts'
import { useFetchPlaylistsQuery } from '@/features/playlists/api/playlistsApi.ts'
import { PlaylistsList } from '@/features/playlists/ui/PlaylistsPage/PlaylistsList/PlaylistsList.tsx'
import { CreatePlaylistForm } from '@/features/playlists/ui/PlaylistsPage/CreatePlaylistForm'
import s from './ProfilePage.module.css'
import { Navigate } from 'react-router'
import { Path } from '@/common/routing/routing.tsx'

export const ProfilePage = () => {
  const { data: meResponse, isLoading: isMeLoading  } = useGetMeQuery()
  const { data: playlistsResponse, isLoading } = useFetchPlaylistsQuery({
    userId: meResponse?.userId,
  }, { skip: !meResponse?.userId })

  if (!isMeLoading && !meResponse) return <Navigate to={Path.Playlists} />
  if (isLoading || isMeLoading) return <h1>Skeleton loader...</h1>

  return (
    <div>
      <div className={s.container}>
        <h1>{meResponse?.login} page</h1>
        <CreatePlaylistForm />
      </div>

      <PlaylistsList playlists={playlistsResponse?.data || []} isPlaylistsLoading={isLoading || isMeLoading} />
    </div>
  )
}