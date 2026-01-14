// Firebase Configuration
// Users need to replace these with their own Firebase project credentials
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
let auth, db, currentUser = null;
let savedParcels = [];

// Check if Firebase is available and initialize
if (typeof firebase !== 'undefined') {
    try {
        firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();

        // Listen for auth state changes
        auth.onAuthStateChanged(user => {
            currentUser = user;
            updateAuthUI(user);
            if (user) {
                loadSavedParcels();
            } else {
                savedParcels = [];
                updateSavedCount();
            }
        });
    } catch (error) {
        console.log('Firebase setup required. Please configure Firebase credentials in auth.js');
        useFallbackMode();
    }
} else {
    console.log('Firebase SDK not loaded. Using fallback mode.');
    useFallbackMode();
}

// Fallback mode for demo without Firebase
function useFallbackMode() {
    // Load saved parcels from localStorage as fallback
    const saved = localStorage.getItem('savedParcels');
    if (saved) {
        try {
            savedParcels = JSON.parse(saved);
            updateSavedCount();
        } catch (e) {
            savedParcels = [];
        }
    }

    // Show auth buttons but with demo mode
    document.getElementById('authButtons').style.display = 'flex';

    // Add demo mode notice
    const authSection = document.querySelector('.auth-section');
    const notice = document.createElement('div');
    notice.style.fontSize = '0.75rem';
    notice.style.color = '#999';
    notice.style.marginTop = '0.5rem';
    notice.innerHTML = '<em>Demo mode: Using local storage. Configure Firebase for full features.</em>';

    // Handle auth button clicks in demo mode
    document.getElementById('googleSignInBtn').addEventListener('click', () => {
        alert('Demo Mode: Please configure Firebase in auth.js to enable Google Sign-in.\n\nFor now, parcels will be saved to localStorage.');
        // Simulate being logged in
        currentUser = { displayName: 'Demo User', photoURL: null, uid: 'demo-user' };
        updateAuthUI(currentUser);
        loadSavedParcels();
    });

    document.getElementById('appleSignInBtn').addEventListener('click', () => {
        alert('Demo Mode: Please configure Firebase in auth.js to enable Apple Sign-in.\n\nFor now, parcels will be saved to localStorage.');
        // Simulate being logged in
        currentUser = { displayName: 'Demo User', photoURL: null, uid: 'demo-user' };
        updateAuthUI(currentUser);
        loadSavedParcels();
    });
}

// Update auth UI based on user state
function updateAuthUI(user) {
    const authButtons = document.getElementById('authButtons');
    const userInfo = document.getElementById('userInfo');
    const viewSavedBtn = document.getElementById('viewSavedBtn');

    if (user) {
        authButtons.classList.add('hidden');
        userInfo.classList.remove('hidden');
        viewSavedBtn.classList.remove('hidden');

        const userAvatar = document.getElementById('userAvatar');
        const userName = document.getElementById('userName');

        if (user.photoURL) {
            userAvatar.src = user.photoURL;
            userAvatar.style.display = 'block';
        } else {
            userAvatar.style.display = 'none';
        }

        userName.textContent = user.displayName || user.email || 'User';
    } else {
        authButtons.classList.remove('hidden');
        userInfo.classList.add('hidden');
        viewSavedBtn.classList.add('hidden');
    }
}

// Google Sign-in
document.getElementById('googleSignInBtn')?.addEventListener('click', async () => {
    if (!auth) return;

    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider);
    } catch (error) {
        console.error('Google sign-in error:', error);
        alert('Sign-in failed. Please try again.');
    }
});

// Apple Sign-in
document.getElementById('appleSignInBtn')?.addEventListener('click', async () => {
    if (!auth) return;

    try {
        const provider = new firebase.auth.OAuthProvider('apple.com');
        provider.addScope('email');
        provider.addScope('name');
        await auth.signInWithPopup(provider);
    } catch (error) {
        console.error('Apple sign-in error:', error);
        alert('Sign-in failed. Please try again.');
    }
});

// Sign out
document.getElementById('signOutBtn')?.addEventListener('click', async () => {
    if (auth && currentUser && currentUser.uid !== 'demo-user') {
        try {
            await auth.signOut();
        } catch (error) {
            console.error('Sign-out error:', error);
        }
    } else {
        // Demo mode sign out
        currentUser = null;
        updateAuthUI(null);
        savedParcels = [];
        updateSavedCount();
    }
});

// Save parcel to database
async function saveParcel(parcelData) {
    if (!currentUser) {
        alert('Please sign in to save parcels');
        return false;
    }

    const parcel = {
        trackingNumber: parcelData.trackingNumber,
        carrier: parcelData.carrier,
        currentStatus: parcelData.currentStatus,
        name: parcelData.name || null,
        savedAt: new Date().toISOString(),
        userId: currentUser.uid
    };

    if (db && currentUser.uid !== 'demo-user') {
        try {
            await db.collection('parcels').add(parcel);
            await loadSavedParcels();
            return true;
        } catch (error) {
            console.error('Error saving parcel:', error);
            alert('Failed to save parcel. Please try again.');
            return false;
        }
    } else {
        // Fallback to localStorage
        savedParcels.push(parcel);
        localStorage.setItem('savedParcels', JSON.stringify(savedParcels));
        updateSavedCount();
        return true;
    }
}

// Load saved parcels
async function loadSavedParcels() {
    if (!currentUser) return;

    if (db && currentUser.uid !== 'demo-user') {
        try {
            const snapshot = await db.collection('parcels')
                .where('userId', '==', currentUser.uid)
                .orderBy('savedAt', 'desc')
                .get();

            savedParcels = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            updateSavedCount();
        } catch (error) {
            console.error('Error loading parcels:', error);
        }
    } else {
        // Load from localStorage
        const saved = localStorage.getItem('savedParcels');
        if (saved) {
            try {
                savedParcels = JSON.parse(saved);
                updateSavedCount();
            } catch (e) {
                savedParcels = [];
            }
        }
    }
}

// Delete parcel
async function deleteParcel(parcelId, index) {
    if (!currentUser) return false;

    if (db && currentUser.uid !== 'demo-user') {
        try {
            await db.collection('parcels').doc(parcelId).delete();
            await loadSavedParcels();
            return true;
        } catch (error) {
            console.error('Error deleting parcel:', error);
            return false;
        }
    } else {
        // Delete from localStorage
        savedParcels.splice(index, 1);
        localStorage.setItem('savedParcels', JSON.stringify(savedParcels));
        updateSavedCount();
        return true;
    }
}

// Update saved count
function updateSavedCount() {
    const countElement = document.getElementById('savedCount');
    if (countElement) {
        countElement.textContent = savedParcels.length;
    }

    const viewSavedBtn = document.getElementById('viewSavedBtn');
    if (viewSavedBtn && currentUser) {
        viewSavedBtn.classList.toggle('hidden', savedParcels.length === 0 && !currentUser);
    }
}

// View saved parcels
document.getElementById('viewSavedBtn')?.addEventListener('click', () => {
    showSavedParcels();
});

document.getElementById('closeSavedBtn')?.addEventListener('click', () => {
    document.getElementById('savedParcelsSection').classList.add('hidden');
});

// Show saved parcels modal
function showSavedParcels() {
    const savedParcelsSection = document.getElementById('savedParcelsSection');
    const savedParcelsList = document.getElementById('savedParcelsList');

    savedParcelsList.innerHTML = '';

    if (savedParcels.length === 0) {
        savedParcelsList.innerHTML = '<div class="empty-saved-message">No saved parcels yet.<br>Track a package and save it to see it here.</div>';
    } else {
        savedParcels.forEach((parcel, index) => {
            const item = document.createElement('div');
            item.className = 'saved-parcel-item';

            const savedDate = new Date(parcel.savedAt);
            const dateStr = savedDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });

            const nameDisplay = parcel.name ? `<div class="saved-parcel-name">${parcel.name}</div>` : '';

            item.innerHTML = `
                <div class="saved-parcel-header-row">
                    <div>
                        ${nameDisplay}
                        <div class="saved-parcel-tracking">${parcel.trackingNumber}</div>
                        <div class="saved-parcel-carrier">${parcel.carrier}</div>
                        <div class="saved-parcel-date">Saved ${dateStr}</div>
                    </div>
                    <button class="delete-parcel-btn" data-id="${parcel.id || ''}" data-index="${index}">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 6H5H21M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6M19 6V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            `;

            // Click to track
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.delete-parcel-btn')) {
                    document.getElementById('trackingInput').value = parcel.trackingNumber;
                    savedParcelsSection.classList.add('hidden');
                    handleTracking(); // This function is defined in script.js
                }
            });

            // Delete button
            const deleteBtn = item.querySelector('.delete-parcel-btn');
            deleteBtn.addEventListener('click', async (e) => {
                e.stopPropagation();

                if (confirm(`Delete tracking for ${parcel.trackingNumber}?`)) {
                    const success = await deleteParcel(parcel.id, index);
                    if (success) {
                        showSavedParcels(); // Refresh the list
                    }
                }
            });

            savedParcelsList.appendChild(item);
        });
    }

    savedParcelsSection.classList.remove('hidden');
}

// Close modal when clicking outside
document.getElementById('savedParcelsSection')?.addEventListener('click', (e) => {
    if (e.target.id === 'savedParcelsSection') {
        document.getElementById('savedParcelsSection').classList.add('hidden');
    }
});

// Export functions for use in script.js
window.saveParcelToDatabase = saveParcel;
window.getSavedParcelsCount = () => savedParcels.length;
window.isUserSignedIn = () => !!currentUser;
