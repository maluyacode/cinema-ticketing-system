import React, { PureComponent, useEffect, useState } from 'react';
import { PieChart, Pie, Sector, ResponsiveContainer } from 'recharts';
import { Box, Typography, Paper } from '@mui/material';
import Toast from 'Components/Layout/Toast';
import axios from 'axios';

const data = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
];

const renderActiveShape = (props) => {

    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';
    console.log(props)
    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
                {payload.Movie}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`₱${value}`}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                {`(Rate ${(percent * 100).toFixed(2)}%)`}
            </text>
        </g>
    );
};

const MovieHasMostSales = () => {

    const [movieHasMostSales, setMovieHasMostSales] = useState();
    const [activeIndex, setActiveIndex] = useState(0);

    const getMoviesHasMoreSales = async () => {

        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/charts/movie-has-most-sales`);

            setMovieHasMostSales(data.movieHasMostSales)
        } catch ({ response }) {
            Toast.err(response.data.message)
        }
    }

    useEffect(() => {
        getMoviesHasMoreSales()
    }, [])

    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };

    return (
        <Box sx={{ width: 800, height: 650, pt: 5, ml: -10, }}>
            <Typography textAlign={'center'}>Movie Has Most Sales</Typography>
            <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                    <Pie
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        data={movieHasMostSales}
                        cx="50%"
                        cy="50%"
                        innerRadius={150}
                        outerRadius={200}
                        fill="#8884d8"
                        dataKey="Sales"
                        onMouseEnter={onPieEnter}
                    />
                </PieChart>
            </ResponsiveContainer>
        </Box>
    )
}

export default MovieHasMostSales