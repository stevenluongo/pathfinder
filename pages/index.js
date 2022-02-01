import Layout from '../components/layout'
import { GlobalContextProvider } from '../context/global-context'

export default function Home() {
  return (
    <GlobalContextProvider>
      <Layout/>
    </GlobalContextProvider>
  )
}
