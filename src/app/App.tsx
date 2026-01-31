import { Routing } from '@/common/routing/routing.tsx'
import { Header } from '@/common/componets/Header/Header.tsx'
import s from './App.module.css'

export const App = () => {
  return (
    <>
      <Header />
      <div className={s.layout}>
        <Routing />
      </div>
    </>
  )
}