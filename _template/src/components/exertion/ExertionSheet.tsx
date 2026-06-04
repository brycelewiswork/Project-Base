import { useCallback, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { IconX, IconInfoCircleFilled, IconChevronRight, IconCheck } from "@tabler/icons-react"
import { SPRING } from "@/lib/motion"
import { useLiquidGlassMode, withAlpha } from "@/components/ui/liquid-glass"
import { ExertionSlider, type ExertionState } from "./ExertionSlider"
import { sampleColor, MAX_VALUE } from "./scale"

const INITIAL_VALUE = 5

function initialState(): ExertionState {
  const pos = INITIAL_VALUE / MAX_VALUE
  return {
    level: INITIAL_VALUE,
    color: sampleColor(pos),
    aboveRange: false,
    belowRange: false,
  }
}

// Save label always uses the dark-mode primary label color (`--label` in .dark),
// regardless of the fill, so it stays consistent with the rest of the sheet.
const LABEL_PRIMARY_DARK = "oklch(1 0 0 / 90%)"

export function ExertionSheet() {
  const [state, setState] = useState<ExertionState>(initialState)
  const [resetKey, setResetKey] = useState(0)
  const [saved, setSaved] = useState(false)

  const handleChange = useCallback((s: ExertionState) => {
    setState(s)
    setSaved(false)
  }, [])

  const clearEntry = useCallback(() => {
    setSaved(false)
    setState(initialState())
    setResetKey((k) => k + 1)
  }, [])

  const save = useCallback(() => setSaved(true), [])

  const rangeNote = state.aboveRange
    ? "Effort Above Your Usual Range"
    : state.belowRange
      ? "Effort Below Your Usual Range"
      : null


  // Glass surfaces use the baked modes (glass-modes.ts), not raw params.
  const saveTint = withAlpha(state.color, 0.8)

  // Sheet: medium · dark, full 60% squircle (the mode default). It's a uniform
  // squircle, but the sheet sits flush at the phone frame's bottom, whose larger
  // 56px corners clip the sheet's rounded bottom out of view — so only the top
  // corners read.
  const sheetGlass = useLiquidGlassMode("medium", { tone: "dark", radius: 44 })
  // Save: small · dark, tinted with the live exertion color.
  const saveGlass = useLiquidGlassMode("small", { tone: "dark", radius: 28, accent: state.color })
  // Close: small · dark.
  const closeGlass = useLiquidGlassMode("small", { tone: "dark", radius: 20 })

  return (
    <div className="relative flex h-full min-h-0 flex-col justify-end overflow-hidden bg-neutral-950">
      <WorkoutBackdrop />

      {/* Dimming scrim over the workout, behind the sheet. */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" />

      <motion.div
        ref={sheetGlass.ref}
        initial={{ y: 48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={SPRING.smooth}
        className="relative z-10 mx-auto w-full max-w-md border-t border-white/10 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
        style={{
          ...sheetGlass.style,
          borderTopLeftRadius: 44,
          borderTopRightRadius: 44,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        {sheetGlass.svg}
        {/* Grabber */}
        <div className="mx-auto mt-2.5 h-1.5 w-9 rounded-full bg-white/20" />

        {/* Title row */}
        <div className="grid grid-cols-[2.5rem_1fr_2.5rem] items-center px-4 pt-1">
          <button
            type="button"
            aria-label="About perceived exertion"
            className="flex size-9 items-center justify-center rounded-full text-white/45 transition-colors hover:text-white/80"
          >
            <IconInfoCircleFilled size={22} />
          </button>
          <div className="text-center text-[17px] font-semibold text-white">Perceived Exertion</div>
          <button
            ref={closeGlass.ref}
            type="button"
            aria-label="Dismiss"
            className="relative flex size-10 items-center justify-center justify-self-end overflow-hidden text-white/70 transition-colors hover:text-white"
            style={closeGlass.style}
          >
            {closeGlass.svg}
            <IconX size={22} stroke={2.5} />
          </button>
        </div>
        <p className="mt-0.5 text-center text-sm text-white/45">How did it feel?</p>

        {/* Number + label + description + wedge slider */}
        <div className="px-5 pt-4">
          <ExertionSlider key={resetKey} initialValue={INITIAL_VALUE} onChange={handleChange} />
        </div>

        {/* Actions */}
        <div className="mt-9 flex flex-col items-center gap-4 px-5">
          <div className="flex h-4 items-center">
            <AnimatePresence mode="wait">
              {rangeNote && (
                <motion.span
                  key={rangeNote}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={SPRING.snappy}
                  className="text-xs font-medium tracking-wide"
                  style={{ color: state.color }}
                >
                  {rangeNote}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            ref={saveGlass.ref}
            type="button"
            onClick={save}
            whileTap={{ scale: 0.97 }}
            className="relative flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-full text-[17px] font-semibold"
            style={{ ...saveGlass.style, color: LABEL_PRIMARY_DARK }}
            animate={{ backgroundColor: saveTint }}
            transition={SPRING.smooth}
          >
            {saveGlass.svg}
            <AnimatePresence mode="wait" initial={false}>
              {saved ? (
                <motion.span
                  key="saved"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={SPRING.snappy}
                  className="flex items-center gap-1.5"
                >
                  <IconCheck size={20} stroke={3} /> Saved
                </motion.span>
              ) : (
                <motion.span
                  key="save"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={SPRING.snappy}
                >
                  Save
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <div className="flex w-full items-center justify-between">
            <button
              type="button"
              onClick={clearEntry}
              className="rounded-full px-2 py-1 text-sm font-medium text-white/55 transition-colors hover:text-white/85"
            >
              Clear Entry
            </button>
            <button
              type="button"
              className="flex items-center gap-0.5 rounded-full px-2 py-1 text-sm font-medium text-white/55 transition-colors hover:text-white/85"
            >
              How to Self-Assess
              <IconChevronRight size={15} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/** A faint, faux "Strength Training" workout sitting behind the dimmed sheet. */
function WorkoutBackdrop() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-b from-orange-500/15 via-neutral-950 to-neutral-950" />
      <div className="flex flex-col items-center gap-3 px-6 pt-24 text-center">
        <span className="text-sm font-medium tracking-widest text-orange-300/70 uppercase">
          Strength Training
        </span>
        <span className="text-[64px] leading-none font-semibold text-white/85 tabular-nums">
          24:13
        </span>
        <div className="mt-2 flex gap-8 text-center">
          <Stat label="Active Cal" value="312" />
          <Stat label="Avg HR" value="148" />
          <Stat label="Total Cal" value="389" />
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-2xl font-semibold text-white/75 tabular-nums">{value}</span>
      <span className="text-[11px] tracking-wide text-white/40 uppercase">{label}</span>
    </div>
  )
}
