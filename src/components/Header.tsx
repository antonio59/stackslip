import React from 'react';

export function Header() {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold mb-4">StackOverflow Receipt</h1>
      <p className="text-xl text-gray-600 mb-4">Generate a receipt-style summary of your StackOverflow profile</p>
      <div className="text-gray-500">
        made by Antonio | <a href="https://ko-fi.com/O4O416CKYY" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">buy Antonio a coffee</a>
      </div>
    </div>
  );
}