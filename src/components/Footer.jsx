
function Footer(){
    return(
        <footer className="p-3 bg-stone-100">
            <div className=" sm:flex text-left sm:text-justify sm:justify-around text-base my-3">
                <div className="hidden sm:block">
                    <h2 className="text-primary">About PayVia</h2>
                    Lorem, ipsum dolor sit amet <br/>consectetur adipisicing elit. Vero<br/> ipsam,</div>
                <div className=" pb-3 sm:pb-0">
                    <h2 className="text-primary">Quick Links</h2>
                    <a className="block" href="">About Us</a>
                    <a className="block" href="">privacy policy</a>
                    <a className="block" href="">Terms of Service</a>
                </div>
                <div className="hidden sm:block">
                    <h2 className="text-primary">Contact Us</h2>
                    <p>
                        Lorem ipsum dolor sit amet <br/>consectetur adipisicing elit.<br/> Neque obcaecati ullam ea atque 
                    </p>
                </div>
                <div className="">
                    <h2 className="text-primary">Follow Us</h2>
                    <p>Facebook</p>
                    <p>Twitter</p>
                    <p>Instagram</p>
                    </div>
            </div> 
            <hr/>
            <div className="text-center text-text text-sm pt-3 pb-1">
                &copy; 2024 Payvia, All right Reserved
            </div>
        </footer>
    )
        
        
}
export default Footer;