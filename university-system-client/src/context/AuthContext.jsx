import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from "../api/axios.js"; // <-- This line is fixed
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

// 1. Create the context
const AuthContext = createContext();

// 2. Create the provider (the "wrapper")
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // This function will get the user data on page load
    const getUser = async () => {
        try {
            const { data } = await apiClient.get('/api/user',)
            setUser(data);
        } catch (error) {
            setUser(null);
        }
        setLoading(false);
    };

    // Run getUser on initial component mount
    useEffect(() => {
        getUser();
    }, []);

    // Function to handle login
    const login = async (email, password) => {
        // We must get a CSRF cookie from Sanctum first
       await apiClient.get('/sanctum/csrf-cookie');
        // Now we can make the login request
        await apiClient.post('/login', { email, password });
        
        // If login is successful, fetch the user data
        await getUser();
    };

    // Function to handle logout
    const logout = async () => {
        await apiClient.post('/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// 3. Create a custom hook to use the context
export const useAuth = () => {
    return useContext(AuthContext);



    // ... inside AuthProvider
return (
    <AuthContext.Provider value={{ user, login, logout, loading, getUser }}>
        {!loading && children}
    </AuthContext.Provider>
);// ... (keep all the code above)

    // Function to handle login
    const login = async (email, password) => {
        // We must get a CSRF cookie from Sanctum first
        // FIX: Add /api/ prefix
        await apiClient.get('/api/sanctum/csrf-cookie'); 
        
        // Now we can make the login request
        // FIX: Add /api/ prefix
        await apiClient.post('/api/login', { email, password }); 
        
        // If login is successful, fetch the user data
        await getUser();
    };
    // ... (keep all the code above)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors(null);

        if (password !== password_confirmation) {
            setErrors({ password: ['Passwords do not match.'] });
            return;
        }

        try {
            // 1. Get the CSRF cookie
            // FIX: Add /api/ prefix
            await apiClient.get('/api/sanctum/csrf-cookie');
            
            // 2. Send the registration request
            // FIX: Add /api/ prefix
            await apiClient.post('/api/register', {
                name,
                email,
                password,
                password_confirmation,
            });
            
            // 3. If registration is successful, log the user in
            await getUser();

        } catch (e) {
            // ... (keep the error handling code)
        }
    };

    // ... (keep all the code below)
    // ... (keep all the code below)
};

