
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const EditorSkeleton = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <div className="flex-1 flex overflow-hidden">
        <div className="flex flex-1 w-full overflow-hidden relative">
          {/* Sidebar Skeleton */}
          <div className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-64">
            <div className="p-3 space-y-2 h-full flex flex-col">
              {/* Logo area */}
              <div className="flex items-center gap-2 pb-3 border-b border-gray-200 dark:border-gray-700 mb-3">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-6 w-24" />
              </div>
              
              {/* Sections */}
              <div className="space-y-4">
                {/* İşlem Geçmişi */}
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <div className="space-y-2 pl-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </div>
                
                {/* Dosyalarım */}
                <div className="space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <div className="space-y-2 pl-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                </div>
                
                {/* İmza İşlemleri */}
                <div className="space-y-2">
                  <Skeleton className="h-5 w-28" />
                  <div className="space-y-2 pl-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
                
                {/* Hesabım */}
                <div className="space-y-2">
                  <Skeleton className="h-5 w-20" />
                  <div className="space-y-2 pl-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Toggle button skeleton */}
          <div className="absolute z-20 left-[236px] top-1">
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          
          {/* Main content area */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Toolbar skeleton */}
            <div className="border-b border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                  <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
                <div className="flex items-center gap-1">
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </div>
            
            {/* Format toolbar skeleton */}
            <div className="border-b border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-900">
              <div className="flex items-center gap-1">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-16" />
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
            
            {/* Ruler skeleton */}
            <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 h-6">
              <div className="flex items-center h-full px-4">
                <Skeleton className="h-2 w-full" />
              </div>
            </div>
            
            {/* Document area skeleton */}
            <div className="flex-1 bg-gray-100 dark:bg-gray-900 p-8 overflow-auto">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 shadow-lg min-h-[842px] p-16 space-y-4">
                  {/* Document content skeleton */}
                  <Skeleton className="h-8 w-3/4 mb-6" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="py-4"></div>
                  <Skeleton className="h-6 w-1/2 mb-4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-full" />
                  <div className="py-4"></div>
                  <Skeleton className="h-6 w-1/3 mb-4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="py-8"></div>
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorSkeleton;
