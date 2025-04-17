class DatabaseService {
    constructor() {
        this.dbName = 'investyDB';
        this.dbVersion = 1;
        this.db = null;
        this.init();
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => {
                reject('Error opening database');
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create users store
                if (!db.objectStoreNames.contains('users')) {
                    const usersStore = db.createObjectStore('users', { keyPath: 'email' });
                    usersStore.createIndex('email', 'email', { unique: true });
                    usersStore.createIndex('name', 'name', { unique: false });
                    usersStore.createIndex('createdAt', 'createdAt', { unique: false });
                }
            };
        });
    }

    async createUser(userData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['users'], 'readwrite');
            const store = transaction.objectStore('users');

            // Hash the password (in a real app, use a proper hashing algorithm)
            const hashedPassword = btoa(userData.password); // Base64 encoding for demo
            const user = {
                ...userData,
                password: hashedPassword,
                createdAt: new Date().toISOString(),
                avatar: userData.avatar || 'assets/avatar.jpg'
            };

            const request = store.add(user);

            request.onsuccess = () => resolve(user);
            request.onerror = () => reject('Email already exists');
        });
    }

    async getAllUsers() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['users'], 'readonly');
            const store = transaction.objectStore('users');
            const request = store.getAll();

            request.onsuccess = () => {
                // Remove sensitive data before sending
                const users = request.result.map(user => {
                    const { password, ...safeUser } = user;
                    return safeUser;
                });
                resolve(users);
            };
            request.onerror = () => reject('Error fetching users');
        });
    }

    async deleteUser(email) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['users'], 'readwrite');
            const store = transaction.objectStore('users');
            const request = store.delete(email);

            request.onsuccess = () => resolve();
            request.onerror = () => reject('Error deleting user');
        });
    }

    async updateUser(email, updates) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await this.getUser(email);
                if (!user) {
                    throw new Error('User not found');
                }

                const transaction = this.db.transaction(['users'], 'readwrite');
                const store = transaction.objectStore('users');
                const updatedUser = { ...user, ...updates };
                
                const request = store.put(updatedUser);
                request.onsuccess = () => resolve(updatedUser);
                request.onerror = () => reject('Error updating user');
            } catch (error) {
                reject(error);
            }
        });
    }

    async getUser(email) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['users'], 'readonly');
            const store = transaction.objectStore('users');
            const request = store.get(email);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject('Error fetching user');
        });
    }

    async validateUser(email, password) {
        try {
            const user = await this.getUser(email);
            if (!user) {
                throw new Error('User not found');
            }

            // Compare hashed password (in a real app, use proper password comparison)
            const hashedPassword = btoa(password);
            if (user.password !== hashedPassword) {
                throw new Error('Invalid password');
            }

            // Return user data without sensitive information
            const { password: _, ...userData } = user;
            return userData;
        } catch (error) {
            throw error;
        }
    }

    async searchUsers(query) {
        const users = await this.getAllUsers();
        query = query.toLowerCase();
        return users.filter(user => 
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        );
    }

    async sortUsers(users, sortBy) {
        return [...users].sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'email':
                    return a.email.localeCompare(b.email);
                case 'date':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                default:
                    return 0;
            }
        });
    }

    async updateAvatar(email, avatarData) {
        try {
            const user = await this.getUser(email);
            if (!user) {
                throw new Error('User not found');
            }

            const transaction = this.db.transaction(['users'], 'readwrite');
            const store = transaction.objectStore('users');
            const updatedUser = { ...user, avatar: avatarData };
            
            return new Promise((resolve, reject) => {
                const request = store.put(updatedUser);
                request.onsuccess = () => {
                    // Update the avatar in localStorage as well
                    const localUser = JSON.parse(localStorage.getItem('user'));
                    if (localUser && localUser.email === email) {
                        localUser.avatar = avatarData;
                        localStorage.setItem('user', JSON.stringify(localUser));
                    }
                    resolve(updatedUser);
                };
                request.onerror = () => reject('Error updating avatar');
            });
        } catch (error) {
            throw error;
        }
    }
}

// Create and export database instance
const db = new DatabaseService();
window.db = db; // Make it accessible globally 