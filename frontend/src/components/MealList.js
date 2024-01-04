// src/components/MealList.js
import React from 'react';

function MealList({ meals }) {
    return (
        <div>
            {meals.map((meal) => (
                <div key={meal.id}>
                    <h3>{meal.title}</h3>
                    <p>Starter: {meal.starter}</p>
                    <p>Desert: {meal.desert}</p>
                    <p>Price: {meal.price}</p>
                    <img src={meal.img} alt={meal.title} />
                </div>
            ))}
        </div>
    );
}

export default MealList;
