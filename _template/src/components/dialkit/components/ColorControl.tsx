import { useState, useEffect } from 'react';
import { ColorField } from './ColorField';
import { selectOnFocus } from './controlStyles';
import { HelpDot } from './HelpDot';

interface ColorControlProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  help?: string;
}

const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;

/**
 * Stock dialkit color row — hex text + a swatch. The swatch opens the shared
 * ColorField / ColorPicker (not the browser-native input), so *all* color editing
 * across the panel uses one picker.
 */
export function ColorControl({ label, value, onChange, help }: ColorControlProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  useEffect(() => {
    if (!isEditing) setEditValue(value);
  }, [value, isEditing]);

  function handleTextSubmit() {
    setIsEditing(false);
    if (HEX_COLOR_REGEX.test(editValue)) {
      onChange(editValue);
    } else {
      setEditValue(value);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleTextSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(value);
    }
  }

  return (
    <div className="dialkit-color-control">
      <span className="dialkit-color-label" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>{label}<HelpDot text={help} /></span>
      <div className="dialkit-color-inputs">
        {isEditing ? (
          <input
            type="text"
            className="dialkit-color-hex-input"
            value={editValue.replace(/^#/, '')}
            onChange={(e) => setEditValue('#' + e.target.value.replace(/#/g, ''))}
            onBlur={handleTextSubmit}
            onKeyDown={handleKeyDown}
            onFocus={selectOnFocus}
            autoFocus
          />
        ) : (
          <span className="dialkit-color-hex" onClick={() => setIsEditing(true)}>
            {(value ?? '').replace(/^#/, '').toUpperCase()}
          </span>
        )}
        <ColorField value={value} onChange={onChange} size={20} />
      </div>
    </div>
  );
}
