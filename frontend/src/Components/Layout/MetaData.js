import React from 'react'
import { Helmet } from 'react-helmet-async'

const MetaData = ({ pageTitle = '' }) => {
    return (
        <Helmet>
            <title>CinemaTick - {pageTitle}</title>
        </Helmet>
    )
}

export default MetaData