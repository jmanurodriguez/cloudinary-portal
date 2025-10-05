'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Folder, Upload, Trash2, AlertCircle } from 'lucide-react';
import { CloudinaryFolder } from '@/types';

interface FolderCardProps {
  folder: CloudinaryFolder;
  onSelect: (folder: CloudinaryFolder) => void;
  onDelete?: (folder: CloudinaryFolder) => void;
  isAdmin?: boolean;
  isDeleting?: boolean;
}

const FolderCard: React.FC<FolderCardProps> = ({
  folder,
  onSelect,
  onDelete,
  isAdmin = false,
  isDeleting = false
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(folder);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className={`group relative bg-white/80 backdrop-blur-md rounded-3xl border-2 transition-all duration-300 cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl ${
        isDeleting
          ? 'border-red-300 bg-red-50/70 scale-95 opacity-75'
          : 'border-gray-200/50 hover:border-blue-400'
      }`}
      onClick={() => !isDeleting && onSelect(folder)}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-300/10 to-purple-300/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>

      {/* Card Content */}
      <div className="relative p-6">
        {/* Header with Icon and Delete Button */}
        <div className="flex items-start justify-between mb-4">
          <div className={`p-4 rounded-xl transition-all duration-300 ${
            isDeleting
              ? 'bg-red-100'
              : 'bg-blue-50 group-hover:bg-blue-100 group-hover:scale-110'
          }`}>
            {isDeleting ? (
              <AlertCircle className="w-8 h-8 text-red-500" />
            ) : (
              <Folder className="w-8 h-8 text-blue-600" />
            )}
          </div>

          {/* Delete Button (solo para admin) */}
          {isAdmin && !isDeleting && (
            <button
              onClick={handleDelete}
              className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 transition-all duration-200 hover:scale-110 opacity-100 group-hover:opacity-100"
              title="Eliminar carpeta"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}

          {/* Loading indicator durante eliminación */}
          {isDeleting && (
            <div className="p-2">
              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Folder Name */}
        <h3 className={`text-xl font-bold mb-2 transition-colors duration-200 ${
          isDeleting
            ? 'text-red-700'
            : 'text-gray-800 group-hover:text-blue-700'
        }`}>
          {folder.name}
        </h3>

        {/* Description */}
        <p className={`text-sm mb-4 transition-colors duration-200 ${
          isDeleting
            ? 'text-red-500'
            : 'text-gray-500 group-hover:text-gray-600'
        }`}>
          {isDeleting ? 'Eliminando carpeta...' : 'Haz clic para subir archivos'}
        </p>

        {/* Action Area */}
        <div className={`flex items-center gap-2 text-sm font-medium transition-colors duration-200 ${
          isDeleting
            ? 'text-red-600'
            : 'text-blue-600 group-hover:text-blue-700'
        }`}>
          {!isDeleting && <Upload className="w-4 h-4" />}
          <span>
            {isDeleting ? 'Procesando...' : 'Subir archivos'}
          </span>
        </div>

        {/* Bottom accent line */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 transition-all duration-300 ${
          isDeleting
            ? 'bg-gradient-to-r from-red-400 to-red-600'
            : 'bg-gradient-to-r from-blue-400 to-indigo-500 scale-x-0 group-hover:scale-x-100'
        }`}></div>
      </div>
    </motion.div>
  );
};

export default FolderCard;
