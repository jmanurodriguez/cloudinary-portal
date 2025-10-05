'use client';

import { useState } from 'react';
import { useUser, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs';
import { Cloud, ArrowLeft, Shield, FolderPlus, Upload, Sparkles } from 'lucide-react';
import FolderList from '@/components/FolderList';
import FileGallery from '@/components/FileGallery';
import UploadModal from '@/components/UploadModal';
import CreateFolderModal from '@/components/CreateFolderModal';
import { CloudinaryFolder } from '@/types';
import { isUserAdmin, isDevelopmentMode } from '@/lib/clerk';

export default function Home() {
  const [selectedFolder, setSelectedFolder] = useState<CloudinaryFolder | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Usar Clerk
  const { isSignedIn, user, isLoaded } = useUser();
  const isAdmin = isSignedIn && isUserAdmin(user?.emailAddresses[0]?.emailAddress);
  
  // En desarrollo local, permitir acciones de admin sin autenticación
  const isDevelopment = isDevelopmentMode();
  const canCreateFolder = isDevelopment || isAdmin;

  const handleFolderSelect = (folder: CloudinaryFolder) => {
    setSelectedFolder(folder);
  };

  const handleOpenUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
    setRefreshKey(prev => prev + 1);
  };

  const handleCreateFolderSuccess = (folderName: string) => {
    console.log('Carpeta creada:', folderName);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="relative p-2.5 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl shadow-lg group hover:shadow-xl transition-all">
                <Cloud className="w-6 h-6 text-white" />
                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Cloudvault
                </h1>
                <p className="text-xs text-gray-500">Gestión inteligente de archivos</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {canCreateFolder && (
                <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full border border-amber-200">
                  <Shield className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-700">
                    {isDevelopment && !isAdmin ? 'Dev Mode' : 'Admin'}
                  </span>
                </div>
              )}

              {!isLoaded && <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>}

              {isLoaded && !isSignedIn && (
                <div className="flex items-center gap-2">
                  <SignInButton mode="modal">
                    <button className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors">
                      Iniciar Sesión
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                      Registrarse
                    </button>
                  </SignUpButton>
                </div>
              )}

              {isLoaded && isSignedIn && (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">{user?.firstName || 'Usuario'}</p>
                    <p className="text-xs text-gray-500">{user?.emailAddresses[0]?.emailAddress}</p>
                  </div>
                  <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-10 h-10" } }} />
                </div>
              )}

              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">En línea</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section (solo cuando no hay carpeta seleccionada) */}
          {!selectedFolder && (
            <div className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-100/50 p-8 sm:p-12">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl -z-0"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-200/30 to-pink-200/30 rounded-full blur-3xl -z-0"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm font-medium text-indigo-600">Bienvenido a Cloudvault</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  Tu espacio en la nube,<br />
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    organizado y seguro
                  </span>
                </h2>
                <p className="text-lg text-gray-600 mb-6 max-w-2xl">
                  Almacena, gestiona y comparte tus archivos con la potencia de Cloudinary y la seguridad de autenticación empresarial.
                </p>
                {canCreateFolder && (
                  <button 
                    onClick={() => setIsCreateFolderModalOpen(true)} 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 font-medium"
                  >
                    <FolderPlus className="w-5 h-5" />
                    Crear tu primera carpeta
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200/50">{selectedFolder && (
              <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
                <button onClick={() => setSelectedFolder(null)} className="flex items-center gap-1 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50 font-medium">
                  <ArrowLeft className="w-4 h-4" />
                  Volver a carpetas
                </button>
                <span className="text-gray-400">/</span>
                <span className="font-semibold text-gray-900">{selectedFolder.name}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {selectedFolder ? `Carpeta: ${selectedFolder.name}` : 'Tus Carpetas'}
                </h2>
                <p className="text-gray-600">
                  {selectedFolder ? 'Gestiona los archivos de esta carpeta.' : 'Organiza tu contenido en carpetas personalizadas.'}
                </p>
              </div>

              {selectedFolder && (
                <button 
                  onClick={handleOpenUploadModal} 
                  className="mt-4 sm:mt-0 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 font-medium"
                >
                  <Upload className="w-5 h-5" />
                  Subir Archivos
                </button>
              )}

              {canCreateFolder && !selectedFolder && (
                <button 
                  onClick={() => setIsCreateFolderModalOpen(true)} 
                  className="mt-4 sm:mt-0 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 font-medium"
                >
                  <FolderPlus className="w-5 h-5" />
                  Nueva Carpeta
                </button>
              )}
            </div>

            {selectedFolder ? (
              <FileGallery key={refreshKey} folderName={selectedFolder.name} onRefresh={() => setRefreshKey(prev => prev + 1)} />
            ) : (
              <FolderList onFolderSelect={handleFolderSelect} />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/70 backdrop-blur-sm border-t border-gray-200/50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                <Cloud className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Cloudvault
              </span>
            </div>
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Cloudvault. Gestión inteligente en la nube.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500">Sistema operativo</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedFolder && <UploadModal isOpen={isUploadModalOpen} onClose={handleCloseUploadModal} folderName={selectedFolder.name} />}
      {canCreateFolder && <CreateFolderModal isOpen={isCreateFolderModalOpen} onClose={() => setIsCreateFolderModalOpen(false)} onSuccess={handleCreateFolderSuccess} />}
    </div>
  );
}
