import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { jwt } from "better-auth/plugins";
 // your drizzle instance
import {db} from "~/index"; // Adjust the import according to your project structure
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "mysql", // or "mysql", "sqlite"
    }),
    emailAndPassword: {  
        enabled: true
    },
     socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
    plugins: [ 
        jwt(), 
    ],
    trustedOrigins  :[
        "http://localhost:3000", 
        "https://urbandrives.vercel.app", 
    ]
        
});