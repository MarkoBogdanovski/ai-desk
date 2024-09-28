import React from 'react';

export default function IconCircle({ icon: Icon, className = '' }: { icon: React.ElementType; className?: string }) {
  return (
    <div className={`bg-gray-200 rounded-full p-4 inline-block ${className}`}>
      <Icon className="w-9 h-9 text-zinc-800" />
    </div>
  )
}
