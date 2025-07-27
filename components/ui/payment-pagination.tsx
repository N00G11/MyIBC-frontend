"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaymentPaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

export function PaymentPagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
}: PaymentPaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4 border-t bg-gray-50">
      {/* Informations sur les éléments affichés */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>
          Affichage de <span className="font-medium">{startItem}</span> à <span className="font-medium">{endItem}</span> sur <span className="font-medium">{totalItems}</span> paiements
        </span>
      </div>

      {/* Contrôles de pagination */}
      <div className="flex items-center gap-4">
        {/* Sélecteur du nombre d'éléments par page */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">Afficher</span>
          <Select value={itemsPerPage.toString()} onValueChange={(value) => onItemsPerPageChange(Number(value))}>
            <SelectTrigger className="w-16 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-gray-600">par page</span>
        </div>

        {/* Navigation des pages */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            {/* Première page */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
              title="Première page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>

            {/* Page précédente */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
              title="Page précédente"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Numéros de page */}
            {visiblePages.map((page, index) => (
              <Button
                key={index}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => typeof page === 'number' ? onPageChange(page) : undefined}
                disabled={page === '...'}
                className={`h-8 w-8 p-0 ${
                  page === currentPage ? 'bg-myibc-blue text-white hover:bg-myibc-blue/90' : ''
                }`}
                title={typeof page === 'number' ? `Page ${page}` : undefined}
              >
                {page}
              </Button>
            ))}

            {/* Page suivante */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
              title="Page suivante"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Dernière page */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
              title="Dernière page"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
