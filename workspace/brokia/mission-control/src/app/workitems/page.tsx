'use client';

import { useEffect, useState } from 'react';

interface WorkItem {
  id: string;
  type: string;
  title: string;
  status: string;
  owner: string;
  priority: string;
  tags: string[];
  needs_clarification: boolean;
  implementation_approved: boolean;
  allowed_actions: string[];
}

interface WorkItemsData {
  total_items: number;
  counts_by_status: Record<string, number>;
  counts_by_type: Record<string, number>;
  items: WorkItem[];
}

interface ApiResponse {
  success: boolean;
  action: string;
  message: string;
  data: WorkItemsData;
}

export default function WorkItemsPage() {
  const [data, setData] = useState<WorkItemsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWorkItems() {
      try {
        const response = await fetch('/api/workitems');
        const result: ApiResponse = await response.json();
        
        if (result.success && result.data) {
          setData(result.data);
        } else {
          setError(result.message || 'Failed to load workitems');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchWorkItems();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Work Items</h1>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Work Items</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Work Items</h1>
          <p className="text-gray-600">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Work Items</h1>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-sm font-medium text-gray-500 uppercase">Total Items</h2>
            <p className="text-3xl font-bold text-gray-900">{data.total_items}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-sm font-medium text-gray-500 uppercase">By Status</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {Object.entries(data.counts_by_status)
                .filter(([, count]) => count > 0)
                .map(([status, count]) => (
                  <span key={status} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {status}: {count}
                  </span>
                ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-sm font-medium text-gray-500 uppercase">By Type</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {Object.entries(data.counts_by_type)
                .filter(([, count]) => count > 0)
                .map(([type, count]) => (
                  <span key={type} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {type}: {count}
                  </span>
                ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allowed Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {item.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.status === 'DONE' ? 'bg-green-100 text-green-800' :
                      item.status === 'DROPPED' ? 'bg-gray-100 text-gray-800' :
                      item.needs_clarification ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div className="flex flex-wrap gap-1">
                      {item.allowed_actions.slice(0, 3).map((action) => (
                        <span key={action} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {action}
                        </span>
                      ))}
                      {item.allowed_actions.length > 3 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                          +{item.allowed_actions.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
