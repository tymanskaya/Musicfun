import { type SubmitHandler, useForm } from 'react-hook-form'
import type { CreatePlaylistArgs } from '@/features/playlists/api/playlistsApi.types.ts'
import { useCreatePlaylistMutation } from '@/features/playlists/api/playlistsApi.ts'

type Props = {
  setPage: (page: number) => void
}

export const CreatePlaylistForm = ({setPage}: Props) => {
  const { register, handleSubmit, reset } = useForm<CreatePlaylistArgs>()

  const [createPlaylist] = useCreatePlaylistMutation()

  const onSubmit: SubmitHandler<CreatePlaylistArgs> = data => {
    createPlaylist(data)
      .unwrap().then(() => {
        setPage(1)
      reset()
    })
  }
//unwrap попаду в then только в успешном кейсе
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Create new playlist</h2>
      <div>
        <input {...register('title')} placeholder={'title'} />
      </div>
      <div>
        <input {...register('description')} placeholder={'description'} />
      </div>
      <button>create playlist</button>
    </form>
  )
}