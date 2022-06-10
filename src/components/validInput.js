import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'semantic-ui-react';

const ValidInput = ({ label, name, type = 'text', initialValue, validFunctions, result, placeholder }) => {
    const [value, setValue] = useState(initialValue || '');
    const [messageError, setMessageError] = useState('');
    const isPassword = type === 'password' && initialValue;
    const inputValue = isPassword ? initialValue?.substring(0, 8) : value;
    const check = (firstRender) => {
        for (let i = 0; i < validFunctions.length; i++) {
            let isError = validFunctions[i](value);
            if (isError) {
                setMessageError(firstRender ? '' : isError);
                result('');
                break;
            }

            if (firstRender && !isError && i === validFunctions.length - 1) {
                setMessageError('');
                result(value);
            }
        }
    };

    const blurCheck = () => {
        check();
    };

    const onFocus = () => {
        isPassword && setValue('');
    };

    useEffect(() => {
        check(true);
    }, [value]);

    let inputClass = [];
    messageError && inputClass.push('invalid');

    return <div className='general-input'>
        <label htmlFor={name}>{label}</label>
        <Input
            type={type}
            name={name}
            autoComplete='off'
            onBlur={blurCheck}
            onFocus={onFocus}
            value={inputValue}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className={messageError ? 'invalid' : ''} />
        { messageError && <div className='valid_label'>{messageError}</div> }
    </div>;
};

ValidInput.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    initialValue: PropTypes.any,
    validFunctions: PropTypes.array,
    result: PropTypes.func,
    placeholder: PropTypes.any
};

export default ValidInput;
