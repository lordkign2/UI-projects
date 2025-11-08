import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const CollaborativeCursors = ({ canvasRef }) => {
  const [cursors, setCursors] = useState([]);
  const [userCursor, setUserCursor] = useState({ x: 0, y: 0 });

  // Mock collaborative cursors data
  const mockCollaborators = [
    {
      id: 'user-1',
      name: 'Sarah Chen',
      color: '#059669',
      avatar: 'SC',
      tool: 'color-picker',
      isActive: true
    },
    {
      id: 'user-2',
      name: 'Mike Rodriguez',
      color: '#2563EB',
      avatar: 'MR',
      tool: 'accessibility-check',
      isActive: true
    },
    {
      id: 'user-3',
      name: 'Emma Thompson',
      color: '#D97706',
      avatar: 'ET',
      tool: null,
      isActive: false
    }
  ];

  useEffect(() => {
    // Simulate real-time cursor movements
    const interval = setInterval(() => {
      const activeCursors = mockCollaborators?.filter(user => user?.isActive)?.map(user => ({
          ...user,
          x: Math.random() * (canvasRef?.current?.offsetWidth || 800),
          y: Math.random() * (canvasRef?.current?.offsetHeight || 600),
          timestamp: Date.now()
        }));
      
      setCursors(activeCursors);
    }, 2000);

    return () => clearInterval(interval);
  }, [canvasRef]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (canvasRef?.current) {
        const rect = canvasRef?.current?.getBoundingClientRect();
        setUserCursor({
          x: e?.clientX - rect?.left,
          y: e?.clientY - rect?.top
        });
      }
    };

    const canvas = canvasRef?.current;
    if (canvas) {
      canvas?.addEventListener('mousemove', handleMouseMove);
      return () => canvas?.removeEventListener('mousemove', handleMouseMove);
    }
  }, [canvasRef]);

  const getToolIcon = (tool) => {
    switch (tool) {
      case 'color-picker': return 'Pipette';
      case 'accessibility-check': return 'Shield';
      case 'export-preview': return 'Eye';
      default: return 'MousePointer';
    }
  };

  const getToolLabel = (tool) => {
    switch (tool) {
      case 'color-picker': return 'Picking colors';
      case 'accessibility-check': return 'Checking accessibility';
      case 'export-preview': return 'Previewing export';
      default: return 'Browsing';
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <AnimatePresence>
        {cursors?.map((cursor) => (
          <motion.div
            key={cursor?.id}
            className="absolute pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: cursor?.x,
              y: cursor?.y
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ 
              type: "spring", 
              stiffness: 500, 
              damping: 30,
              opacity: { duration: 0.2 }
            }}
          >
            {/* Cursor Pointer */}
            <div className="relative">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="drop-shadow-lg"
              >
                <path
                  d="M3 3L10.5 21L13.5 13.5L21 10.5L3 3Z"
                  fill={cursor?.color}
                  stroke="white"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>

              {/* User Info Tooltip */}
              <motion.div
                className="absolute top-6 left-6 flex items-center space-x-2 px-3 py-2 rounded-lg shadow-soft-lg pointer-events-auto"
                style={{ backgroundColor: cursor?.color }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {/* Avatar */}
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {cursor?.avatar}
                </div>

                {/* Name and Tool */}
                <div className="text-white">
                  <div className="text-sm font-medium">{cursor?.name}</div>
                  {cursor?.tool && (
                    <div className="text-xs opacity-90 flex items-center space-x-1">
                      <Icon name={getToolIcon(cursor?.tool)} size={10} />
                      <span>{getToolLabel(cursor?.tool)}</span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Activity Indicator */}
              {cursor?.tool && (
                <motion.div
                  className="absolute -top-2 -right-2 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: cursor?.color }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Icon name={getToolIcon(cursor?.tool)} size={8} color="white" />
                </motion.div>
              )}

              {/* Ripple Effect for Active Actions */}
              <motion.div
                className="absolute -inset-2 rounded-full border-2 opacity-30"
                style={{ borderColor: cursor?.color }}
                animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {/* User's Own Cursor Trail Effect */}
      <motion.div
        className="absolute w-2 h-2 rounded-full bg-primary/30 pointer-events-none"
        animate={{
          x: userCursor?.x - 4,
          y: userCursor?.y - 4
        }}
        transition={{ type: "spring", stiffness: 1000, damping: 50 }}
      />
    </div>
  );
};

export default CollaborativeCursors;