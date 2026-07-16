// ====================================
// SIGNUP.JS - COMPLETE
// ====================================

console.log('✅ Signup JS Loaded!');

// ====================================
// SIGNUP FORM - FIREBASE AUTH
// ====================================

import { auth, createUserWithEmailAndPassword, db, collection, addDoc } from './firebase.js';

const signupForm = document.getElementById('signupForm');
const signupBtn = document.getElementById('signupBtn');
const signupError = document.getElementById('signupError');

if (signupForm) {
    signupForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value.trim();

        // Clear previous error
        if (signupError) {
            signupError.classList.remove('show');
            signupError.textContent = '';
        }

        // Validation
        if (!name || !email || !password) {
            if (signupError) {
                signupError.textContent = '❌ Please fill all fields';
                signupError.classList.add('show');
            }
            return;
        }

        if (name.length < 2) {
            if (signupError) {
                signupError.textContent = '❌ Name must be at least 2 characters';
                signupError.classList.add('show');
            }
            return;
        }

        if (!email.includes('@')) {
            if (signupError) {
                signupError.textContent = '❌ Please enter a valid email';
                signupError.classList.add('show');
            }
            return;
        }

        if (password.length < 6) {
            if (signupError) {
                signupError.textContent = '❌ Password must be at least 6 characters';
                signupError.classList.add('show');
            }
            return;
        }

        // Show loading
        if (signupBtn) {
            signupBtn.disabled = true;
            signupBtn.textContent = '⏳ Creating account...';
        }

        try {
            // Create user with Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            console.log('✅ Account created:', user.email);

            // Save user data to Firestore
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: name,
                email: email,
                phone: '',
                address: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });

            console.log('✅ User data saved to Firestore');

            // Save to localStorage
            localStorage.setItem('currentUser', JSON.stringify({
                uid: user.uid,
                email: user.email,
                name: name
            }));

            alert('✅ Account Created Successfully! Welcome ' + name + '!');
            window.location.href = 'index.html';

        } catch (error) {
            console.error('❌ Signup Error:', error.code, error.message);

            let msg = '❌ ';
            switch (error.code) {
                case 'auth/email-already-in-use':
                    msg += 'This email is already registered. Please login instead.';
                    break;
                case 'auth/invalid-email':
                    msg += 'Invalid email address format.';
                    break;
                case 'auth/operation-not-allowed':
                    msg += 'Email/password accounts are not enabled. Contact admin.';
                    break;
                case 'auth/weak-password':
                    msg += 'Password is too weak. Use at least 6 characters with uppercase, lowercase and numbers.';
                    break;
                case 'auth/network-request-failed':
                    msg += 'Network error. Please check your internet connection.';
                    break;
                default:
                    msg += error.message;
            }

            if (signupError) {
                signupError.textContent = msg;
                signupError.classList.add('show');
            }

        } finally {
            // Reset button
            if (signupBtn) {
                signupBtn.disabled = false;
                signupBtn.textContent = '📝 Create Account';
            }
        }
    });
}

console.log('✅ Signup Page with Firebase Auth Loaded!');
console.log('🔥 Firebase Auth:', auth);