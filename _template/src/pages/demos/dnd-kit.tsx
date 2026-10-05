import * as React from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core"
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { IconGripVertical } from "@tabler/icons-react"
import { DemoSection } from "@/components/DemoSection"
import type { DemoEntry } from "./types"

function Row({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={
        "flex items-center gap-inline-xs rounded-lg bg-surface-secondary px-inset-s py-inset-xs text-body inset-ring-1 inset-ring-stroke-faint " +
        (isDragging ? "relative z-10 shadow-lg" : "")
      }
    >
      <button
        type="button"
        aria-label={`Reorder ${id}`}
        className="cursor-grab touch-none text-label-secondary active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <IconGripVertical className="size-4" />
      </button>
      {id}
    </li>
  )
}

function DndKitDemo() {
  const [items, setItems] = React.useState(["Design", "Prototype", "Tune", "Ship"])
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      setItems((list) => arrayMove(list, list.indexOf(String(active.id)), list.indexOf(String(over.id))))
    }
  }

  return (
    <DemoSection title="dnd kit" lib="@dnd-kit/core" docsUrl="https://dndkit.com/">
      <p className="text-body text-label-secondary">
        Headless drag and drop. A sortable list here; the same primitives cover kanban boards and
        free-form droppables. Keyboard works out of the box — focus a handle, press Space, use
        the arrow keys.
      </p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <ul className="flex max-w-xs flex-col gap-stack-2xs">
            {items.map((id) => (
              <Row key={id} id={id} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </DemoSection>
  )
}

const entry: DemoEntry = {
  lib: "dnd kit",
  role: "drag & drop",
  docsUrl: "https://dndkit.com/",
  Component: DndKitDemo,
}
export default entry
