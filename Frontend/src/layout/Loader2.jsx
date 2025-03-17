// Spinner.js
import React from 'react';
import { ClipLoader } from 'react-spinners';

const Loader2 = ({ color = '#72A10F', size = 50 }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <ClipLoader color={color} size={size} />
    </div>
  );
};

export default Loader2;
