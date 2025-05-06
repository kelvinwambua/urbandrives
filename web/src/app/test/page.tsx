export default async function Page() {
    const data = await fetch('http://localhost:8081/hell')
    const posts = await data.json()
    return (
        <div>
            {posts.message}
        </div>
    )
  }