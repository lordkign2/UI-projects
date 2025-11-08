import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Clock, Target } from 'lucide-react';
import { formatCurrency } from '../utils/pricing';

export const Analytics: React.FC = () => {
  const stats = [
    { label: 'Avg. Hourly Rate', value: '$75', icon: DollarSign, color: 'text-green-600', bgColor: 'bg-green-100' },
    { label: 'Projects Quoted', value: '24', icon: Target, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { label: 'Total Hours', value: '480', icon: Clock, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { label: 'Success Rate', value: '68%', icon: TrendingUp, color: 'text-orange-600', bgColor: 'bg-orange-100' }
  ];

  const marketData = [
    { service: 'Web Development', rate: 75, demand: 'High', trend: '+12%' },
    { service: 'UI/UX Design', rate: 65, demand: 'Medium', trend: '+8%' },
    { service: 'Mobile Development', rate: 85, demand: 'High', trend: '+15%' },
    { service: 'Content Writing', rate: 35, demand: 'Medium', trend: '+5%' },
    { service: 'SEO Marketing', rate: 60, demand: 'High', trend: '+10%' },
  ];

  return (
    <section id="analytics" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Market Analytics</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay informed with real-time market data and pricing trends across different services
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Market Rates Table */}
          <div className="bg-gray-50 p-8 rounded-2xl">
            <div className="flex items-center mb-6">
              <BarChart3 className="h-6 w-6 text-blue-600 mr-3" />
              <h4 className="text-xl font-semibold text-gray-900">Current Market Rates</h4>
            </div>
            <div className="space-y-4">
              {marketData.map((item, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="font-medium text-gray-900">{item.service}</h5>
                    <span className="text-lg font-bold text-blue-600">{formatCurrency(item.rate)}/hr</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.demand === 'High' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.demand} Demand
                    </span>
                    <span className="text-green-600 font-medium">{item.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Insights */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-6 w-6 text-green-600 mr-3" />
                <h4 className="text-lg font-semibold text-green-900">Market Trends</h4>
              </div>
              <ul className="space-y-3 text-green-800">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></span>
                  Mobile development rates increased 15% this quarter
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></span>
                  AI/ML expertise commands 40% premium rates
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></span>
                  Remote work has normalized global rate competition
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-blue-600 mr-3" />
                <h4 className="text-lg font-semibold text-blue-900">Client Insights</h4>
              </div>
              <ul className="space-y-3 text-blue-800">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                  67% of clients prefer fixed-price projects
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                  Detailed scopes increase acceptance by 35%
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                  Average project size is 40-80 hours
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
              <div className="flex items-center mb-4">
                <Target className="h-6 w-6 text-purple-600 mr-3" />
                <h4 className="text-lg font-semibold text-purple-900">Recommendations</h4>
              </div>
              <ul className="space-y-3 text-purple-800">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3"></span>
                  Consider specializing in high-demand areas
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3"></span>
                  Package services for better value perception
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3"></span>
                  Build portfolio in emerging technologies
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};