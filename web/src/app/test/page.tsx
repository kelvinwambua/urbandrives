export default async function Page() {
 
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'https://urbandrives-6eb940e4a23c.herokuapp.com';
    const data = await fetch(`${apiUrl}/hello`);
    const posts = await data.json();
    
    return (
      <div>
        {posts.message}
      </div>
    );
  }