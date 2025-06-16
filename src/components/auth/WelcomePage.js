import { Button } from '@mui/material';
import React from 'react';
import backgroundimg from './2.png'

export default function WelcomePage() {
    return (
        <div>
            <section
                className="relative h-screen bg-cover bg-center text-white flex flex-col justify-center items-start px-4"
                style={{
                    backgroundImage: `url(${backgroundimg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',        
                    width: '100%',
                    height: '100vh',
                  }}      
            >
                <div className="max-w-full md:ml-40">
                    <h1 className="text-[#0000FF] text-2xl md:text-[40px] font-semibold text-center">
                        Welcome, User! Let's Get Started
                    </h1>
                    <p className="mt-10 text-xl text-center text-black">
                        Start by completing your profile to make the most of your employer portal.

                    </p>
                    <p className="mt-1 text-xl text-center text-black">
                        It only takes a few minutes!
                    </p>
                    <div className="flex justify-center items-center mt-10">
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth={false}
                            sx={{
                                background: '#0000FF',
                                color: 'white',
                                px: 12,
                                py: 1.5,
                                borderRadius: 2,
                                fontsize: '16px',
                                fontWeight: 500,
                                textTransform: 'none',
                                '&:hover': {
                                    background: '#0000FF',
                                },
                            }}
                        >
                           Let's start
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}