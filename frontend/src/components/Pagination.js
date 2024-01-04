import React from 'react';
import { Link } from 'react-router-dom';

const Pagination = ({ itemsPerPage, totalItems, currentPage, location }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className="mt-4">
            <ul className="flex justify-center">
                {pageNumbers.map((number) => (
                    <li key={number}>
                        <Link
                            to={`${location.pathname}/${number}`}
                            className={`px-4 py-2 mx-2 border border-gray-400 rounded ${number === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-100'
                                }`}
                        >
                            {number}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Pagination;
