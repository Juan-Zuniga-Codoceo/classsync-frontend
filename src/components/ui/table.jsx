// src/components/ui/table.jsx
import React from 'react';

export function Table({ children, className = '' }) {
  return (
    <div className="relative w-full overflow-auto">
      <table className={`w-full caption-bottom text-sm ${className}`}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className = '' }) {
  return (
    <thead className={`border-b border-gray-200 bg-gray-50/40 ${className}`}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className = '' }) {
  return (
    <tbody className={`[&_tr:last-child]:border-0 ${className}`}>
      {children}
    </tbody>
  );
}

export function TableFooter({ children, className = '' }) {
  return (
    <tfoot className={`border-t bg-gray-50/50 font-medium ${className}`}>
      {children}
    </tfoot>
  );
}

export function TableRow({ children, className = '' }) {
  return (
    <tr className={`border-b border-gray-200 transition-colors hover:bg-gray-50/50 ${className}`}>
      {children}
    </tr>
  );
}

export function TableHead({ children, className = '' }) {
  return (
    <th className={`h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 ${className}`}>
      {children}
    </th>
  );
}

export function TableCell({ children, className = '' }) {
  return (
    <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}>
      {children}
    </td>
  );
}