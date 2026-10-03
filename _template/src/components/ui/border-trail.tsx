import { cn } from '@/lib/utils';
import {
  motion,
  type Transition,
  useReducedMotion,
} from 'motion/react';
import { EASE } from '@/lib/motion';

export type BorderTrailProps = {
  className?: string;
  size?: number;
  transition?: Transition;
  onAnimationComplete?: () => void;
  style?: React.CSSProperties;
};

export function BorderTrail({
  className,
  size = 60,
  transition,
  onAnimationComplete,
  style,
}: BorderTrailProps) {
  // offsetDistance isn't a transform, so the root <MotionConfig reducedMotion> leaves
  // it looping. The trail is decoration only, so under reduced motion it isn't drawn.
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  const defaultTransition: Transition = {
    repeat: Infinity,
    duration: 5,
    ease: EASE.linear,
  };

  return (
    <div className='pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]'>
      <motion.div
        className={cn('absolute aspect-square bg-neutral-500', className)}
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          ...style,
        }}
        animate={{
          offsetDistance: ['0%', '100%'],
        }}
        transition={transition || defaultTransition}
        onAnimationComplete={onAnimationComplete}
      />
    </div>
  );
}
