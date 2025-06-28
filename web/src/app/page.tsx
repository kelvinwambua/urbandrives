import Link from "next/link";
import Header from "./Header";
import HowItWorks from "./HowItWorks";
import WhyChooseUs from "./WhyChooseUs";
import Footer from "~/components/Footer";



export default function HomePage() {
	return (
	<main>
		 <div id="rental-deals" >
				  <Header />
		 </div>
	
		  <div id="how-it-works" >
			 <HowItWorks/>
		  </div>
		  <div id="why-choose-us" >
			   <WhyChooseUs />
		  </div>
		 
		 
			<Footer/>
	</main>
	);
}
