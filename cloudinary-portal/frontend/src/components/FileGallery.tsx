import React, { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { RefreshCw, AlertCircle, FileText, Image as ImageIcon, File, Download, ExternalLink, Calendar, HardDrive, Trash2 } from 'lucide-react';
import { CloudinaryFile } from '../types';
import { getFolderFiles, deleteFile } from '../services/api';
import { isUserAdmin } from '../lib/clerk';

interface FileGalleryProps {
  folderName: string;
  onRefresh?: () => void;
}

const FileGallery: React.FC<FileGalleryProps> = ({ folderName, onRefresh }) => {
  const [files, setFiles] = useState<CloudinaryFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(new Set());

  // Usar Clerk
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const isAdmin = isSignedIn && isUserAdmin(user?.emailAddresses[0]?.emailAddress);
  
  // En desarrollo local, permitir acciones de admin sin autenticación
  const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const canDelete = isDevelopment || isAdmin;

  const loadFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const filesData = await getFolderFiles(folderName);
      setFiles(filesData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los archivos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [folderName]);

  const handleRefresh = () => {
    loadFiles();
    onRefresh?.();
  };

  const handleDeleteFile = async (file: CloudinaryFile) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar "${file.filename}"?`)) {
      return;
    }

    setDeletingFiles(prev => new Set(prev).add(file.public_id));

    try {
      // Obtener token de autenticación si está disponible
      let token = null;
      if (getToken) {
        token = await getToken();
        if (!token) {
          throw new Error('No se pudo obtener el token de autorización');
        }
      }

      // Llamar a la API para eliminar el archivo
      await deleteFile(file.public_id, token || '');

      // Recargar archivos después de eliminar
      await loadFiles();
    } catch (error: any) {
      console.error('Error al eliminar archivo:', error);
      alert('Error al eliminar el archivo: ' + error.message);
    } finally {
      setDeletingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(file.public_id);
        return newSet;
      });
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (file: CloudinaryFile) => {
    if (file.resource_type === 'image') {
      return <ImageIcon className="w-6 h-6 text-blue-500" />;
    }
    
    const format = file.format?.toLowerCase();
    if (format === 'pdf') {
      return <FileText className="w-6 h-6 text-red-500" />;
    }
    
    return <File className="w-6 h-6 text-gray-500" />;
  };

  const isImage = (file: CloudinaryFile): boolean => {
    return file.resource_type === 'image';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando archivos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-red-50 rounded-xl border border-red-200">
        <AlertCircle className="w-8 h-8 text-red-500 mb-4" />
        <p className="text-red-600 mb-4 text-center">{error}</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Reintentar
        </button>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-dashed border-gray-300">
        <div className="p-4 bg-white rounded-full mb-4 shadow-sm">
          <File className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-600 font-medium mb-2">No hay archivos en esta carpeta</p>
        <p className="text-sm text-gray-500 mb-4">
          Sube algunos archivos para empezar
        </p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Archivos Subidos ({files.length})
          </h3>
          <p className="text-sm text-gray-500">
            Total: {formatBytes(files.reduce((sum, file) => sum + file.bytes, 0))}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="p-2 text-gray-500 hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-50"
          title="Actualizar lista"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {files.map((file) => (
          <div
            key={file.public_id}
            className={`group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
              deletingFiles.has(file.public_id) ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            {/* Preview */}
            <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
              {isImage(file) ? (
                <img
                  src={file.url}
                  alt={file.filename}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    // Si la imagen falla al cargar, mostrar ícono
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextElementSibling) {
                      (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              
              {/* Fallback para archivos no imagen o PDFs */}
              <div 
                className={`w-full h-full flex flex-col items-center justify-center gap-3 ${isImage(file) ? 'hidden' : ''}`}
                style={{ display: isImage(file) ? 'none' : 'flex' }}
              >
                {file.format?.toLowerCase() === 'pdf' ? (
                  <>
                    <FileText className="w-16 h-16 text-red-500" />
                    <div className="text-center px-4">
                      <p className="text-sm font-medium text-gray-700">Documento PDF</p>
                      <p className="text-xs text-gray-500 mt-1">{formatBytes(file.bytes)}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <File className="w-16 h-16 text-gray-400" />
                    <div className="text-center px-4">
                      <p className="text-sm font-medium text-gray-700">{file.format?.toUpperCase()}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatBytes(file.bytes)}</p>
                    </div>
                  </>
                )}
              </div>
              
              {/* Overlay con acciones */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white rounded-full hover:bg-blue-500 hover:text-white transition-colors"
                  title="Ver archivo"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href={file.url}
                  download
                  className="p-2 bg-white rounded-full hover:bg-green-500 hover:text-white transition-colors"
                  title="Descargar"
                >
                  <Download className="w-4 h-4" />
                </a>
                {canDelete && (
                  <button
                    onClick={() => handleDeleteFile(file)}
                    disabled={deletingFiles.has(file.public_id)}
                    className="p-2 bg-white rounded-full hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title={deletingFiles.has(file.public_id) ? "Eliminando..." : "Eliminar archivo"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Badge de formato */}
              <div className="absolute top-2 right-2 px-2 py-1 bg-black bg-opacity-60 text-white text-xs font-medium rounded backdrop-blur-sm">
                {file.format?.toUpperCase()}
              </div>
            </div>

            {/* Info */}
            <div className="p-3 space-y-2">
              <div className="flex items-start gap-2">
                {getFileIcon(file)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate" title={file.filename}>
                    {file.filename}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <HardDrive className="w-3 h-3" />
                  <span>{formatBytes(file.bytes)}</span>
                </div>
                {file.width && file.height && (
                  <div className="flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    <span>{file.width}×{file.height}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(file.created_at)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileGallery;
