'use client';

import { useEffect, useState } from 'react';

interface Workitem {
  id: string;
  title: string;
  status: string;
  type: string;
  allowed_actions: string[];
  [key: string]: unknown;
}

interface WorkitemsResponse {
  workitems: Workitem[];
  total_items: number;
  counts_by_status: Record<string, number>;
  counts_by_type: Record<string, number>;
}

interface ApiResponse {
  success: boolean;
  action: string;
  id: string;
  message: string;
  stdout: string;
  stderr: string;
  blocked_by_guardrail: boolean;
  data?: WorkitemsResponse;
}

interface PageState {
  loading: boolean;
  error: string | null;
  data: WorkitemsResponse | null;
}

export default function WorkitemsPage() {
  const [state, setState] = useState<PageState>({
    loading: true,
    error: null,
    data: null,
  });

  useEffect(() => {
    async function fetchWorkitems() {
      try {
        const response = await fetch('/api/workitems');
        const data: ApiResponse = await response.json();

        if (!data.success || !data.data) {
          setState({
            loading: false,
            error: data.message || 'Failed to fetch work items',
            data: null,
          });
          return;
        }

        setState({
          loading: false,
          error: null,
          data: data.data,
        });
      } catch (err) {
        setState({
          loading: false,
          error: err instanceof Error ? err.message : 'Network error',
          data: null,
        });
      }
    }

    fetchWorkitems();
  }, []);

  if (state.loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">Work Items</h1>
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">Work Items</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Error: {state.error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!state.data) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">Work Items</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-600">No work items found</p>
          </div>
        </div>
      </div>
    );
  }

  const { total_items, counts_by_status, counts_by_type, workitems } = state.data;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Work Items</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Items</h2>
            <p className="text-4xl font-bold text-blue-600">{total_items}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">By Status</h2>
            <div className="space-y-1">
              {Object.entries(counts_by_status).map(([status, count]) => (
                <div key={status} className="flex justify-between text-sm">
                  <span className="text-gray-600">{status}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">By Type</h2>
            <div className="space-y-1">
              {Object.entries(counts_by_type).map(([type, count]) => (
                <div key={type} className="flex justify-between text-sm">
                  <span className="text-gray-600">{type}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Workitems Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Allowed Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {workitems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {item.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-1 flex-wrap">
                      {item.allowed_actions.map((action) => (
                        <span
                          key={action}
                          className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-600"
                        >
                          {action}
                        </span>
                      ))}
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