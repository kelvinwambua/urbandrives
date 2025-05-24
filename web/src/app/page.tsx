import Link from "next/link";
import Header from "./Header";
import HowItWorks from "./HowItWorks";
import WhyChooseUs from "./WhyChooseUs";
import Footer from "~/components/Footer";



export default function HomePage() {
	return (
	<main>
		  <Header />
		  <HowItWorks/>
		    <WhyChooseUs />
			<Footer/>
	</main>
	);
}
