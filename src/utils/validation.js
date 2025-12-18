export const isValidPhoneNumber = (phone) => {
    const re = /^[0-9]{10}$/;
    return re.test(phone);
};

export const isValidOTP = (otp) => {
    const re = /^[0-9]{6}$/;
    return re.test(otp);
};
