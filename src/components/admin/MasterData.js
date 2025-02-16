import { useState } from 'react';
import ManageTribes from './ManageTribes';
import ManageAttributes from './ManageAttributes';

export default function MasterData() {
  const [activeTab, setActiveTab] = useState('tribes');

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Content */}
        <div className="mt-6">
          {activeTab === 'tribes' ? <ManageTribes /> : <ManageAttributes />}
        </div>
      </div>
    </div>
  );
}