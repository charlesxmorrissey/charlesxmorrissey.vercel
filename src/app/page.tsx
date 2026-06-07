import { HomePage } from 'components'
import { getPosts } from 'posts'
import { getSiteContent } from 'sanity'

const Page = async () => {
  const [content, posts] = await Promise.all([getSiteContent(), getPosts()])

  return <HomePage {...content} posts={posts.slice(0, 3)} />
}

export default Page
