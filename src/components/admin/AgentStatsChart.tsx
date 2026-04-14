'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface AgentStats {
  agentId: string;
  totalCalls: number;
  successCalls: number;
  failedCalls: number;
  avgExecutionTime: number;
  successRate: number;
}

interface AgentStatsChartProps {
  stats: AgentStats[];
}

export default function AgentStatsChart({ stats }: AgentStatsChartProps) {
  const callsData = stats.map(s => ({
    name: s.agentId,
    成功: s.successCalls,
    失败: s.failedCalls,
  }));

  const timeData = stats.map(s => ({
    name: s.agentId,
    响应时间: s.avgExecutionTime,
  }));

  const successRateData = stats.map(s => ({
    name: s.agentId,
    成功率: s.successRate,
  }));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">总调用次数</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">
            {stats.reduce((sum, s) => sum + s.totalCalls, 0).toLocaleString()}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">平均成功率</div>
          <div className="text-3xl font-bold text-green-600 mt-2">
            {(stats.reduce((sum, s) => sum + s.successRate, 0) / stats.length).toFixed(1)}%
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">平均响应时间</div>
          <div className="text-3xl font-bold text-blue-600 mt-2">
            {(stats.reduce((sum, s) => sum + s.avgExecutionTime, 0) / stats.length / 1000).toFixed(2)}s
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Agent 调用次数</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={callsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="成功" fill="#10b981" />
            <Bar dataKey="失败" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">平均响应时间（毫秒）</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="响应时间" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">成功率（%）</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={successRateData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="成功率" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">总调用</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">成功</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">失败</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">成功率</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">平均响应时间</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stats.map((stat) => (
              <tr key={stat.agentId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stat.agentId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.totalCalls.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{stat.successCalls.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{stat.failedCalls.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    stat.successRate >= 95 ? 'bg-green-100 text-green-800' :
                    stat.successRate >= 80 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {stat.successRate.toFixed(1)}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(stat.avgExecutionTime / 1000).toFixed(2)}s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
