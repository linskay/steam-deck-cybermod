import React from 'react';

interface ExtensionHostProps {
  frontendUrl: string;
}

const BACKEND_BASE = 'http://localhost:7070';

export const ExtensionHost: React.FC<ExtensionHostProps> = ({ frontendUrl }) => {
  const fullUrl = frontendUrl.startsWith('http') ? frontendUrl : `${BACKEND_BASE}${frontendUrl}`;

  return (
    <div className="w-full h-full bg-black/20 backdrop-blur-sm border border-white/5 relative overflow-hidden">
        {/* We use a slight delay or loading state if needed, but for now simple iframe */}
        <iframe
            src={fullUrl}
            className="w-full h-full border-0"
            title="Extension"
            allow="fullscreen"
        />

        {/* Subtle scanline overlay for the iframe to match the theme */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden opacity-10">
            <div className="w-full h-px bg-white absolute animate-scanline" />
        </div>
    </div>
  );
};
