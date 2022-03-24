export const EmailValidation = (value) => {
    return !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value)
};

export const RequireValidation = (value) => {
    return value.trim() === '';
};

export const MobileValidation = (value) => {
    return (value.trim() !== '' && !/^0[0-9]{9,9}$/.test(value));
};