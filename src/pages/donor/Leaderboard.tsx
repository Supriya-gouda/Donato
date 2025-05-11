import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Star, Medal, Award } from 'lucide-react';
import Card, { CardContent, CardHeader } from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import { mockLeaderboard } from '../../utils/mockData';
import { useAuth } from '../../context/AuthContext';

const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'allTime'>('monthly');
  
  // For demo purposes, we'll use the same leaderboard data regardless of timeframe
  const leaderboardData = mockLeaderboard;
  
  // Find the current user in the leaderboard
  const currentUserRanking = leaderboardData.find(entry => entry.donorId === user?.id);
  
  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-amber-400';
      case 2: return 'text-gray-400';
      case 3: return 'text-amber-700';
      default: return 'text-purple-600';
    }
  };
  
  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className={`h-6 w-6 ${getMedalColor(rank)}`} fill="currentColor" />;
      case 2:
        return <Medal className={`h-6 w-6 ${getMedalColor(rank)}`} fill="currentColor" />;
      case 3:
        return <Award className={`h-6 w-6 ${getMedalColor(rank)}`} fill="currentColor" />;
      default:
        return <Star className={`h-5 w-5 ${getMedalColor(rank)}`} />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/donor/dashboard" className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>
      
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Donation Leaderboard</h1>
          
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button 
              variant={timeframe === 'weekly' ? 'primary' : 'outline'} 
              size="sm"
              onClick={() => setTimeframe('weekly')}
            >
              Weekly
            </Button>
            <Button 
              variant={timeframe === 'monthly' ? 'primary' : 'outline'} 
              size="sm"
              onClick={() => setTimeframe('monthly')}
            >
              Monthly
            </Button>
            <Button 
              variant={timeframe === 'allTime' ? 'primary' : 'outline'} 
              size="sm"
              onClick={() => setTimeframe('allTime')}
            >
              All Time
            </Button>
          </div>
        </div>
        
        {/* Top 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {leaderboardData.slice(0, 3).map((entry, index) => (
            <Card key={entry.id} className={index === 0 ? 'border-2 border-amber-400' : ''}>
              <div className="p-6 text-center">
                <div className={`flex items-center justify-center h-14 w-14 rounded-full mx-auto mb-4 ${
                  index === 0 ? 'bg-amber-100' : 
                  index === 1 ? 'bg-gray-100' : 
                  'bg-amber-50'
                }`}>
                  {getMedalIcon(index + 1)}
                </div>
                
                <img 
                  src={entry.donorImage} 
                  alt={entry.donorName} 
                  className={`h-20 w-20 rounded-full mx-auto mb-4 border-4 ${
                    index === 0 ? 'border-amber-400' : 
                    index === 1 ? 'border-gray-400' : 
                    'border-amber-700'
                  }`}
                />
                
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{entry.donorName}</h3>
                
                <div className="flex items-center justify-center space-x-1 text-gray-500 mb-4">
                  <span className="text-sm">{index === 0 ? '1st' : index === 1 ? '2nd' : '3rd'} Place</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-center flex-1">
                    <p className="text-sm text-gray-500">Points</p>
                    <p className="text-xl font-bold text-purple-600">{entry.points}</p>
                  </div>
                  
                  <div className="text-center flex-1">
                    <p className="text-sm text-gray-500">Donations</p>
                    <p className="text-xl font-bold text-gray-900">{entry.donationCount}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Full Leaderboard */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900">Full Leaderboard</h2>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Donor
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Points
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Donations
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leaderboardData.map((entry) => (
                    <tr key={entry.id} className={entry.donorId === user?.id ? 'bg-purple-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-gray-900 font-medium mr-2">{entry.rank}</span>
                          {entry.rank <= 3 && getMedalIcon(entry.rank)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img className="h-10 w-10 rounded-full mr-3" src={entry.donorImage} alt="" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {entry.donorName}
                              {entry.donorId === user?.id && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  You
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-purple-600">{entry.points}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.donationCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        {/* Current User Stats */}
        {currentUserRanking && (
          <div className="bg-purple-50 rounded-lg shadow-sm p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Ranking</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-500 mb-1">Current Rank</p>
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900 mr-2">{currentUserRanking.rank}</span>
                  {currentUserRanking.rank <= 3 && getMedalIcon(currentUserRanking.rank)}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Points</p>
                <p className="text-3xl font-bold text-purple-600">{currentUserRanking.points}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Donations Made</p>
                <p className="text-3xl font-bold text-gray-900">{currentUserRanking.donationCount}</p>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link to="/donor/dashboard">
                <Button>
                  Find Organizations to Support
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;