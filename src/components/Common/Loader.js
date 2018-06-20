import React from 'react';
import loader from '../../images/loader.gif'

const Loader = () => (
    <div className="text-center loader">
        <img src={loader} height={100} width={100} alt="loader"/>
    </div>
)

export default Loader;
