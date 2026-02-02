import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import SubcontractorDirectory from './SubcontractorDirectory';
import Suppliers from './Suppliers';

const Directory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'sc' | 'suppliers'>((searchParams.get('tab') as any) || 'sc');

  // Update active tab when URL search parameter changes
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && (tab === 'sc' || tab === 'suppliers')) {
      setActiveTab(tab as any);
    }
  }, [searchParams]);

  return (
    <div className="flex h-full w-full flex-col bg-white dark:bg-[#0f1115] text-gray-900 dark:text-white transition-colors duration-500 font-sans p-8 pt-6">

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-50">
        <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-yellow-400/10 dark:bg-yellow-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-gray-400/5 dark:bg-white/5 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto w-full space-y-6 relative z-10 flex flex-col h-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
          <div>
            <div className="flex items-center gap-8 mb-1">
              <button
                onClick={() => setSearchParams({ tab: 'sc' })}
                className={cn(
                  "text-3xl font-black tracking-tight transition-all flex items-center gap-3",
                  activeTab === 'sc' ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-600 hover:text-gray-500"
                )}
              >
                Sub Contractors
              </button>
              <button
                onClick={() => setSearchParams({ tab: 'suppliers' })}
                className={cn(
                  "text-3xl font-black tracking-tight transition-all flex items-center gap-3",
                  activeTab === 'suppliers' ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-600 hover:text-gray-500"
                )}
              >
                Suppliers
              </button>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-bold text-sm mt-2">
              {activeTab === 'sc'
                ? 'Discover and manage verified specialty subcontractors'
                : 'Direct procurement and tier-1 resource providers'}
            </p>
          </div>
        </div>

        <div className="mt-4 flex-1 flex flex-col min-h-0">
          {activeTab === 'sc' ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-400 h-full flex flex-col">
              <SubcontractorDirectory />
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-400 h-full flex flex-col">
              <Suppliers />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Directory;
