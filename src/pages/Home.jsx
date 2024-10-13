import HeroSection from '../components/HeroSection'
// import Testimonial from '../components/Testimonial';
function Home(){
    return(
        <div className='mb-5'>
            <div className="mb-3 p-16 text-center bg-secondary">
                <h2 className='text-primary text-2xl font-medium'>Streamline your Payments</h2>
                <p className='text-text mt-1 font-light'>Secure, Easy and Efficient</p>
                <button className='bg-primary px-3 py-2 m-4 rounded-full text-neutral-50' onClick='/about'>Get Started</button>
            </div>``
            {/* Hero Image/Video: Happy person using Payvia on mobile */}
            <HeroSection/>
            {/* <Testimonial/> */}
        </div>
    );
}
export default Home;