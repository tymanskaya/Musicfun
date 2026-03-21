import { useLoginMutation } from '@/features/auth/api/authApi.ts'

export const Login = () => {

  const [login]=useLoginMutation()

  const loginHandler=()=>{
    login({ code: '', redirectUri: '', rememberMe: false })
  }

  return (
    <button type={'submit'} onClick={loginHandler}>Login</button>
  )
}