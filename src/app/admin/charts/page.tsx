'use client';

import { useEffect, useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import FileUpload from '@/components/admin/FileUpload';

interface Chart {
  url: string;
  uploadedAt: string;
}

export default function ChartsPage() {
  const [charts, setCharts] = useState<Chart[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCharts();
  }, []);

  const fetchCharts = async () => {
    try {
      const stored = localStorage.getItem('charts');
      if (stored) {
        setCharts(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = (url: string) => {
    const newChart = {
      url,
      uploadedAt: new Date().toISOString(),
    };
    const updated = [newChart, ...charts];
    setCharts(updated);
    localStorage.setItem('charts', JSON.stringify(updated));
  };

  const handleDelete = (url: string) => {
    if (!confirm('确定要删除这张图表吗？')) return;

    const updated = charts.filter((c) => c.url !== url);
    setCharts(updated);
    localStorage.setItem('charts', JSON.stringify(updated));
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('zh-CN');
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-white">图表管理</h1>
        <p className="mt-1 text-sm text-gray-400">每日一图上传与管理</p>
      </div>

      {/* 上传区域 */}
      <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">上传新图表</h2>
        <FileUpload onUpload={handleUpload} accept="image/*" maxSize={10} />
      </div>

      {/* 图表列表 */}
      <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">已上传图表</h2>

        {loading ? (
          <div className="text-center text-gray-400 py-8">加载中...</div>
        ) : charts.length === 0 ? (
          <div className="text-center text-gray-400 py-8">暂无图表</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {charts.map((chart, index) => (
              <div key={index} className="border border-[#1a1a1a] rounded-lg overflow-hidden bg-[#0a0a0a]">
                <div className="aspect-video bg-[#0a0a0a] relative">
                  <img
                    src={chart.url}
                    alt={`Chart ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4 flex justify-between items-center border-t border-[#1a1a1a]">
                  <div className="text-sm text-gray-400">{formatDate(chart.uploadedAt)}</div>
                  <button
                    onClick={() => handleDelete(chart.url)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                    title="删除"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
