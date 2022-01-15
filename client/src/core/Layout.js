import React from 'react';
import Menu from './Menu';
import "../styles.css"
import Footer from './Footer';

const Layout = ({ title = "Title", description = "Description", className, children }) => {
    return (
        <div>
            <Menu />
            <div className="mt-0 title-desc">
                <div className="ms-2">
                    <h2>
                        {title}
                    </h2>
                    <p className="lead">
                        {description}
                    </p>
                    <br />
                </div>
            </div>
            <div className={className}>
                {children}
            </div>
            <Footer />
        </div>

    )
}


export default Layout;