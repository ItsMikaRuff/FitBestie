import React, { useState } from 'react';
import { SignUpInput, GlobalError } from './styledComponents';

const PaymentAuth = ({ onPaymentChange }) => {
    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newPaymentDetails = {
            ...paymentDetails,
            [name]: value
        };
        setPaymentDetails(newPaymentDetails);
        onPaymentChange(newPaymentDetails);
    };

    const validateCardNumber = (number) => {
        // Basic Luhn algorithm validation
        let sum = 0;
        let isEven = false;
        
        // Loop through values starting from the rightmost digit
        for (let i = number.length - 1; i >= 0; i--) {
            let digit = parseInt(number[i]);

            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }

            sum += digit;
            isEven = !isEven;
        }

        return sum % 10 === 0;
    };

    const validateExpiryDate = (date) => {
        const [month, year] = date.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;

        const expMonth = parseInt(month);
        const expYear = parseInt(year);

        if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
            return false;
        }

        return true;
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        
        switch (name) {
            case 'cardNumber':
                if (value.length !== 16 || !validateCardNumber(value)) {
                    setError('מספר כרטיס לא תקין');
                } else {
                    setError('');
                }
                break;
            case 'expiryDate':
                if (!validateExpiryDate(value)) {
                    setError('תוקף הכרטיס לא תקין');
                } else {
                    setError('');
                }
                break;
            case 'cvv':
                if (value.length !== 3 || !/^\d+$/.test(value)) {
                    setError('קוד CVV לא תקין');
                } else {
                    setError('');
                }
                break;
            default:
                break;
        }
    };

    return (
        <div style={{ marginTop: '20px' }}>
            <h3 style={{ marginBottom: '15px', textAlign: 'right' }}>אימות אמצעי תשלום</h3>
            
            <SignUpInput
                type="text"
                name="cardNumber"
                value={paymentDetails.cardNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="מספר כרטיס"
                maxLength="16"
                required
                style={{ textAlign: 'right' }}
            />

            <SignUpInput
                type="text"
                name="expiryDate"
                value={paymentDetails.expiryDate}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="תוקף (MM/YY)"
                maxLength="5"
                required
                style={{ textAlign: 'right' }}
            />

            <SignUpInput
                type="text"
                name="cvv"
                value={paymentDetails.cvv}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="CVV"
                maxLength="3"
                required
                style={{ textAlign: 'right' }}
            />

            {error && <GlobalError>{error}</GlobalError>}
        </div>
    );
};

export default PaymentAuth; 