"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface MultiSelectProps {
  options: { id: number; name: string; logo?: string }[]
  selected: number[]
  onSelectionChange: (selected: number[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelect({
  options,
  selected,
  onSelectionChange,
  placeholder = "Sélectionner...",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")

  const selectedOptions = options.filter((option) => selected.includes(option.id))
  const filteredOptions = options.filter((option) => option.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleSelect = (optionId: number) => {
    if (selected.includes(optionId)) {
      onSelectionChange(selected.filter((id) => id !== optionId))
    } else {
      onSelectionChange([...selected, optionId])
    }
  }

  const handleRemove = (optionId: number) => {
    onSelectionChange(selected.filter((id) => id !== optionId))
  }

  return (
    <div className={className}>
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(!open)}
          className="w-full justify-between border-blue-200 hover:border-blue-300 bg-transparent min-h-[40px]"
        >
          {selectedOptions.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selectedOptions.slice(0, 2).map((option) => (
                <Badge key={option.id} variant="secondary" className="bg-blue-100 text-blue-700">
                  {option.logo} {option.name}
                </Badge>
              ))}
              {selectedOptions.length > 2 && (
                <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                  +{selectedOptions.length - 2} autres
                </Badge>
              )}
            </div>
          ) : (
            <span className="text-slate-500">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>

        {open && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-blue-200 rounded-md shadow-lg max-h-60 overflow-hidden">
            <div className="p-2 border-b">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="p-4 text-sm text-slate-500 text-center">Aucune université trouvée.</div>
              ) : (
                filteredOptions.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => handleSelect(option.id)}
                    className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 transition-colors"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected.includes(option.id) ? "opacity-100 text-blue-600" : "opacity-0",
                      )}
                    />
                    <span className="mr-2">{option.logo}</span>
                    <span className="flex-1">{option.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedOptions.map((option) => (
            <Badge key={option.id} variant="secondary" className="bg-blue-100 text-blue-700">
              {option.logo} {option.name}
              <button
                type="button"
                onClick={() => handleRemove(option.id)}
                className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Overlay pour fermer le dropdown */}
      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}
    </div>
  )
}
