"use client"

import * as React from "react"
import { cn } from "cn"
import {
  Brush,
  Camera,
  Clapperboard,
  CloudUpload,
  Film,
  Frame,
  Guitar,
  House,
  Image as ImageIcon,
  LayoutGrid,
  Lightbulb,
  MapPin,
  Mic,
  Music,
  Palette,
  Pencil,
  Send,
  SlidersHorizontal,
  Tag,
  Users,
  Video,
  Volume2,
  X,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label as BaseLabel } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { toast, Toaster } from "@/components/ui/toast"
import { HowItWorks } from "@/components/how-it-works"

type ExtraField = {
  key: string
  label: string
  icon: LucideIcon
  placeholder: string
}

type Category = {
  label: string
  icon: LucideIcon
  extras: ExtraField[]
}

const categories: Category[] = [
  {
    label: "Photography Studios",
    icon: Camera,
    extras: [
      {
        key: "backdrop",
        label: "Backdrop Type",
        icon: ImageIcon,
        placeholder: "e.g. White, Black, Green Screen",
      },
      {
        key: "lighting",
        label: "Lighting Equipment",
        icon: Lightbulb,
        placeholder: "e.g. Softbox, Ring Light",
      },
    ],
  },
  {
    label: "Film & Cinema Studios",
    icon: Film,
    extras: [
      {
        key: "camera",
        label: "Camera Equipment",
        icon: Video,
        placeholder: "e.g. RED Komodo, Sony FX6",
      },
      {
        key: "greenscreen",
        label: "Green Screen",
        icon: Clapperboard,
        placeholder: "e.g. 3m x 5m, Chroma Key",
      },
    ],
  },
  {
    label: "Podcast Rooms",
    icon: Mic,
    extras: [
      {
        key: "microphones",
        label: "Microphone Setup",
        icon: Mic,
        placeholder: "e.g. Shure SM7B, Up to 4 Mics",
      },
      {
        key: "acoustics",
        label: "Acoustic Treatment",
        icon: Volume2,
        placeholder: "e.g. Wall Panels, Bass Traps",
      },
    ],
  },
  {
    label: "Music Studios",
    icon: Music,
    extras: [
      {
        key: "instruments",
        label: "Instruments",
        icon: Guitar,
        placeholder: "e.g. Grand Piano, Drum Kit",
      },
      {
        key: "mixing",
        label: "Mixing Console",
        icon: SlidersHorizontal,
        placeholder: "e.g. SSL AWS, Yamaha TF5",
      },
    ],
  },
  {
    label: "Art Workshops",
    icon: Palette,
    extras: [
      {
        key: "medium",
        label: "Art Medium",
        icon: Brush,
        placeholder: "e.g. Acrylic, Watercolor, Clay",
      },
      {
        key: "display",
        label: "Display Space",
        icon: Frame,
        placeholder: "e.g. Wall Panels, Easels",
      },
    ],
  },
]

type FormState = {
  name: string
  category: string
  description: string
  location: string
  price: string
  capacity: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

type StudioImage = {
  id: string
  src: string
  name: string
  revoke: boolean
  file?: File
}

const initialForm: FormState = {
  name: "",
  category: "",
  description: "",
  location: "",
  price: "",
  capacity: "",
}

function createImageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/** Longest edge (px) an uploaded image is downscaled to. */
const MAX_IMAGE_DIMENSION = 1280
/** Quality used when re-encoding an upload to JPEG. */
const JPEG_QUALITY = 0.8
/** Small files that already fit within MAX_IMAGE_DIMENSION are left alone. */
const SKIP_COMPRESS_BELOW_BYTES = 150 * 1024

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Could not decode image"))
    }
    img.src = url
  })
}

/**
 * Downscale + re-encode to JPEG so the base64 data URL sent to the backend
 * stays small (a phone photo can otherwise balloon into megabytes of JSON).
 * Animated GIFs and SVGs pass through untouched, and if the result would not
 * be smaller than the original, the original file is kept.
 */
async function compressImage(file: File): Promise<File> {
  if (
    !file.type.startsWith("image/") ||
    file.type === "image/gif" ||
    file.type === "image/svg+xml"
  ) {
    return file
  }

  try {
    const img = await loadImageElement(file)
    const scale = Math.min(
      1,
      MAX_IMAGE_DIMENSION / Math.max(img.naturalWidth, img.naturalHeight)
    )

    if (scale === 1 && file.size <= SKIP_COMPRESS_BELOW_BYTES) {
      return file
    }

    const width = Math.max(1, Math.round(img.naturalWidth * scale))
    const height = Math.max(1, Math.round(img.naturalHeight * scale))
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext("2d")
    if (!context) {
      return file
    }

    // Flatten transparency onto white so PNGs don't encode as black.
    context.fillStyle = "#ffffff"
    context.fillRect(0, 0, width, height)
    context.drawImage(img, 0, 0, width, height)

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY)
    )
    if (!blob || blob.size >= file.size) {
      return file
    }

    return new File([blob], file.name, {
      type: "image/jpeg",
      lastModified: Date.now(),
    })
  } catch {
    return file
  }
}

/** Turns a pasted `data:image/...;base64,...` string into a File so it can
 * go through the same compression path as uploaded files. */
function dataUrlToFile(dataUrl: string): File | null {
  const match = /^data:(image\/[\w.+-]+);base64,([\s\S]+)$/.exec(dataUrl)
  if (!match) {
    return null
  }
  const [, mime, base64] = match

  try {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    const extension = mime.split("/")[1]?.replace("jpeg", "jpg") ?? "png"
    return new File([bytes], `pasted-image.${extension}`, { type: mime })
  } catch {
    return null
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * blob: URLs are session-only and useless outside this browser tab, so dropped
 * files are converted to base64 data URLs before being sent. Pasted http(s)
 * URLs are already usable and pass through as-is.
 */
function toPayloadImage(image: StudioImage): Promise<string> {
  const file = image.file
  if (!file) {
    return Promise.resolve(image.src)
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () =>
      reject(reader.error ?? new Error("Could not read image file"))
    reader.readAsDataURL(file)
  })
}

function SectionHeading({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h2
      className={cn(
        "flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900",
        className
      )}
    >
      <span
        aria-hidden
        className="h-6 w-1.5 rounded-full bg-gradient-to-b from-violet-500 to-purple-600"
      />
      {children}
    </h2>
  )
}

function Label({
  htmlFor,
  required,
  children,
  className,
}: {
  htmlFor: string
  required?: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <BaseLabel
      htmlFor={htmlFor}
      className={cn(
        "mb-1.5 block gap-0.5 font-semibold leading-snug text-slate-800",
        className
      )}
    >
      {children}
      {required && (
        <span aria-hidden className="text-destructive">
          *
        </span>
      )}
    </BaseLabel>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null
  }

  return (
    <p role="alert" className="mt-1.5 text-xs font-medium text-destructive">
      {message}
    </p>
  )
}

export default function CreateStudio() {
  const [form, setForm] = React.useState<FormState>(initialForm)
  const [errors, setErrors] = React.useState<FormErrors>({})
  const [extras, setExtras] = React.useState<Record<string, string>>({})
  const [images, setImages] = React.useState<StudioImage[]>([])
  const [dragging, setDragging] = React.useState(false)
  const [optimizing, setOptimizing] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const activeCategory =
    categories.find((category) => category.label === form.category) ??
    categories[0]

  function setField<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      if (!prev[key]) {
        return prev
      }
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  function validate(): FormErrors {
    const next: FormErrors = {}

    if (!form.name.trim()) {
      next.name = "Studio name is required"
    }
    if (!form.category) {
      next.category = "Please select a category"
    }
    if (!form.description.trim()) {
      next.description = "Please describe your studio"
    }
    if (!form.location.trim()) {
      next.location = "Location is required"
    }

    const price = Number(form.price)
    if (!form.price.trim()) {
      next.price = "Price per hour is required"
    } else if (!Number.isFinite(price) || price <= 0) {
      next.price = "Enter a valid price"
    }

    const capacity = Number(form.capacity)
    if (!form.capacity.trim()) {
      next.capacity = "Maximum capacity is required"
    } else if (!Number.isInteger(capacity) || capacity <= 0) {
      next.capacity = "Enter a valid capacity"
    }

    return next
  }

  async function addFiles(files: File[]) {
    if (files.length === 0) {
      return
    }

    setOptimizing(true)
    try {
      const originalBytes = files.reduce((sum, file) => sum + file.size, 0)
      const optimized = await Promise.all(files.map(compressImage))
      const optimizedBytes = optimized.reduce((sum, file) => sum + file.size, 0)

      setImages((prev) => [
        ...prev,
        ...optimized.map((file) => ({
          id: createImageId(),
          src: URL.createObjectURL(file),
          name: file.name,
          revoke: true,
          file,
        })),
      ])

      if (optimizedBytes < originalBytes * 0.9) {
        toast.add({
          type: "info",
          title: "Images optimized",
          description: `${formatBytes(originalBytes)} → ${formatBytes(
            optimizedBytes
          )} — resized to ${MAX_IMAGE_DIMENSION}px before upload.`,
        })
      }
    } finally {
      setOptimizing(false)
    }
  }

  function addImageUrl(url: string) {
    setImages((prev) => [
      ...prev,
      { id: createImageId(), src: url, name: url, revoke: false },
    ])
  }

  function removeImage(id: string) {
    setImages((prev) => {
      const target = prev.find((image) => image.id === id)
      if (target?.revoke) {
        URL.revokeObjectURL(target.src)
      }
      return prev.filter((image) => image.id !== id)
    })
  }

  async function handleFileInput(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).filter((file) =>
      file.type.startsWith("image/")
    )
    // Reset synchronously so the same file can be re-picked after compression.
    event.target.value = ""
    if (files.length > 0) {
      await addFiles(files)
    }
  }

  async function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragging(false)

    const files = Array.from(event.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    )
    if (files.length === 0) {
      toast.add({
        type: "warning",
        title: "No images found",
        description: "Drop image files to add them to your studio.",
      })
      return
    }
    await addFiles(files)
  }

  async function handlePaste(event: React.ClipboardEvent<HTMLFormElement>) {
    const target = event.target as HTMLElement
    if (target.closest("input, textarea")) {
      return
    }

    const files = Array.from(event.clipboardData.files).filter((file) =>
      file.type.startsWith("image/")
    )
    if (files.length > 0) {
      event.preventDefault()
      await addFiles(files)
      return
    }

    const text = event.clipboardData.getData("text").trim()
    if (/^https?:\/\/\S+$/i.test(text)) {
      event.preventDefault()
      addImageUrl(text)
      return
    }

    // Giant base64 data URLs (e.g. copied out of the API) get re-compressed.
    if (/^data:image\//i.test(text)) {
      const file = dataUrlToFile(text)
      if (file) {
        event.preventDefault()
        await addFiles([file])
      }
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      toast.add({
        type: "error",
        title: "Missing required fields",
        description: "Please fill in the highlighted fields before submitting.",
      })
      return
    }

    setSubmitting(true)

    try {
      const imageUrls = await Promise.all(images.map(toPayloadImage))

      const res = await fetch("http://localhost:8000/create-studio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...form, images: imageUrls }),
      })

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`)
      }

      let data: unknown = null
      try {
        data = await res.json()
      } catch {
        // Backend may return an empty body — nothing to parse.
      }
      console.log(data)

      toast.add({
        type: "success",
        title: "Studio created!",
        description: `${form.name.trim()} is now listed and ready for bookings.`,
      })

      images.forEach((image) => {
        if (image.revoke) {
          URL.revokeObjectURL(image.src)
        }
      })
      setForm(initialForm)
      setErrors({})
      setExtras({})
      setImages([])
    } catch (error) {
      console.error(error)
      toast.add({
        type: "error",
        title: "Could not create studio",
        description:
          "Check that the backend is running on localhost:8000 and try again.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <main className="relative overflow-hidden bg-white">
        {/* Soft lavender decorations behind the form card */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute top-[42%] -right-28 size-[26rem] rounded-full bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100 opacity-80 blur-2xl" />
          <div className="absolute top-[70%] -left-36 size-[22rem] rounded-full bg-gradient-to-tr from-purple-100 via-violet-50 to-white opacity-80 blur-2xl" />
        </div>

        {/* Dark hero band with a neon-lit studio backdrop */}
        <section className="relative overflow-hidden bg-[#0a0a12]">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_78%_45%,rgba(168,85,247,0.45),transparent_70%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(35%_55%_at_96%_78%,rgba(236,72,153,0.30),transparent_70%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(45%_60%_at_12%_10%,rgba(124,58,237,0.25),transparent_70%)]" />

            {/* Neon tube lights */}
            <div className="absolute top-[18%] bottom-[18%] left-[74%] w-0.5 rounded-full bg-gradient-to-b from-violet-200 via-fuchsia-400 to-violet-600 shadow-[0_0_16px_rgba(217,70,239,0.9)]" />
            <div className="absolute top-[8%] bottom-[40%] left-[85%] w-0.5 rounded-full bg-gradient-to-b from-fuchsia-200 via-fuchsia-400 to-violet-500 shadow-[0_0_16px_rgba(232,121,249,0.9)]" />
            <div className="absolute top-[28%] bottom-[10%] left-[94%] w-0.5 rounded-full bg-gradient-to-b from-violet-300 to-purple-600 shadow-[0_0_14px_rgba(192,132,252,0.85)]" />

            {/* Keep the text side dark and readable */}
            <div className="absolute inset-y-0 left-0 w-3/5 bg-gradient-to-r from-[#0a0a12] via-[#0a0a12]/85 to-transparent" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-28 sm:px-6 lg:pt-16">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              List Your{" "}
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                Creative
              </span>{" "}
              Space
            </h1>
            <p className="mt-3 max-w-xl text-base text-slate-300">
              Share your studio with creators and start earning.
            </p>
          </div>
        </section>

        {/* Form card overlapping the hero */}
        <div className="relative z-10 mx-auto -mt-20 mb-16 w-full max-w-5xl px-4 sm:px-6">
          <form
            noValidate
            aria-busy={submitting}
            onSubmit={handleSubmit}
            onPaste={handlePaste}
            className="flex flex-col gap-8 rounded-3xl bg-white px-5 py-7 shadow-[0_24px_60px_-24px_rgba(24,16,56,0.35)] sm:px-8 sm:py-9 lg:px-10"
          >
            {/* Basic Information */}
            <section className="flex flex-col gap-4">
              <SectionHeading>Basic Information</SectionHeading>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="studio-name" required>
                    Studio Name
                  </Label>
                  <div className="relative">
                    <House
                      aria-hidden
                      className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
                    />
                    <Input
                      id="studio-name"
                      value={form.name}
                      onChange={(event) => setField("name", event.target.value)}
                      placeholder="Enter studio name"
                      aria-invalid={Boolean(errors.name)}
                      className={cn(
                        "h-11 pl-9",
                        errors.name && "border-destructive"
                      )}
                    />
                  </div>
                  <FieldError message={errors.name} />
                </div>

                <div>
                  <Label htmlFor="studio-category" required>
                    Studio Category
                  </Label>
                  <Select
                    value={form.category}
                    onValueChange={(value) =>
                      setField("category", value ?? "")
                    }
                  >
                    <SelectTrigger
                      id="studio-category"
                      aria-invalid={Boolean(errors.category)}
                      className={cn(
                        "h-11 w-full",
                        errors.category && "border-destructive"
                      )}
                    >
                      <LayoutGrid aria-hidden className="size-4 text-slate-400" />
                      <SelectValue
                        placeholder="Select Category"
                        className="data-placeholder:text-muted-foreground"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.label} value={category.label}>
                          <span className="flex items-center gap-2">
                            <category.icon aria-hidden className="size-4" />
                            {category.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError message={errors.category} />
                </div>
              </div>

              <div>
                <Label htmlFor="studio-description" required>
                  Description
                </Label>
                <div className="relative">
                  <Pencil
                    aria-hidden
                    className="pointer-events-none absolute top-3.5 left-3 size-4 text-slate-400"
                  />
                  <Textarea
                    id="studio-description"
                    value={form.description}
                    onChange={(event) =>
                      setField("description", event.target.value)
                    }
                    placeholder="Describe your studio..."
                    aria-invalid={Boolean(errors.description)}
                    className={cn(
                      "min-h-28 pl-9",
                      errors.description && "border-destructive"
                    )}
                  />
                </div>
                <FieldError message={errors.description} />
              </div>
            </section>

            {/* Category Specific Information */}
            <section className="rounded-2xl border border-violet-200/60 bg-violet-50/70 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <SectionHeading>Category Specific Information</SectionHeading>
                <Badge className="h-auto gap-1.5 rounded-full bg-violet-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-600">
                  <activeCategory.icon aria-hidden className="size-4" />
                  {activeCategory.label}
                </Badge>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {activeCategory.extras.map((extra) => {
                  const extraKey = `${activeCategory.label}:${extra.key}`
                  return (
                    <div key={extra.key}>
                      <Label htmlFor={`extra-${extra.key}`}>{extra.label}</Label>
                      <div className="relative">
                        <extra.icon
                          aria-hidden
                          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
                        />
                        <Input
                          id={`extra-${extra.key}`}
                          value={extras[extraKey] ?? ""}
                          onChange={(event) =>
                            setExtras((prev) => ({
                              ...prev,
                              [extraKey]: event.target.value,
                            }))
                          }
                          placeholder={extra.placeholder}
                          className="h-11 pl-9"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Location & Pricing */}
            <section className="flex flex-col gap-4">
              <SectionHeading>Location &amp; Pricing</SectionHeading>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <Label htmlFor="studio-location" required>
                    Location
                  </Label>
                  <div className="relative">
                    <MapPin
                      aria-hidden
                      className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
                    />
                    <Input
                      id="studio-location"
                      value={form.location}
                      onChange={(event) =>
                        setField("location", event.target.value)
                      }
                      placeholder="e.g. Dhanmondi, Dhaka"
                      aria-invalid={Boolean(errors.location)}
                      className={cn(
                        "h-11 pl-9",
                        errors.location && "border-destructive"
                      )}
                    />
                  </div>
                  <FieldError message={errors.location} />
                </div>

                <div>
                  <Label htmlFor="studio-price" required>
                    Price Per Hour (৳)
                  </Label>
                  <div className="relative">
                    <Tag
                      aria-hidden
                      className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
                    />
                    <Input
                      id="studio-price"
                      type="number"
                      min={1}
                      inputMode="numeric"
                      value={form.price}
                      onChange={(event) => setField("price", event.target.value)}
                      placeholder="e.g. 2500"
                      aria-invalid={Boolean(errors.price)}
                      className={cn(
                        "h-11 pl-9 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
                        errors.price && "border-destructive"
                      )}
                    />
                  </div>
                  <FieldError message={errors.price} />
                </div>

                <div className="sm:col-span-2 lg:col-span-1">
                  <Label htmlFor="studio-capacity" required>
                    Maximum Capacity
                  </Label>
                  <div className="relative">
                    <Users
                      aria-hidden
                      className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
                    />
                    <Input
                      id="studio-capacity"
                      type="number"
                      min={1}
                      inputMode="numeric"
                      value={form.capacity}
                      onChange={(event) =>
                        setField("capacity", event.target.value)
                      }
                      placeholder="e.g. 20"
                      aria-invalid={Boolean(errors.capacity)}
                      className={cn(
                        "h-11 pl-9 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
                        errors.capacity && "border-destructive"
                      )}
                    />
                  </div>
                  <FieldError message={errors.capacity} />
                </div>
              </div>
            </section>

            {/* Studio Images */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="flex size-7 items-center justify-center rounded-lg bg-violet-600 text-white"
                >
                  <ImageIcon className="size-4" />
                </span>
                <h2 className="text-lg font-bold tracking-tight text-slate-900">
                  Studio Images
                </h2>
              </div>

              <div
                role="button"
                tabIndex={0}
                aria-label="Upload studio images"
                aria-busy={optimizing}
                onClick={() => {
                  if (!optimizing) {
                    fileInputRef.current?.click()
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    if (!optimizing) {
                      fileInputRef.current?.click()
                    }
                  }
                }}
                onDragOver={(event) => {
                  event.preventDefault()
                  setDragging(true)
                }}
                onDragLeave={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                    setDragging(false)
                  }
                }}
                onDrop={handleDrop}
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-violet-300 bg-violet-50/40 px-6 py-9 text-center transition-colors outline-none focus-visible:border-violet-500 focus-visible:ring-3 focus-visible:ring-violet-500/25",
                  dragging && "border-violet-500 bg-violet-100/70",
                  optimizing && "cursor-progress"
                )}
              >
                <span className="mb-1 flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30">
                  <CloudUpload aria-hidden className="size-5" />
                </span>
                <p className="text-sm font-bold text-slate-800">
                  Upload Studio Images
                </p>
                {optimizing ? (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-violet-600">
                    <Spinner aria-hidden className="size-3.5" />
                    Optimizing images…
                  </span>
                ) : (
                  <p className="text-xs text-slate-500">
                    Drag &amp; drop images or paste image URLs — auto-compressed
                    before upload
                  </p>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileInput}
                />
              </div>

              {images.length > 0 && (
                <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                  {images.map((image) => (
                    <li
                      key={image.id}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- previews are blob:/pasted URLs */}
                      <img
                        src={image.src}
                        alt={image.name}
                        className="size-full object-cover"
                      />
                      <button
                        type="button"
                        aria-label={`Remove ${image.name}`}
                        onClick={() => removeImage(image.id)}
                        className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                      >
                        <X aria-hidden className="size-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Submit */}
            <Button
              type="submit"
              disabled={submitting}
              className="h-12 w-full gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-base font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:opacity-90"
            >
              {submitting ? (
                <Spinner aria-hidden className="size-5" />
              ) : (
                <Send aria-hidden className="size-5" />
              )}
              {submitting ? "Creating Studio…" : "Create Studio"}
            </Button>
          </form>
        </div>

        {/* How It Works — same section as the home page */}
        <div className="relative z-10">
          <HowItWorks />
        </div>
      </main>

      <Toaster />
    </>
  )
}
