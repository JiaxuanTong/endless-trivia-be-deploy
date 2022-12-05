import Cookie from 'universal-cookie';

import * as actionTypes from './actionTypes';

export const authenticated = (userId, email, displayName, role) => {
    // Create cookies that will expire after 3 days
    const cookie = new Cookie();
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 3);

    cookie.set("userId", userId, {path: "/", expires: expirationDate});
    cookie.set("email", email, {path: "/", expires: expirationDate});
    cookie.set("displayName", displayName, {path: "/", expires: expirationDate});
    cookie.set("role", role, {path: "/", expires: expirationDate});

    return {
        userId: userId,
        email: email,
        displayName: displayName,
        role: role,
        type: actionTypes.AUTHENTICATED
    };
}

export const logout = () => {
    // Clean user data in cookies
    const cookie = new Cookie();
    cookie.remove("userId", { path: '/' });
    cookie.remove("email", { path: '/' });
    cookie.remove("displayName", { path: '/' });
    cookie.remove("role", { path: '/' });

    return {
        type: actionTypes.LOGOUT
    };
}

export const changeDisplayName = (displayName) => {
    const cookie = new Cookie();
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 3);

    cookie.set("displayName", displayName, {path: "/", expires: expirationDate});

    return {
        displayName: displayName,
        type: actionTypes.CHANGE_DISPLAY_NAME
    };
}