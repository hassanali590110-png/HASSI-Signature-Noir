// ====================================
// LOGOUT FUNCTIONALITY
// ====================================

import { auth, signOut } from "./firebase.js";

// ====================================
// PERFORM LOGOUT
// ====================================
export async function performLogout() {
    try {
        // Logout from Firebase
        await signOut(auth);

        // Clear all localStorage data
        localStorage.removeItem('currentUser');
        localStorage.removeItem('cart');
        localStorage.removeItem('orders');
        localStorage.removeItem('wishlist');
        localStorage.removeItem('sessionId');

        console.log('✅ Logout successful!');
        return { success: true, message: 'Logout successful!' };

    } catch (error) {
        console.error('❌ Logout error:', error);
        return { success: false, message: error.message };
    }
}

// ====================================
// CHECK IF USER IS LOGGED IN
// ====================================
export function isUserLoggedIn() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    return user !== null && user !== undefined;
}

// ====================================
// GET CURRENT USER
// ====================================
export function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

// ====================================
// REDIRECT AFTER LOGOUT
// ====================================
export function redirectToHome() {
    window.location.href = 'index.html';
}

export function redirectToLogin() {
    window.location.href = 'login.html';
}

// ====================================
// CLEAR CART
// ====================================
export function clearCart() {
    localStorage.removeItem('cart');
    localStorage.removeItem('cartCount');
}

console.log('✅ Logout.js loaded successfully!');