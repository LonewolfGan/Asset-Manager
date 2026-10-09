import { useState, useMemo, useCallback } from 'react';
import {
  filterAndSortTabularRows,
  paginateTabularRows,
  type TabularSortDir,
} from '@/lib/csv-data-logic';

export interface UseCsvViewerDataReturn {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sortCol: number | null;
  sortDir: TabularSortDir;
  handleSort: (colIdx: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  filteredAndSortedRows: ReturnType<typeof filterAndSortTabularRows>;
  paginatedRows: ReturnType<typeof filterAndSortTabularRows>;
  totalPages: number;
  resetViewParams: () => void;
}

export function useCsvViewerData(rows: string[][]): UseCsvViewerDataReturn {
  const [searchQuery, setSearchQueryState] = useState<string>('');
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortDir, setSortDir] = useState<TabularSortDir>(null);
  const [pageSize, setPageSizeState] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const setSearchQuery = useCallback((q: string) => {
    setSearchQueryState(q);
    setCurrentPage(1);
  }, []);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setCurrentPage(1);
  }, []);

  const handleSort = useCallback((colIdx: number) => {
    setSortCol((prevCol) => {
      if (prevCol === colIdx) {
        setSortDir((prevDir) => {
          if (prevDir === 'asc') return 'desc';
          if (prevDir === 'desc') return null;
          return 'asc';
        });
        return prevCol;
      }
      setSortDir('asc');
      return colIdx;
    });
    setCurrentPage(1);
  }, []);

  const filteredAndSortedRows = useMemo(() => {
    return filterAndSortTabularRows(rows, searchQuery, sortCol, sortDir);
  }, [rows, searchQuery, sortCol, sortDir]);

  const totalPages = Math.ceil(filteredAndSortedRows.length / pageSize) || 1;

  const paginatedRows = useMemo(() => {
    return paginateTabularRows(filteredAndSortedRows, currentPage, pageSize);
  }, [filteredAndSortedRows, currentPage, pageSize]);

  const resetViewParams = useCallback(() => {
    setSearchQueryState('');
    setSortCol(null);
    setSortDir(null);
    setCurrentPage(1);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    sortCol,
    sortDir,
    handleSort,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    filteredAndSortedRows,
    paginatedRows,
    totalPages,
    resetViewParams,
  };
}
