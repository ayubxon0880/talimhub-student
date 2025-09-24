import React from 'react'
import AppRoutes from './routes/AppRoutes'
import {Analytics} from "@vercel/analytics/react"

const App = () => {
    return (
        <div>
            <Analytics/>
            <AppRoutes/>
        </div>
    )
}

export default React.memo(App)