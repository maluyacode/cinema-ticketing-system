import React from 'react'
import { Button, CircularProgress, Box } from '@mui/material'
const ButtonCircularProgress = ({ loading, text }) => {
    return (
        <Box sx={{ m: 1, position: 'relative' }}>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                    mt: 3,
                    mb: 2,
                    backgroundColor: '#70a0a1',
                }}
                disabled={loading}
            >
                {text}
            </Button>
            {loading && (
                <CircularProgress
                    size={24}
                    sx={{
                        position: 'absolute',
                        top: '55%',
                        left: '50%',
                        marginTop: '-12px',
                        marginLeft: '-12px',
                        color: '#70a0a1'
                    }}
                />
            )}
        </Box>
    )
}

export default ButtonCircularProgress