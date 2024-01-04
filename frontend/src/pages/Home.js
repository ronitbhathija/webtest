import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function Home() {
    const [meals, setMeals] = useState([]);
    const [labels, setLabels] = useState([]);
    const location = useLocation();
    const seatNumber = location.state?.seatNumber
    const [selectedLabels, setSelectedLabels] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const [cart, setCart] = useState({});
    const perPage = 3;

    useEffect(() => {
        // Fetch data from your API
        fetch('http://localhost:4000/api/v1/getdata')
            .then((response) => response.json())
            .then((data) => {
                setMeals(data.data.meals);
                setLabels(data.data.labels);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const handleLabelClick = (labelId) => {
        // Toggle the selected state of the label
        setSelectedLabels((prevLabels) => {
            if (prevLabels.includes(labelId)) {
                // Remove the label if already selected
                return prevLabels.filter((id) => id !== labelId);
            } else {
                // Add the label if not selected
                return [...prevLabels, labelId];
            }
        });
    };

    const handleDecreaseQuantity = (meal) => {
        setCart((prevCart) => {
            const newCart = { ...prevCart };

            // Check if the meal is in the cart
            if (newCart[meal.id] && newCart[meal.id].quantity > 0) {
                // Check if there is a selected drink
                if (newCart[meal.id].drink) {
                    // Subtract the drink price from the total price
                    setTotalPrice((prevTotalPrice) => prevTotalPrice - newCart[meal.id].drink.price);

                    // Unselect the drink
                    newCart[meal.id].drink = null;
                }

                // Decrease the quantity
                newCart[meal.id].quantity -= 1;

                // Subtract the meal price from the total price
                setTotalPrice((prevTotalPrice) => prevTotalPrice - meal.price);

                // Remove the meal from the cart if the quantity becomes 0
                if (newCart[meal.id].quantity === 0) {
                    delete newCart[meal.id];
                }
            }

            return { ...newCart }; // Ensure returning a new object to trigger a re-render
        });
    };




    const handleIncreaseQuantity = (item) => {
        setCart((prevCart) => {
            const newCart = { ...prevCart };
            if (!newCart[item.id]) {
                newCart[item.id] = { quantity: 0 };
            }
            newCart[item.id].quantity += 1;
            setTotalPrice((prevTotalPrice) => prevTotalPrice + item.price);
            return { ...newCart }; // Ensure returning a new object to trigger a re-render
        });
    };

    const handleDrinkClick = (meal, drink) => {
        setCart((prevCart) => {
            const newCart = { ...prevCart };

            // Check if the meal is already in the cart
            if (!newCart[meal.id]) {
                console.error("Cannot add or remove drink without selecting the meal.");
                return { ...newCart };
            }

            // Check if the selected drink is already present
            if (newCart[meal.id].drink && newCart[meal.id].drink.id === drink.id) {
                // Drink is already selected, remove it
                newCart[meal.id].drink = null;

                // Update the total price
                setTotalPrice((prevTotalPrice) => prevTotalPrice - drink.price);
            } else {
                // Add or update the drink for the selected meal
                newCart[meal.id].drink = drink;

                // Update the total price
                setTotalPrice((prevTotalPrice) => prevTotalPrice + drink.price);
            }

            return { ...newCart }; // Ensure returning a new object to trigger a re-render
        });
    };

    const handleLogout = () => {
        // Redirect to the home page
        window.location.href = '/';
    };

    const handlePlaceOrder = async () => {
        try {
            // Make the API call to place the order
            const response = await fetch('http://localhost:4000/api/v1/placeorder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    seatNumber,
                    cart,
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Order placed successfully, you can redirect or show a success message
                alert('Order placed successfully');
            } else {
                // Handle the case where the order placement failed
                alert('Error placing order');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Error placing order');
        }
    };



    const filteredMeals = selectedLabels.length
        ? meals.filter((meal) => selectedLabels.every((label) => meal.labels.includes(label)))
        : meals;

    const paginatedMeals = filteredMeals.slice((page - 1) * perPage, page * perPage);

    const totalPages = Math.ceil(filteredMeals.length / perPage);


    return (

        <div className="container mx-auto mt-8 flex justify-center">
            <div className="w-3/4 flex justify-center">
                {/* Left Half: Meal List and Filters */}
                <div className="w-3/4 pr-4">
                    <div className="flex space-x-2 mb-4">
                        {labels.map((label) => (
                            <button
                                key={label.id}
                                className={`bg-white text-blue-500 px-4 py-2 rounded border border-blue-500 focus:outline-none focus:shadow-outline ${selectedLabels.includes(label.id) ? 'bg-blue-500 text-white' : 'text-blue-500'
                                    }`}
                                onClick={() => handleLabelClick(label.id)}
                            >
                                {label.label}
                            </button>
                        ))}
                        <button
                            className="bg-white text-blue-500 px-4 py-2 rounded border border-blue-500 focus:outline-none focus:shadow-outline"
                            onClick={() => setSelectedLabels([])}
                        >
                            Clear Filters
                        </button>
                    </div>

                    <div className="flex flex-col">
                        {paginatedMeals.map((meal) => (
                            <div key={meal.id} className="w-full p-4 mb-4 bg-white border">
                                <div className="flex">
                                    <img src={meal.img} alt={meal.title} className="w-1/3 h-32 object-cover mr-4" />
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold mb-2">{meal.title}</h3>
                                        <p>Starter: {meal.starter}</p>
                                        <p>Desert: {meal.desert}</p>
                                        <p>Price: ${meal.price}</p>
                                        <div className="flex items-center mt-2">
                                            <button
                                                className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                                onClick={() => handleDecreaseQuantity(meal)}
                                            >
                                                -
                                            </button>
                                            <span className="text-xl">{cart[meal.id]?.quantity || 0}</span>
                                            <button
                                                className="bg-blue-500 text-white px-2 py-1 rounded ml-2"
                                                onClick={() => handleIncreaseQuantity(meal)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {meal.drinks && meal.drinks.length > 0 && (
                                    <div className="mt-2">
                                        <p className="font-bold">Drinks:</p>
                                        <div className="flex space-x-2">
                                            {meal.drinks.map((drink) => (
                                                <button
                                                    key={drink.id}
                                                    className={`bg-blue-500 text-white px-2 py-1 rounded mx-1 ${cart[meal.id]?.drink?.id === drink.id ? 'bg-yellow-500' : ''
                                                        }`}
                                                    onClick={() => handleDrinkClick(meal, drink)}
                                                >
                                                    {drink.title} (${drink.price.toFixed(2)})
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center mt-4">
                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                            <button
                                key={pageNumber}
                                className={`mx-2 px-4 py-2 rounded border border-blue-500 focus:outline-none focus:shadow-outline ${pageNumber === page ? 'bg-blue-500 text-white' : 'text-blue-500'
                                    }`}
                                onClick={() => setPage(pageNumber)}
                            >
                                {pageNumber}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-1/4 pl-4">
                {/* Right Half: Order Summary */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    <ul>
                        {Object.keys(cart).map((itemId) => {
                            const item = meals.find((m) => m.id === itemId) || meals.flatMap((m) => m.drinks).find((d) => d.id === itemId);
                            if (item) {
                                return (
                                    <li key={itemId} className="flex justify-between mb-2">
                                        <span>{item.title}</span>
                                        <span>Quantity: {cart[itemId].quantity}</span>
                                    </li>
                                );
                            }
                            return null;
                        })}
                    </ul>
                    <div className="mt-4">
                        <p>Seat Number: {seatNumber}</p>
                        <p>Total Price: ${totalPrice.toFixed(2)}</p>

                        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 mt-4">
                            Logout
                        </button>
                        <button onClick={handlePlaceOrder} className="bg-blue-500 text-white px-4 py-2 mt-4">
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
