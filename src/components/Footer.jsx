function Footer() {
    return (
        <footer className="p-6 bg-gray-800 text-secondary">
            <div className="sm:flex sm:justify-around text-base text-center sm:text-left my-6">
                <div className="mb-6 sm:mb-0">
                    <h2 className="text-primary font-semibold mb-2">About PayVia</h2>
                    <p className="text-gray-400">
                        Payvia is committed to providing seamless <br />transactions for businesses globally.
                    </p>
                </div>
                <div className="mb-6 sm:mb-0">
                    <h2 className="text-primary font-semibold mb-2">Quick Links</h2>
                    <a className="block text-gray-400 hover:text-primary transition duration-300" href="#">About Us</a>
                    <a className="block text-gray-400 hover:text-primary transition duration-300" href="#">Privacy Policy</a>
                    <a className="block text-gray-400 hover:text-primary transition duration-300" href="#">Terms of Service</a>
                </div>
                <div className="mb-6 sm:mb-0">
                    <h2 className="text-primary font-semibold mb-2">Contact Us</h2>
                    <p className="text-gray-400">
                        Reach out to us for support or questions. <br />We are here to help your business thrive.
                    </p>
                </div>
                <div>
                    <h2 className="text-primary font-semibold mb-2">Follow Us</h2>
                    <p className="text-gray-400 hover:text-primary cursor-pointer">Facebook</p>
                    <p className="text-gray-400 hover:text-primary cursor-pointer">Twitter</p>
                    <p className="text-gray-400 hover:text-primary cursor-pointer">Instagram</p>
                </div>
            </div>
            <hr className="border-gray-700"/>
            <div className="text-center pt-3 text-gray-400">
                &copy; 2024 Payvia, All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;
