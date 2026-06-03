import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL } from '../api';
import { Zap, Lock, Calendar, CheckCircle } from 'lucide-react';

const SubscriptionStatus = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [accessSource, setAccessSource] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/user/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };
    getUserData();
  }, []);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/purchases/check-access`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            userId: user._id
          })
        });
        
        const data = await response.json();
        setHasAccess(data.hasAccess);
        setAccessSource(data.accessSource || null);

        // Fetch active subscriptions
        const subsResponse = await fetch(`${API_BASE_URL}/api/purchases/active-subscriptions/${user._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const subsData = await subsResponse.json();
        setSubscriptions(subsData.subscriptions || []);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSubscriptions();
    }
  }, [user]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/40 rounded-2xl p-6 sm:p-8"
      >
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin w-8 h-8 border-4 border-green-400/30 border-t-green-400 rounded-full"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="mt-12"
    >
      {hasAccess && subscriptions.length > 0 ? (
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Your Active Subscriptions
            </span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {subscriptions.map((sub, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-green-600/10 to-green-500/5 border border-green-500/30 rounded-xl p-6 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/30 to-green-500/10 flex items-center justify-center">
                      <CheckCircle size={24} className="text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">{sub.module}</h3>
                      <p className="text-xs text-green-400 font-semibold">Active</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-green-400/60" />
                    <p className="text-sm text-gray-300">
                      <span className="text-green-400 font-bold">{sub.daysRemaining}</span> days remaining
                    </p>
                  </div>
                  <div className="w-full bg-gray-700/30 rounded-full h-2">
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((sub.daysRemaining / 30) * 100, 100)}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : hasAccess ? (
        <div className="bg-gradient-to-br from-green-600/10 to-green-500/5 border border-green-500/30 rounded-2xl p-8 sm:p-10 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500/30 to-green-500/10 flex items-center justify-center">
              <CheckCircle size={28} className="text-green-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Premium access active</h3>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            {accessSource === 'platform'
              ? 'Your account has full platform access. Open any premium module from the dashboard.'
              : 'You have active premium access. Explore modules from the dashboard.'}
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-br from-purple-900/20 to-blue-900/10 border-2 border-purple-500/40 rounded-2xl p-8 sm:p-12 text-center hover:border-purple-500/60 transition-all duration-300"
        >
          <div className="flex justify-center mb-6">
            <motion.div 
              className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/20 flex items-center justify-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Lock size={32} className="text-purple-400" />
            </motion.div>
          </div>
          
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Unlock Premium Access
          </h3>
          <p className="text-gray-400 text-base mb-6 max-w-2xl mx-auto">
            Elevate your learning journey! Get access to exclusive career assessments, personalized guidance, and advanced tools. Start your premium experience today.
          </p>
          
          <motion.a
            href="/plans"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500/30 to-green-400/20 text-green-300 border border-green-500/50 hover:border-green-500/80 rounded-lg font-bold text-base transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20"
          >
            <Zap size={20} />
            Upgrade Now
          </motion.a>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SubscriptionStatus;