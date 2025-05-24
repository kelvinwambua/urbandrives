import "~/styles/globals.css";
import type { Metadata } from "next";
import { Geist, Poltawski_Nowy } from "next/font/google";
import { PostHogProvider } from "~/components/PostHogProvider";
import Navbar from "~/components/Navbar";

export const metadata: Metadata = {
	title: "Urban Drives",
	description: "Car Rentals on the fly",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};



const poltawskiNowy = Poltawski_Nowy({
	subsets: ["latin"],
	variable: "--font-poltawski-nowy",
	weight: ["400", "500", "600", "700"],
	style: ["normal", "italic"],
});

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={` ${poltawskiNowy.variable}`}>
			<body>
				<PostHogProvider>
					<Navbar />
					{children}
				</PostHogProvider>
			</body>
		</html>
	);
}