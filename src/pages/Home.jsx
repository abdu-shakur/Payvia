import HeroSection from '../components/HeroSection'
import Footer from '../components/Footer'
// import Testimonial from '../components/Testimonial';

function Home(){
    return (
        <div className="all">
            <div className="mb-5 pb-36 bg-secondary">
                <div className="mb-3 p-16 text-center">
                    <h2 className="text-primary text-3xl font-medium">Effortless payments <br />for the modern economy</h2>
                    <p className="text-text my-6 font-light">
                        The Payvia wallet enables your business to send, receive, <br/> and manage funds seamlessly across borders.
                    </p>
                    <button className="bg-primary px-6 py-2 m-6 rounded-full text-white hover:bg-blue-600 transition duration-300">
                        <a href="/signup">Get Started Today</a>
                    </button>
                </div>
                {/* Hero Image/Video: Happy person using Payvia on mobile */}
            </div>
            {/* <HeroSection/> */}
            {/* <Testimonial/> */}
            <Footer />    
        </div>
    ); 
}
export default Home;
