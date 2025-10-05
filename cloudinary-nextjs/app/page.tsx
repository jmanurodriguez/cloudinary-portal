'use client';

import { useState, useEffect } from 'react';
import { useUser, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs';
import { Cloud, ArrowLeft, Shield, FolderPlus, Upload, Sparkles } from 'lucide-react';
import FolderList from '@/components/FolderList';
import FileGallery from '@/components/FileGallery';
import UploadModal from '@/components/UploadModal';
import CreateFolderModal from '@/components/CreateFolderModal';
import { CloudinaryFolder } from '@/types';

export default function Home() {
  const [selectedFolder, setSelectedFolder] = useState<CloudinaryFolder | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [canCreateFolder, setCanCreateFolder] = useState(false);

  // Usar Clerk
  const { isSignedIn, user, isLoaded } = useUser();

  // Verificar permisos de admin desde el servidor
  useEffect(() => {
    const checkAdmin = async () => {
      if (!isSignedIn) {
        setCanCreateFolder(false);
        return;
      }

      try {
        const response = await fetch('/api/check-admin');
        const data = await response.json();
        setCanCreateFolder(data.isAdmin || false);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setCanCreateFolder(false);
      }
    };

    checkAdmin();
  }, [isSignedIn]);

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
                    Admin
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
          <div className="flex flex-col items-center gap-4">
            {/* Logo Cloudvault */}
            <div className="flex items-center gap-3">
              <img 
                src="https://res.cloudinary.com/dpcpcnqmq/image/upload/v1738867239/android-chrome-512x512_fcpw7k.png" 
                alt="Cloudvault Logo" 
                className="w-8 h-8 rounded-lg shadow-sm"
              />
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Cloudvault
              </span>
            </div>

            {/* Power By */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Powered by</span>
              <a 
                href="https://www.manu-rodriguez.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:text-blue-700 transition-colors hover:underline"
              >
                www.manu-rodriguez.com
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {/* LinkedIn */}
              <a 
                href="https://www.linkedin.com/in/jmanurodriguez-frontend" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-blue-50 transition-all group"
                title="LinkedIn"
              >
                <svg className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>

              {/* GitHub */}
              <a 
                href="https://github.com/jmanurodriguez" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-gray-100 transition-all group"
                title="GitHub"
              >
                <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>

            {/* Copyright */}
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Cloudvault. Gestión inteligente en la nube.
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedFolder && <UploadModal isOpen={isUploadModalOpen} onClose={handleCloseUploadModal} folderName={selectedFolder.name} />}
      {canCreateFolder && <CreateFolderModal isOpen={isCreateFolderModalOpen} onClose={() => setIsCreateFolderModalOpen(false)} onSuccess={handleCreateFolderSuccess} />}
    </div>
  );
}
