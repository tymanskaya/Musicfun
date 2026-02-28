import type { Images } from '@/common/types'
import defaultCovers from '@/assets/images/default-playlist-cover.png'
import s from './PlaylistCover.module.css'
import {
  useDeletePlaylistCoverMutation,
  useUploadPlaylistCoverMutation,
} from '@/features/playlists/api/playlistsApi.ts'
import type { ChangeEvent } from 'react'
import { errorToast } from '@/common/utils'

type Props = {
  playlistId: string
  images: Images
}

export const PlaylistCover = ({ images, playlistId }: Props) => {
  const originalCover = images.main?.find(img => img.type === 'original')
  //здесь мы достаем загрузившуюся картинку с сервера(чтобы обновить наше фото плейлиста), используем метод массива,
  //так как с сервера приходит массив с 3 размерами картинок и нам нужен именно размер "original"
  const src = originalCover ? originalCover?.url : defaultCovers
  //тут мы говоримБ что будем отображать картинку с сервера(достаем ее адресс), а если ее нет, то дефолтную картинку
  const [uploadCover] = useUploadPlaylistCoverMutation()
  const [deleteCover] = useDeletePlaylistCoverMutation()

  const uploadCoverHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const maxSize = 1024 * 1024 // 1 MB
    //максимальный размер
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
    //разрешенные форматы для загрузки

    const file = event.target.files?.length && event.target.files[0]
    //достаем файл который мы загрузили
    // event.target.files?-путь где находится файл, знаком? проверяем длину массива, чтобы не было undefined
    //&& event.target.files[0]- достаем первый элемент массива (непосредственно нашу картинку,
    //которую мы загрузили
    if (!file) return //Если файл не выбран (отсутствует),
    // то немедленно прерви выполнение функции и ничего не делай дальше
    //!!Зачем это нужно?
    // Представьте, что у вас есть кнопка «Загрузить фото». Если пользователь нажал на неё, но передумал
    // и закрыл окно выбора файла, переменная file будет пустой.
    // Если в коде не будет этой строчки, программа попытается обработать пустоту
    // (например, отправить её на сервер), и приложение «упадёт» с ошибкой Cannot read property....

    if (!allowedTypes.includes(file.type)) {
      errorToast('Only JPEG, PNG or GIF images are allowed')
      //здесь мы проверяем или выбранное фото подходит типу разрешенному, если нет выскакивает окошко
      //toast-это наша всплывашка вместо алерта
    }

    if (file.size > maxSize) {
      errorToast(`The file is too large. Max size is ${Math.round(maxSize / 1024)} KB`)
      //проверяем на максимально допустимый размер
    }

    uploadCover({ playlistId, file })
    //непосредсвенно это передаем на сервер
  }

  const deleteCoverHandler = () => deleteCover({ playlistId })

  return (
    <div>
      <img src={src} alt={'cover'} width={'100px'} className={s.cover} />
      <input type="file" accept="image/jpeg,image/png,image/gif" onChange={uploadCoverHandler} />
      {/* кнопка, чтобы добавить файл  onChange={uploadCoverHandler} отработает когда нажмем*/}
      {/* accept="image/jpeg,image/png,image/gif" говорит какие форматы можно загружать,
      форматы, которые не подднрживает бекенд,
      даже отображаться не будут при выборе картинки при загрузке*/}
      {originalCover && <button onClick={() => deleteCoverHandler()}>delete cover</button>}
      {/*отображаем кнопку, если мы загрузили свою обложку*/}
    </div>
  )
}