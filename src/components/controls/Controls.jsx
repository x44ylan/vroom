import React, { useLayoutEffect, useRef, useState } from 'react';

// Small native-feeling controls: a segmented picker and a switch.

// Segmented control. The thumb slides between options; that motion explains which option took over.
export function Segmented({ options, value, onChange, label, className = '', size = 'md' }) {
  const wrap = useRef(null);
  const [thumb, setThumb] = useState(null);
  const index = options.findIndex(o => o.value === value);

  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const place = () => {
      const btn = el.querySelectorAll('[data-seg]')[index];
      if (!btn) return setThumb(null);
      setThumb({ x: btn.offsetLeft, y: btn.offsetTop, w: btn.offsetWidth, h: btn.offsetHeight });
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(el);
    return () => ro.disconnect();
  }, [index, options.length]);

  const onKey = e => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const n = options.length;
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : (Math.max(0, index) + (e.key === 'ArrowRight' ? 1 : -1) + n) % n;
    onChange(options[next].value);
    wrap.current.querySelectorAll('[data-seg]')[next]?.focus();
  };

  return (
    <div ref={wrap} className={`segmented segmented-${size} ${className}`} role="group" aria-label={label} onKeyDown={onKey}>
      {thumb && <span className="segmented-thumb" aria-hidden="true" style={{ transform: `translate(${thumb.x}px, ${thumb.y}px)`, width: thumb.w, height: thumb.h }} />}
      {options.map(o => (
        <button key={o.value} type="button" data-seg aria-pressed={o.value === value} tabIndex={o.value === value || (index < 0 && o === options[0]) ? 0 : -1}
          onClick={() => onChange(o.value)}>
          {o.icon}{o.label}
        </button>
      ))}
    </div>
  );
}

// iOS-style switch. Rendered as a real <button role="switch"> with a visible label.
export function Switch({ checked, onChange, label, disabled }) {
  return (
    <button type="button" role="switch" aria-checked={checked} disabled={disabled} className="switch" onClick={() => onChange(!checked)}>
      <span className="switch-label">{label}</span>
      <span className="switch-track" aria-hidden="true"><span className="switch-knob" /></span>
    </button>
  );
}
