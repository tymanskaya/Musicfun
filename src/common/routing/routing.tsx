import { Route, Routes } from 'react-router'
import { MainPage } from '@/app/MainPage.tsx'

import { PageNotFound } from '@/common/componets'
import { ProfilePage } from '@/features/auth/ui/ProfilePage'
import { PlaylistsPage } from '@/features/playlists/ui/PlaylistsPage'
import { TracksPage } from '@/features/tracks/ui/TracksPage'


export const Path = {
  Main: '/',
  Playlists: '/playlists',
  Tracks: '/tracks',
  Profile: '/profile',
  NotFound: '*',
} as const

export const Routing = () => (
  <Routes>
    <Route path={Path.Main} element={<MainPage />} />
    <Route path={Path.Playlists} element={<PlaylistsPage />} />
    <Route path={Path.Tracks} element={<TracksPage />} />
    <Route path={Path.Profile} element={<ProfilePage />} />
    <Route path={Path.NotFound} element={<PageNotFound />} />
  </Routes>
)