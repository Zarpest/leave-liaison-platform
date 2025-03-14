
import React, { memo } from "react";
import { CalendarClock, Filter } from "lucide-react";

interface EmptyDateViewProps {
  hasActiveFilters?: boolean;
}

const EmptyDateView = ({ hasActiveFilters = false }: EmptyDateViewProps) => {
  return (
    <div className="py-8 text-center border rounded-lg bg-muted/20">
      {hasActiveFilters ? (
        <>
          <Filter className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            No hay permisos que coincidan con los filtros seleccionados.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Intenta cambiar los filtros para ver más resultados.
          </p>
        </>
      ) : (
        <>
          <CalendarClock className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Nadie tiene permiso para la fecha seleccionada.
          </p>
        </>
      )}
    </div>
  );
};

// Memoize the component since it doesn't need to re-render often
export default memo(EmptyDateView);
