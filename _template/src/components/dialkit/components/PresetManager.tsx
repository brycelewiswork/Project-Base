import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { DialStore, type Preset } from '../store/DialStore';
import { ICON_CHEVRON, ICON_TRASH } from '../icons';

interface PresetManagerProps {
  panelId: string;
  presets: Preset[];
  activePresetId: string | null;
  onAdd: () => void;
}

export function PresetManager({ panelId, presets, activePresetId }: PresetManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  // Deleting a preset throws away tuned values, so it takes two presses: the first
  // arms the button (it turns into a red "Delete?"), the second deletes.
  const [armedId, setArmedId] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  const hasPresets = presets.length > 0;
  const activePreset = presets.find((p) => p.id === activePresetId);

  const open = useCallback(() => {
    if (!hasPresets) return;
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
    setIsOpen(true);
  }, [hasPresets]);

  const close = useCallback(() => setIsOpen(false), []);

  const toggle = useCallback(() => {
    if (isOpen) close();
    else open();
  }, [isOpen, open, close]);

  // Close on any mousedown outside trigger + dropdown
  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) return;
      close();
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, close]);

  const handleSelect = (presetId: string | null) => {
    if (presetId) {
      DialStore.loadPreset(panelId, presetId);
    } else {
      DialStore.clearActivePreset(panelId);
    }
    close();
  };

  const handleDelete = (e: React.MouseEvent, presetId: string) => {
    e.stopPropagation();
    if (armedId !== presetId) {
      setArmedId(presetId);
      return;
    }
    setArmedId(null);
    DialStore.deletePreset(panelId, presetId);
  };

  return (
    <div className="dialkit-preset-manager">
      <button
        ref={triggerRef}
        className="dialkit-preset-trigger"
        onClick={toggle}
        data-open={String(isOpen)}
        data-has-preset={String(!!activePreset)}
        data-disabled={String(!hasPresets)}
      >
        <span className="dialkit-preset-label">
          {activePreset ? activePreset.name : 'Version 1'}
        </span>
        <motion.svg
          className="dialkit-select-chevron"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ rotate: isOpen ? 180 : 0, opacity: hasPresets ? 0.6 : 0.25 }}
          transition={{ type: 'spring', visualDuration: 0.2, bounce: 0.15 }}
        >
          <path d={ICON_CHEVRON} />
        </motion.svg>
      </button>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={dropdownRef}
              className="dialkit-root dialkit-preset-dropdown"
              style={{ position: 'fixed', top: pos.top, left: pos.left, minWidth: pos.width }}
              initial={{ opacity: 0, y: 4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.97, pointerEvents: 'none' as any }}
              transition={{ type: 'spring', visualDuration: 0.15, bounce: 0 }}
            >
              {/* Rows keep their whole-row click; the name is a <button> with no handler
                  of its own, so Enter/Space bubble a click to the row and select it. */}
              <div
                className="dialkit-preset-item"
                data-active={String(!activePresetId)}
                onClick={() => handleSelect(null)}
              >
                <button
                  type="button"
                  className="dialkit-unstyled-btn dialkit-preset-name"
                  aria-current={!activePresetId ? 'true' : undefined}
                >
                  Version 1
                </button>
              </div>

              {presets.map((preset) => (
                <div
                  key={preset.id}
                  className="dialkit-preset-item"
                  data-active={String(preset.id === activePresetId)}
                  onClick={() => handleSelect(preset.id)}
                >
                  <button
                    type="button"
                    className="dialkit-unstyled-btn dialkit-preset-name"
                    aria-current={preset.id === activePresetId ? 'true' : undefined}
                  >
                    {preset.name}
                  </button>
                  <button
                    type="button"
                    className="dialkit-preset-delete"
                    data-armed={String(armedId === preset.id)}
                    onClick={(e) => handleDelete(e, preset.id)}
                    onBlur={() => setArmedId((id) => (id === preset.id ? null : id))}
                    aria-label={armedId === preset.id ? `Confirm delete ${preset.name}` : `Delete ${preset.name}`}
                  >
                    {armedId === preset.id ? (
                      'Delete?'
                    ) : (
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {ICON_TRASH.map((d, i) => (
                          <path key={i} d={d} />
                        ))}
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
