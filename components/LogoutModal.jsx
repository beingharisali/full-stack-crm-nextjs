import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };



  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <Card className="w-full max-w-sm shadow-2xl bg-white/95 backdrop-blur-lg border-0 rounded-xl overflow-hidden">
        <CardHeader className="text-center pb-3 pt-5">
          <CardTitle className="text-xl font-bold text-gray-800">
            Confirm Logout
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center pb-2 pt-0">
          <p className="text-gray-600 text-sm">
            Are you sure you want to logout?
          </p>
        </CardContent>
        
        <CardFooter className="flex justify-center gap-3 pb-5 pt-3">
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
            className="px-4 py-2 text-sm border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant="destructive"
            size="sm"
            className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white"
          >
            Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LogoutModal;