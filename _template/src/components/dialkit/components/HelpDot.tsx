import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * HelpDot — an optional "?" affordance rendered to the right of a control label.
 * Hover or focus it to show explainer text in a tooltip. This is the sanctioned
 * place for help copy so it never gets painted onto the panel/canvas itself. Give
 * a control a `help` string in its config to opt in; renders nothing without one.
 */
export function HelpDot({ text }: { text?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  if (!text) return null;

  const show = () => {
    const r = ref.current?.getBoundingClientRect();
    if (r) setPos({ x: r.left + r.width / 2, y: r.top });
  };
  const hide = () => setPos(null);

  return (
    <>
      <span
        ref={ref}
        tabIndex={0}
        aria-label={`Help: ${text}`}
        onPointerEnter={show}
        onPointerLeave={hide}
        onFocus={show}
        onBlur={hide}
        style={{
          width: 14,
          height: 14,
          borderRadius: '50%',
          flexShrink: 0,
          display: 'inline-grid',
          placeItems: 'center',
          fontSize: 10,
          fontWeight: 700,
          lineHeight: 1,
          color: 'var(--dial-text-label)',
          background: 'var(--dial-surface-active)',
          border: 'none',
          cursor: 'help',
          userSelect: 'none',
        }}
      >
        ?
      </span>
      {pos &&
        createPortal(
          <div
            role="tooltip"
            style={{
              position: 'fixed',
              left: pos.x,
              top: pos.y - 8,
              transform: 'translate(-50%, -100%)',
              maxWidth: 220,
              padding: '6px 9px',
              borderRadius: 6,
              background: '#1a1a1a',
              color: '#fff',
              fontSize: 11,
              lineHeight: 1.4,
              fontFamily: 'inherit',
              boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
              zIndex: 2147483640,
              pointerEvents: 'none',
            }}
          >
            {text}
          </div>,
          document.body,
        )}
    </>
  );
}
