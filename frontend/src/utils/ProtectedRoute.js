import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { getUser } from './helpers';

const ProtectedRoute = ({ children, isAdmin = false }) => {

    const [loading, setLoading] = useState(getUser() === false && false)
    const [user, setUser] = useState(getUser())
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    if (!user) {
        return <Navigate to='/login' />
    }

    if (isAdmin === true && user.role !== 'admin') {
        return <Navigate to='/' />
    }
    return children

};

export default ProtectedRoute;