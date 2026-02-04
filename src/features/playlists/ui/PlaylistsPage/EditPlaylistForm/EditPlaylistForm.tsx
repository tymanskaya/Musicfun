import { useUpdatePlaylistMutation } from '@/features/playlists/api/playlistsApi.ts'
import type { SubmitHandler, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'
import type { UpdatePlaylistArgs } from '@/features/playlists/api/playlistsApi.types.ts'

type Props = {
  playlistId: string
  register: UseFormRegister<UpdatePlaylistArgs>
  handleSubmit: UseFormHandleSubmit<UpdatePlaylistArgs>
  editPlaylist: (playlist: null) => void
  setPlaylistId: (playlistId: null) => void
}

export const EditPlaylistForm = ({
                                   playlistId,
                                   handleSubmit,
                                   register,
                                   editPlaylist,
                                   setPlaylistId,
                                 }: Props) => {
  const [updatePlaylist] = useUpdatePlaylistMutation()

  const onSubmit: SubmitHandler<UpdatePlaylistArgs> = (formData) => {
    if (!playlistId) return;

    const wrappedBody = {
      data: {
        type: 'playlists', // Добавляем этот обязательный тип
        attributes: {
          ...formData // ваши title, и т.д.
        }
      }
    };

    updatePlaylist({ playlistId, body: wrappedBody as any }).then(() => {
      setPlaylistId(null);
    });
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Edit playlist</h2>
      <div>
        <input {...register('title')} placeholder={'title'} />
      </div>
      <div>
        <input {...register('description')} placeholder={'description'} />
      </div>
      <button type={'submit'}>save</button>
      <button type={'button'} onClick={() => editPlaylist(null)}>
        cancel
      </button>
    </form>
  )
}