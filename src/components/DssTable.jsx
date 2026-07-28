import React, { useState } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { AddCowModal } from './AddCowModal';
import { AddWeighingModal } from './AddWeighingModal';
import { ConfirmModal } from './ConfirmModal';
import { SelectInput } from './SelectInput';
import { 
  MagnifyingGlassIcon, 
  CaretSortIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  Pencil1Icon,
  TrashIcon,
  PlusIcon,
  EyeOpenIcon
} from '@radix-ui/react-icons';
import { useAuth } from '../contexts/AuthContext';
import { useDssFilter } from '../hooks/useDssFilter';

// Tooltip helper component
function ActionTooltip({ content, children }) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        {children}
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content 
          className="z-50 bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-md tracking-wide"
          sideOffset={5}
        >
          {content}
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

/**
 * Main DSS Table Orchestrator Component
 */
export function DssTable({ cows, onAddNewCow, onEditCow, onDeleteCow, onViewDetail }) {
  const { user } = useAuth();
  // Bypass role restriction untuk sementara waktu, izinkan semua user melakukan operasi CRUD
  const isAdmin = true; 

  // Modal visibility and payload states
  const [isAddingCow, setIsAddingCow] = useState(false);
  const [isEditingCow, setIsEditingCow] = useState(false);
  const [editingCowData, setEditingCowData] = useState(null);

  // Pagination page count threshold
  const itemsPerPage = 8;

  // Custom data processing hook (search, filter, pagination, sort)
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    breedFilter,
    setBreedFilter,
    sortBy,
    sortOrder,
    currentPage,
    setCurrentPage,
    breedOptions,
    processedCows,
    totalPages,
    paginatedCows,
    handleSort,
    normalizeStatus
  } = useDssFilter(cows, itemsPerPage);

  const recommendationOptions = [
    { value: 'all', label: 'Semua Rekomendasi' },
    { value: 'LAYAK_DIPERTAHANKAN', label: 'Layak Dipertahankan' },
    { value: 'PERLU_EVALUASI', label: 'Perlu Evaluasi' },
    { value: 'TIDAK_LAYAK_DIPERTAHANKAN', label: 'Tidak Layak' },
    { value: 'BELUM_CUKUP_DATA', label: 'Belum Cukup Data' }
  ];

  const [cowToDelete, setCowToDelete] = useState(null);

  const handleEditClick = (cow, e) => {
    e.stopPropagation();
    setEditingCowData(cow);
    setIsEditingCow(true);
  };

  const handleDeleteClick = (cow, e) => {
    e.stopPropagation();
    setCowToDelete(cow);
  };

  return (
    <Tooltip.Provider>
      <div className="w-full space-y-4">
        
        {/* Style to hide scrollbar track and thumb */}
        <style>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      
        {/* Filter Toolbar Sub-component */}
        <DssFilterToolbar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          breedFilter={breedFilter}
          setBreedFilter={setBreedFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          breedOptions={breedOptions}
          recommendationOptions={recommendationOptions}
          isAdmin={isAdmin}
          setIsAddingCow={setIsAddingCow}
          setCurrentPage={setCurrentPage}
        />

        {/* Main Grid/Table with Rounded Container & Soft Shadow */}
        <div className="overflow-x-auto no-scrollbar bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs transition-colors duration-300">
          <table className="w-full text-left border-collapse">
            <DssTableHeader 
              sortBy={sortBy}
              sortOrder={sortOrder}
              handleSort={handleSort}
            />
            <tbody className="divide-y divide-gray-800">
              {paginatedCows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-xs text-gray-500 dark:text-gray-400 font-medium bg-gray-50/50 dark:bg-gray-900/50 transition-colors duration-300">
                    Tidak ada data sapi yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                paginatedCows.map((cow) => (
                  <DssTableRow 
                    key={cow.id}
                    cow={cow}
                    isAdmin={isAdmin}
                    handleEditClick={handleEditClick}
                    handleDeleteClick={handleDeleteClick}
                    onViewDetail={onViewDetail}
                    normalizeStatus={normalizeStatus}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls Sub-component */}
        <DssPagination 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          processedCowsCount={processedCows.length}
          totalPages={totalPages}
        />

        {/* Add New Cow Modal (Admin Only) */}
        {isAdmin && (
          <AddCowModal 
            isOpen={isAddingCow} 
            onClose={() => setIsAddingCow(false)} 
            onAdd={onAddNewCow} 
          />
        )}



        {/* Reusable Animated Confirm Modal */}
        <ConfirmModal
          isOpen={Boolean(cowToDelete)}
          title="Hapus Data Sapi"
          message={cowToDelete ? `Apakah Anda yakin ingin menghapus data sapi ${cowToDelete.name} (${cowToDelete.cow_code})? Seluruh riwayat penimbangan terkait sapi ini akan terhapus.` : ''}
          confirmText="Ya, Hapus Sapi"
          variant="danger"
          onClose={() => setCowToDelete(null)}
          onConfirm={() => {
            if (cowToDelete) {
              onDeleteCow(cowToDelete.id);
              setCowToDelete(null);
            }
          }}
        />
      </div>
    </Tooltip.Provider>
  );
}

/**
 * Filter and search toolbar sub-component
 */
function DssFilterToolbar({
  searchTerm,
  setSearchTerm,
  breedFilter,
  setBreedFilter,
  statusFilter,
  setStatusFilter,
  breedOptions,
  recommendationOptions,
  isAdmin,
  setIsAddingCow,
  setCurrentPage
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl p-3 shadow-2xs transition-colors duration-300">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-3xl">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
          </div>
          <input
            type="text"
            className="block w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black rounded-xl text-[12px] font-semibold text-gray-900 dark:text-white hover:border-gray-300 dark:hover:border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-800 focus:border-gray-300 dark:focus:border-gray-600 shadow-3xs transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            placeholder="Cari RFID / Nama Sapi..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <SelectInput
          value={breedFilter}
          onValueChange={(val) => {
            setBreedFilter(val);
            setCurrentPage(1);
          }}
          options={breedOptions}
          placeholder="Semua Rumpun"
        />

        <SelectInput
          value={statusFilter}
          onValueChange={(val) => {
            setStatusFilter(val);
            setCurrentPage(1);
          }}
          options={recommendationOptions}
          placeholder="Semua Rekomendasi"
        />
      </div>

      {isAdmin && (
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsAddingCow(true)}
            className="flex items-center justify-center gap-1.5 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black border border-black dark:border-white px-3.5 py-2 rounded-xl text-[12px] font-bold transition-all shadow-xs hover:shadow-sm cursor-pointer shrink-0"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Tambah Sapi Baru</span>
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Grid headers with sorting triggers
 */
function DssTableHeader({ sortBy, sortOrder, handleSort }) {
  return (
    <thead>
      <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <th 
          className="px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
          onClick={() => handleSort('name')}
        >
          <div className="flex items-center gap-1">
            Nama <CaretSortIcon className={sortBy === 'name' ? 'text-gray-900 dark:text-white' : 'opacity-50'} />
          </div>
        </th>
        <th className="px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 whitespace-nowrap">
          RFID
        </th>
        <th 
          className="px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
          onClick={() => handleSort('last_weight')}
        >
          <div className="flex items-center gap-1">
            Bobot <CaretSortIcon className={sortBy === 'last_weight' ? 'text-gray-900 dark:text-white' : 'opacity-50'} />
          </div>
        </th>
        <th className="px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 whitespace-nowrap">
          DSS
        </th>
        <th className="px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 text-right whitespace-nowrap">
          Aksi
        </th>
      </tr>
    </thead>
  );
}

/**
 * Cattle record data row item
 */
function DssTableRow({ 
  cow, 
  isAdmin, 
  handleEditClick, 
  handleDeleteClick, 
  onViewDetail, 
  normalizeStatus 
}) {
  return (
    <tr className="group hover:bg-gray-50/50 dark:hover:bg-gray-900/40 transition-colors duration-150">
      <td className="px-3.5 py-2 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className="text-[13px] filter grayscale-0">🐄</span>
          <span className="font-bold text-[12px] text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {cow.name}
          </span>
        </div>
      </td>

      <td className="px-3.5 py-2 whitespace-nowrap">
        <span className="font-mono text-[10px] font-bold text-gray-500 dark:text-gray-400">
          {cow.cow_code}
        </span>
      </td>

      <td className="px-3.5 py-2 whitespace-nowrap">
        <div className="flex flex-col">
          <span className="text-[12.5px] font-bold text-gray-900 dark:text-white tracking-tight">{cow.last_weight}Kg</span>
          {cow.updated_at && (
            <span className="text-[9px] text-gray-500 font-semibold mt-0.5">
              Diperbarui: {new Date(cow.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
            </span>
          )}
        </div>
      </td>

      <td className="px-3.5 py-2 whitespace-nowrap">
        <div className="flex flex-col">
          {cow.dssLabel === 'BELUM_CUKUP_DATA' || !cow.dssLabel ? (
            <span className="text-[11px] font-semibold text-gray-500">
              -
            </span>
          ) : (
            <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${
              normalizeStatus(cow.dssLabel) === 'LAYAK DIPERTAHANKAN' ? 'text-emerald-500' : 
              normalizeStatus(cow.dssLabel) === 'PERLU EVALUASI' ? 'text-amber-500' : 
              'text-rose-500'
            }`}>
              <span>{normalizeStatus(cow.dssLabel) === 'LAYAK DIPERTAHANKAN' ? '✓' : '⚠'}</span>
              <span>{normalizeStatus(cow.dssLabel) === 'LAYAK DIPERTAHANKAN' ? 'Layak' : normalizeStatus(cow.dssLabel) === 'PERLU EVALUASI' ? 'Evaluasi' : 'Tidak Layak'}</span>
            </span>
          )}
        </div>
      </td>

      <td className="px-3.5 py-2 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1">
          <ActionTooltip content="Lihat Statistik & Prediksi">
            <button 
              onClick={() => onViewDetail(cow)}
              className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors cursor-pointer focus:outline-none"
            >
              <EyeOpenIcon className="w-4 h-4" />
            </button>
          </ActionTooltip>
          
          {isAdmin && (
            <>
              <ActionTooltip content="Edit Sapi">
                <button 
                  onClick={(e) => handleEditClick(cow, e)}
                  className="p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors cursor-pointer focus:outline-none"
                >
                  <Pencil1Icon className="w-4 h-4" />
                </button>
              </ActionTooltip>
              
              <ActionTooltip content="Hapus Sapi">
                <button 
                  onClick={(e) => handleDeleteClick(cow, e)}
                  className="p-1 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-md transition-colors cursor-pointer focus:outline-none"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </ActionTooltip>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

/**
 * Pagination footer tracker
 */
function DssPagination({
  currentPage,
  setCurrentPage,
  itemsPerPage,
  processedCowsCount,
  totalPages
}) {
  return (
    <div className="py-3 flex items-center justify-between">
      <p className="text-xs text-gray-500">
        Menampilkan <span className="font-semibold text-gray-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</span> hingga <span className="font-semibold text-gray-900 dark:text-white">{Math.min(currentPage * itemsPerPage, processedCowsCount)}</span> dari <span className="font-semibold text-gray-900 dark:text-white">{processedCowsCount}</span> sapi
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-1 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeftIcon className="w-3.5 h-3.5" />
        </button>
        
        <div className="px-2.5 text-xs font-medium text-gray-700 dark:text-gray-300">
          {currentPage} / {totalPages}
        </div>

        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-1 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRightIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
