import React from 'react';
import { DssTable } from '../components/DssTable';
import { ExportAction } from '../components/ExportAction';

export function DssPage({ cows, handleAddNewCow, onViewDetail }) {
  return (
    <div className="space-y-4">
      {/* Export Utility */}
      <ExportAction 
        filteredCount={cows.length} 
        onExport={(type) => console.log(`Exported as ${type}`)} 
      />
      
      {/* Main DSS Table Component */}
      <DssTable 
        cows={cows} 
        onAddNewCow={handleAddNewCow} 
        onViewDetail={onViewDetail}
      />
    </div>
  );
}
