import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ image, title, category, price, instructor, level, onClick }) => {

    const cardStyle = {
        fontFamily: `'Roboto', sans-serif`,
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        margin: '16px',
        maxWidth: '300px',
        textAlign: 'center',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
    };

    const titleStyle = {
        fontFamily: `"Poppins", sans-serif`,
        fontSize: '1.4rem',
        fontWeight: '700',
        color: '#333',
        marginBottom: '10px',
    };

    const contentStyle = {
        fontSize: '1rem',
        color: '#555',
        marginBottom: '8px',
    };

    const priceStyle = {
        fontSize: '1.25rem',
        fontWeight: 'bold',
        color: '#9DCCFF',
        margin: '8px 0',
    };

    const imageStyle = {
        width: '100%',
        height: '200px',
        backgroundColor: '#ccc',
        backgroundImage: image ? `url(${image})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '8px 8px 0 0',
        objectFit: 'cover',
    };

    const instructorImageStyle = {
        position: 'absolute',
        bottom: '10px',
        left: '16px',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        overflow: 'hidden',
        border: '2px solid #fff',
        backgroundColor: instructor.imageUrl ? 'transparent' : '#ccc',
    };

    const instructorImage = {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    };

    const instructorNameStyle = {
        position: 'absolute',
        bottom: '5px',
        left: '65px',
        fontSize: '0.875rem',
        fontFamily: 'Optima',
        fontWeight: 'bold',
        color: '#333',
    };

    return (
        <div
            style={cardStyle}
            onClick={onClick}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
            <div style={imageStyle}></div>
            <h2 style={titleStyle}>{title}</h2>
            {category && <p style={contentStyle}>Category: {category}</p>}
            {level && <p style={contentStyle}>{level}</p>}
            {price && <p className='pb-4' style={priceStyle}>Price: ₹ {price}</p>}
            {instructor && (
                <div style={instructorImageStyle}>
                    <img src={instructor.imageUrl} alt={instructor.name} style={instructorImage} />
                </div>
            )}
            {instructor && <p style={instructorNameStyle}>{instructor.name}</p>}
        </div>
    );
};

Card.propTypes = {
    image: PropTypes.string,
    title: PropTypes.string.isRequired,
    category: PropTypes.string,
    price: PropTypes.number,
    instructor: PropTypes.shape({
        name: PropTypes.string,
        imageUrl: PropTypes.string,
    }),
    level: PropTypes.string,
    onClick: PropTypes.func,
};

export default Card;
