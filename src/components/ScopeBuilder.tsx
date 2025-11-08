import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Download } from 'lucide-react';
import { ScopeItem } from '../types';
import { formatCurrency } from '../utils/pricing';

export const ScopeBuilder: React.FC = () => {
  const [scopeItems, setScopeItems] = useState<ScopeItem[]>([
    {
      id: '1',
      name: 'Initial Consultation & Requirements',
      description: 'Project kickoff meeting and requirements gathering',
      estimatedHours: 4,
      hourlyRate: 75,
      total: 300
    }
  ]);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    estimatedHours: 1,
    hourlyRate: 75
  });
  const [projectName, setProjectName] = useState('Website Development Project');
  const [clientName, setClientName] = useState('');

  const addScopeItem = () => {
    if (!newItem.name.trim()) return;

    const item: ScopeItem = {
      id: Date.now().toString(),
      name: newItem.name,
      description: newItem.description,
      estimatedHours: newItem.estimatedHours,
      hourlyRate: newItem.hourlyRate,
      total: newItem.estimatedHours * newItem.hourlyRate
    };

    setScopeItems([...scopeItems, item]);
    setNewItem({
      name: '',
      description: '',
      estimatedHours: 1,
      hourlyRate: 75
    });
  };

  const removeScopeItem = (id: string) => {
    setScopeItems(scopeItems.filter(item => item.id !== id));
  };

  const updateScopeItem = (id: string, updates: Partial<ScopeItem>) => {
    setScopeItems(scopeItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, ...updates };
        updated.total = updated.estimatedHours * updated.hourlyRate;
        return updated;
      }
      return item;
    }));
  };

  const totalHours = scopeItems.reduce((sum, item) => sum + item.estimatedHours, 0);
  const totalPrice = scopeItems.reduce((sum, item) => sum + item.total, 0);

  const exportQuote = () => {
    const quoteData = {
      projectName,
      clientName,
      scopeItems,
      totalHours,
      totalPrice,
      createdAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(quoteData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '_')}_quote.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="scope" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Interactive Scope Builder</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Create detailed project scopes with accurate time estimates and professional quotes
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Scope Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4">Project Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter client name"
                  />
                </div>
              </div>
            </div>

            {/* Add New Item */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4">Add Scope Item</h4>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Task name (e.g., Frontend Development)"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Task description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hours</label>
                    <input
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={newItem.estimatedHours}
                      onChange={(e) => setNewItem({ ...newItem, estimatedHours: parseFloat(e.target.value) || 1 })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rate/Hour</label>
                    <input
                      type="number"
                      min="1"
                      value={newItem.hourlyRate}
                      onChange={(e) => setNewItem({ ...newItem, hourlyRate: parseFloat(e.target.value) || 1 })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <button
                  onClick={addScopeItem}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Item
                </button>
              </div>
            </div>

            {/* Scope Items List */}
            <div className="space-y-4">
              {scopeItems.map((item, index) => (
                <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900 mb-1">{index + 1}. {item.name}</h5>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                    <button
                      onClick={() => removeScopeItem(item.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button className=" hover:text-gray-600 p-1"
                      onClick={() => console.log(item) /*() => updateScopeItem(item.id, item)*/}
                    >
                      <Edit3 className="h-5 w-5 mr-2" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Hours:</span>
                      <div className="font-medium">{item.estimatedHours}h</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Rate:</span>
                      <div className="font-medium">{formatCurrency(item.hourlyRate)}/h</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Total:</span>
                      <div className="font-bold text-blue-600">{formatCurrency(item.total)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-6">
              <h4 className="font-semibold text-gray-900 mb-6">Project Summary</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Items:</span>
                  <span className="font-medium">{scopeItems.length}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Hours:</span>
                  <span className="font-medium">{totalHours}h</span>
                </div>
                <div className="flex justify-between items-center py-3 border-t-2 border-gray-200">
                  <span className="text-lg font-semibold text-gray-900">Total Price:</span>
                  <span className="text-2xl font-bold text-blue-600">{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={exportQuote}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Export Quote
                </button>
               
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <h5 className="font-semibold text-blue-900 mb-3">💡 Pro Tips</h5>
              <ul className="text-blue-800 text-sm space-y-2">
                <li>• Break down complex tasks into smaller items</li>
                <li>• Include buffer time for revisions</li>
                <li>• Consider project management overhead</li>
                <li>• Add communication and meeting time</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};