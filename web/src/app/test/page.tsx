"use client";
import { authClient } from "~/lib/auth-client";

export default function Page() {
 
    // // const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'https://urbandrives-6eb940e4a23c.herokuapp.com';
    // const data = await fetch(`${apiUrl}/hello`);
    // const posts = await data.json();
    
  function handleClick() {
    authClient.useSession()
  }

    return (
      <div>
        {/* {posts.message} */}
        <button className="btn btn-primary " onClick={handleClick}>Test</button>
      </div>
    );
  }