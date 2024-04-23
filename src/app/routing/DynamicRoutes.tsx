import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { MasterLayout } from '../../_metronic/layout/MasterLayout'
import DynamicPage from '../pages/DynamicPage'
import StaticPage from '../pages/StaticPage'


const DynamicRoutes: React.FC = () => {
    return <Routes>
        <Route element={<MasterLayout />}>
            {/* Redirect to users after success login/registartion */}
            <Route path='auth/*' element={<Navigate to='/dashboard' />} /> {/* нужно будет передавать начальную страницу */}
            <Route path='dev/*' element={<StaticPage />}/>
            <Route path='*' element={<DynamicPage />} />
         
        </Route>
    </Routes>
}

export default DynamicRoutes