import { Container, Paper, Box, Typography } from '@mui/material';
import Toast from 'Components/Layout/Toast';
import axios from 'axios';
import React, { PureComponent, useEffect, useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    {
        name: 'Page A',
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: 'Page B',
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: 'Page C',
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: 'Page D',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'Page F',
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: 'Page G',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
];



const MostWatch = () => {

    const [mostWatchedMovie, setMostWatchedMovie] = useState();

    const getMostWathed = async () => {

        try {
            const { data: { mostWatchedMovie } } = await axios.get(`${process.env.REACT_APP_API}/api/v1/charts/most-watch`);
            setMostWatchedMovie(mostWatchedMovie)
        } catch ({ response }) {
            Toast.err(response.data.message)
        }
    }

    useEffect(() => {
        getMostWathed()
    }, [])

    return (
        <Box sx={{ width: 600 }}>
            <Typography textAlign={'center'}>Most Watched</Typography>
            <ResponsiveContainer height={300}>
                <BarChart
                    width={400}
                    height={300}
                    data={mostWatchedMovie}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 50,
                        bottom: 5,
                    }}
                    barSize={30}
                >
                    <XAxis dataKey="Movie" scale="point" padding={{ left: 50, right: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Bar dataKey="Watched" fill="#8884d8" background={{ fill: '#eee' }} />
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
}

export default MostWatch