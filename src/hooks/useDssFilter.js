import { useState, useMemo } from 'react';

/**
 * Custom hook to filter, sort, and paginate DSS cows data
 * @param {Array} cows - Raw cows array from backend
 * @param {number} itemsPerPage - Number of rows to display per page
 */
export function useDssFilter(cows = [], itemsPerPage = 8) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [breedFilter, setBreedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('last_adg');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);

  // PRD Rule for DSS Status (matching backend decision thresholds)
  const getDssStatus = (cow) => {
    const weighCount = cow.weigh_count !== undefined ? cow.weigh_count : 0;
    if (weighCount < 3) return 'BELUM_CUKUP_DATA';

    const adg = cow.last_adg;
    if (adg === null || adg === undefined) return 'BELUM_CUKUP_DATA';
    if (adg > 0.3) return 'LAYAK_DIPERTAHANKAN';
    if (adg >= 0 && adg <= 0.3) return 'PERLU_EVALUASI';
    return 'TIDAK_LAYAK_DIPERTAHANKAN';
  };

  const normalizeStatus = (status) => {
    if (!status) return '';
    return status.replace(/_/g, ' ').toUpperCase();
  };

  const calculateAgeInMonths = (birthDateString) => {
    if (!birthDateString) return 0;
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let months = (today.getFullYear() - birthDate.getFullYear()) * 12;
    months -= birthDate.getMonth();
    months += today.getMonth();
    return months <= 0 ? 0 : months;
  };

  // Unique list of breeds (Jenis Sapi) for filters
  const uniqueBreeds = useMemo(() => {
    return Array.from(new Set(cows.map(c => c.breed))).filter(Boolean);
  }, [cows]);

  const breedOptions = useMemo(() => {
    return [
      { value: 'all', label: 'Semua Rumpun' },
      ...uniqueBreeds.map(b => ({ value: b, label: b }))
    ];
  }, [uniqueBreeds]);

  // Handle sorting toggles
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Process data (Search, Filter, Sort)
  const processedCows = useMemo(() => {
    return cows
      .map(cow => ({
        ...cow,
        dssLabel: getDssStatus(cow),
        ageMonths: calculateAgeInMonths(cow.birth_date)
      }))
      .filter((cow) => {
        const matchesSearch = 
          cow.cow_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cow.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = 
          statusFilter === 'all' || 
          normalizeStatus(cow.dssLabel) === normalizeStatus(statusFilter);
        
        const matchesBreed = 
          breedFilter === 'all' || 
          cow.breed === breedFilter;

        return matchesSearch && matchesStatus && matchesBreed;
      })
      .sort((a, b) => {
        let modifier = sortOrder === 'asc' ? 1 : -1;
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name) * modifier;
        }
        if (sortBy === 'cow_code') {
          return a.cow_code.localeCompare(b.cow_code) * modifier;
        }
        if (sortBy === 'last_weight') {
          return (a.last_weight - b.last_weight) * modifier;
        }
        if (sortBy === 'last_adg') {
          return (a.last_adg - b.last_adg) * modifier;
        }
        return 0;
      });
  }, [cows, searchTerm, statusFilter, breedFilter, sortBy, sortOrder]);

  const totalPages = Math.ceil(processedCows.length / itemsPerPage) || 1;

  const paginatedCows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedCows.slice(start, start + itemsPerPage);
  }, [processedCows, currentPage, itemsPerPage]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    breedFilter,
    setBreedFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
    breedOptions,
    processedCows,
    totalPages,
    paginatedCows,
    handleSort,
    normalizeStatus
  };
}
