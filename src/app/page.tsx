import { HomePage } from 'components'
import { getSiteContent } from 'sanity'

const Page = async () => {
  const content = await getSiteContent()

  return <HomePage {...content} />
}

export default Page
