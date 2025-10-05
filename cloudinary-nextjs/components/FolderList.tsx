'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, useAuth } from '@clerk/nextjs';
import { Folder, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { CloudinaryFolder } from '@/types';
import { getFolders, deleteFolder } from '@/lib/api';
import FolderCard from './FolderCard';
import { isUserAdmin, isDevelopmentMode } from '@/lib/clerk';

interface FolderListProps {
  onFolderSelect: (folder: CloudinaryFolder) => void;
}

const FolderList: React.FC<FolderListProps> = ({ onFolderSelect }) => {
  const [folders, setFolders] = useState<CloudinaryFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingFolders, setDeletingFolders] = useState<Set<string>>(new Set());

  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const isAdmin = isSignedIn && isUserAdmin(user?.emailAddresses[0]?.emailAddress);
  const isDevelopment = isDevelopmentMode();
  const canDelete = isDevelopment || isAdmin;

  const loadFolders = async () => {
    try {
      setLoading(true);
      setError(null);
      const foldersData = await getFolders();
      setFolders(foldersData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las carpetas');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFolder = async (folder: CloudinaryFolder) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar la carpeta "${folder.name}"? Esta acción eliminará todos los archivos dentro de la carpeta.`)) {
      return;
    }

    setDeletingFolders(prev => new Set(prev).add(folder.name));

    try {
      let token = null;
      if (getToken) {
        token = await getToken();
        if (!token) {
          throw new Error('No se pudo obtener el token de autorización');
        }
      }

      await deleteFolder(folder.name, token || '');
      await loadFolders();
    } catch (error: any) {
      console.error('Error al eliminar carpeta:', error);
      alert('Error al eliminar la carpeta: ' + error.message);
    } finally {
      setDeletingFolders(prev => {
        const newSet = new Set(prev);
        newSet.delete(folder.name);
        return newSet;
      });
    }
  };

  useEffect(() => {
    loadFolders();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header con skeleton */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl"
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <div className="h-7 w-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Loading Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/80 backdrop-blur-md rounded-3xl border-2 border-gray-200/50 p-6 shadow-lg"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl animate-pulse w-16 h-16"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="space-y-3">
                <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse w-3/4"></div>
                <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse w-1/2"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-12 px-6"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
        >
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        </motion.div>
        <p className="text-red-600 mb-4 text-center text-lg font-medium">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadFolders}
          className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
        >
          <RefreshCw className="w-5 h-5" />
          Reintentar
        </motion.button>
      </motion.div>
    );
  }

  if (folders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 px-6"
      >
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="p-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl mb-6"
        >
          <Folder className="w-16 h-16 text-blue-600" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Sin carpetas aún</h3>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          Comienza creando tu primera carpeta para organizar tus archivos
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadFolders}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
        >
          <RefreshCw className="w-5 h-5" />
          Actualizar
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header mejorado con animación */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="p-2.5 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl shadow-lg"
          >
            <Sparkles className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Tus Carpetas
            </h3>
            <p className="text-sm text-gray-500">{folders.length} {folders.length === 1 ? 'carpeta disponible' : 'carpetas disponibles'}</p>
          </div>
        </div>
        <motion.button
          whileHover={{ rotate: 180, scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={loadFolders}
          className="p-3 text-gray-500 hover:text-blue-600 transition-colors rounded-xl hover:bg-blue-50 shadow-sm hover:shadow-md"
          title="Actualizar carpetas"
        >
          <RefreshCw className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* Grid con animaciones stagger */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.08
            }
          }
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {folders.map((folder, index) => (
            <motion.div
              key={folder.path}
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.9 },
                visible: { opacity: 1, y: 0, scale: 1 }
              }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              layout
            >
              <FolderCard
                folder={folder}
                onSelect={onFolderSelect}
                onDelete={canDelete ? handleDeleteFolder : undefined}
                isAdmin={canDelete}
                isDeleting={deletingFolders.has(folder.name)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default FolderList;
