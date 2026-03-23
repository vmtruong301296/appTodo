import React from 'react';
import { MotiView } from 'moti';

type Props = { children: React.ReactNode; className?: string };

export default function FadeInCard({ children }: Props) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 12 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 300 }}
      style={{ borderRadius: 16, padding: 16, backgroundColor: 'white', margin: 8, elevation: 2 }}
    >
      {children}
    </MotiView>
  );
}
