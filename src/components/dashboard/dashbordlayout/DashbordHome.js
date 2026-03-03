import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Skeleton } from '@mui/material';
import { Storefront, LocalShipping, ShoppingCart, Agriculture } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import {TotalNoOfFarmersbyFPO} from '../../Api_url'

const DashboardHome = () => {
  

  // State to store the total farmers count
  const [totalFarmers, setTotalFarmers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch total farmers from the API
  const fetchTotalFarmers = async () => {
    try {
      setLoading(true);
      setError(false);
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('No token found');
        setError(true);
        setLoading(false);
        return;
      }
  
      const response = await axios.get(
        TotalNoOfFarmersbyFPO,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data && response?.data?.total_farmers !== undefined) {
        setTotalFarmers(response?.data.total_farmers);
      } else {
        console.error('Invalid API response:', response);
        setError(true);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };
  
  // Call the fetch function when the component mounts
  useEffect(() => {
    fetchTotalFarmers();
  }, []); // Empty dependency array means it runs once when the component mounts
   

  return (
    <div className="flex flex-wrap justify-center gap-6 md:flex-row md:justify-start">
      {/* Farmer Card */}
      <Card className="w-64 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out">
        <CardContent
          className="flex flex-col items-center"
          style={{
            background: 'linear-gradient(to right, #48C78E, #34D399, #10B981)', // Green gradient
            color: 'white',
          }}
        >
          <Agriculture sx={{ fontSize: 60 }} className="mb-4 animate-pulse" />
          <Typography variant="h6" component="div" className="font-semibold text-center text-xl">
            Farmer
          </Typography>
          {loading ? (
            <Skeleton variant="text" width={150} height={30} sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
          ) : error ? (
            <Typography variant="body2" component="div" className="text-center mt-2">
              Failed to load
            </Typography>
          ) : (
            <Typography variant="body2" component="div" className="text-center mt-2">
              Total Farmers: {totalFarmers || 0}
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Sales Card */}
      <Card className="w-64 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out">
        <CardContent
          className="flex flex-col items-center"
          style={{
            background: 'linear-gradient(to right, #60A5FA, #3B82F6, #1D4ED8)',
            color: 'white',
          }}
        >
          <Storefront sx={{ fontSize: 60 }} className="mb-4 animate-pulse" />
          <Typography variant="h6" component="div" className="font-semibold text-center text-xl">
            Sales
          </Typography>
          {loading ? (
            <Skeleton variant="text" width={150} height={30} sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
          ) : (
            <Typography variant="body2" component="div" className="text-center mt-2">
              Total Sales: 0
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Order Card */}
      <Card className="w-64 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out">
        <CardContent
          className="flex flex-col items-center"
          style={{
            background: 'linear-gradient(to right, #FDBA74, #FB923C, #F97316)', // Orange gradient
            color: 'white',
          }}
        >
          <ShoppingCart sx={{ fontSize: 60 }} className="mb-4 animate-pulse" />
          <Typography variant="h6" component="div" className="font-semibold text-center text-xl">
            Orders
          </Typography>
          {loading ? (
            <Skeleton variant="text" width={150} height={30} sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
          ) : (
            <Typography variant="body2" component="div" className="text-center mt-2">
              Total Orders: 0
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Purchase Card */}
      <Card className="w-64 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out">
        <CardContent
          className="flex flex-col items-center"
          style={{
            background: 'linear-gradient(to right, #F87171, #EF4444, #DC2626)', // Red gradient
            color: 'white',
          }}
        >
          <LocalShipping sx={{ fontSize: 60 }} className="mb-4 animate-pulse" />
          <Typography variant="h6" component="div" className="font-semibold text-center text-xl">
            Purchase
          </Typography>
          {loading ? (
            <Skeleton variant="text" width={150} height={30} sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
          ) : (
            <Typography variant="body2" component="div" className="text-center mt-2">
              Total Purchase: 0
            </Typography>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default DashboardHome;
