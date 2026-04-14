'use client';

import { useState, useEffect } from 'react';
import { 
  KeyIcon, 
  ServerIcon, 
  BellIcon, 
  ShieldCheckIcon,
  Cog6ToothIcon 
} from '@heroicons/react/24/outline';

interface SystemConfig {
  key: string;
  value: string;
  description: string;
}

export default function SettingsPage() {
  const [configs, setConfigs] = useState<SystemConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      // TODO: 实现获取系统配置的 API
      // const response = await fetch('/api/admin/settings');
      // const data = await response.json();
      // setConfigs(data);
      
      // 临时数据
      setConfigs([
        {
          key: 'site_name',
          value: '问海伦',
          description: '网站名称',
        },
        {
          key: 'api_key',
          value: 'sk-MRHzxg71EAhc5Fl303WQaSgLW15IbjBbG9wVHOfv0Fk5VASv',
          description: 'Claude API Key',
        },
        {
          key: 'api_base_url',
          value: 'https://hone.vvvv.ee/',
          description: 'API Base URL',
        },
      ]);
    } catch (error) {
      console.error('获取配置失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: 实现保存系统配置的 API
      // await fetch('/api/admin/settings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(configs),
      // });
      
      alert('保存成功！');
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败');
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (key: string, value: string) => {
    setConfigs(configs.map(c => c.key === key ? { ...c, value } : c));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-gray-400">加载中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-white">系统设置</h1>
        <p className="mt-1 text-sm text-gray-400">管理系统配置和参数</p>
      </div>

      {/* 设置分类 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 基本设置 */}
        <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Cog6ToothIcon className="h-5 w-5 text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">基本设置</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                网站名称
              </label>
              <input
                type="text"
                value={configs.find(c => c.key === 'site_name')?.value || ''}
                onChange={(e) => updateConfig('site_name', e.target.value)}
                className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg text-white placeholder-gray-500 focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* API 配置 */}
        <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <KeyIcon className="h-5 w-5 text-purple-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">API 配置</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                API Base URL
              </label>
              <input
                type="text"
                value={configs.find(c => c.key === 'api_base_url')?.value || ''}
                onChange={(e) => updateConfig('api_base_url', e.target.value)}
                className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg text-white placeholder-gray-500 focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                API Key
              </label>
              <input
                type="password"
                value={configs.find(c => c.key === 'api_key')?.value || ''}
                onChange={(e) => updateConfig('api_key', e.target.value)}
                className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg text-white placeholder-gray-500 focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* 服务器信息 */}
        <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <ServerIcon className="h-5 w-5 text-green-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">服务器信息</h2>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Node.js 版本</span>
              <span className="text-white">v23.11.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Next.js 版本</span>
              <span className="text-white">16.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">数据库</span>
              <span className="text-white">PostgreSQL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">运行时间</span>
              <span className="text-white">2小时15分</span>
            </div>
          </div>
        </div>

        {/* 安全设置 */}
        <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <ShieldCheckIcon className="h-5 w-5 text-red-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">安全设置</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">启用 HTTPS</div>
                <div className="text-xs text-gray-400 mt-1">强制使用 HTTPS 连接</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-[#1a1a1a] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#d4af37] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">双因素认证</div>
                <div className="text-xs text-gray-400 mt-1">管理员登录需要 2FA</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-[#1a1a1a] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#d4af37] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 保存按钮 */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0a0a0a] rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {saving ? '保存中...' : '保存设置'}
        </button>
      </div>
    </div>
  );
}
