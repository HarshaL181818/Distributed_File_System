import React from 'react';
import FileUpload from '../components/FileUpload';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
    const { setToken } = useAuth();
    return (
        <div>
            <h1>Distributed File Uploader</h1>
            <button onClick={() => setToken(null)}>Logout</button>
            <hr />
            <FileUpload />
        </div>
    );
};

export default HomePage;