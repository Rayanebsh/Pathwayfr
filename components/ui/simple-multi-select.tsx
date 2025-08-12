"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, ChevronDown } from "lucide-react"

interface Option {
  id: number
  name: string
  logo?: string
}

interface SimpleMultiSelectProps {
  options: Option[]
  selected: number[]
  onSelectionChange: (selected: number[]) => void
  placeholder?: string
  className?: string
}

export function SimpleMultiSelect({
  options,
  selected,
  onSelectionChange,
  placeholder = "Sélectionner...",
  className,
}: SimpleMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)

  const selectedOptions = options.filter((option) => selected.includes(option.id))
  const filteredOptions = options.filter((option) => option.name.toLowerCase().includes(search.toLowerCase()))

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + 4, // Position fixed, pas besoin de scrollY
        left: rect.left,
        width: rect.width,
      })
    }
  }, [isOpen])

  const handleToggleOption = (optionId: number, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    if (selected.includes(optionId)) {
      onSelectionChange(selected.filter((id) => id !== optionId))
    } else {
      onSelectionChange([...selected, optionId])
    }
  }

  const removeOption = (optionId: number, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    onSelectionChange(selected.filter((id) => id !== optionId))
  }

  const handleButtonClick = (event: React.MouseEvent) => {
    event.preventDefault()
    setIsOpen(!isOpen)
    setSearch("") // Reset search when opening
  }

  return (
    <div className={`relative ${className || ""}`}>
      {/* Trigger Button */}
      <Button
        ref={buttonRef}
        type="button"
        variant="outline"
        onClick={handleButtonClick}
        className={`w-full justify-between bg-transparent min-h-[50px] p-3 ${
          className?.includes("border-green")
            ? "border-green-200 hover:border-green-300"
            : className?.includes("border-red")
              ? "border-red-200 hover:border-red-300"
              : "border-blue-200 hover:border-blue-300"
        }`}
      >
        <div className="flex flex-wrap gap-1 flex-1">
          {selectedOptions.length === 0 ? (
            <span className="text-slate-500">{placeholder}</span>
          ) : (
            selectedOptions.slice(0, 3).map((option) => (
              <Badge key={option.id} variant="secondary" className="bg-blue-100 text-blue-700">
                {option.logo} {option.name}
              </Badge>
            ))
          )}
          {selectedOptions.length > 3 && (
            <Badge variant="secondary" className="bg-slate-100 text-slate-600">
              +{selectedOptions.length - 3} autres
            </Badge>
          )}
        </div>
        <ChevronDown className="h-4 w-4 ml-2 shrink-0" />
      </Button>

      {/* Dropdown Portal */}
      {isOpen &&
        createPortal(
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 z-[9998]"
              onClick={(e) => {
                e.preventDefault()
                setIsOpen(false)
              }}
            />

            {/* Dropdown */}
            <div
              style={{
                position: "fixed", // Fixed au lieu d'absolute
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
                zIndex: 9999,
              }}
              className={`bg-white rounded-lg shadow-xl max-h-80 overflow-hidden border-2 ${
                className?.includes("border-green")
                  ? "border-green-200"
                  : className?.includes("border-red")
                    ? "border-red-200"
                    : "border-blue-200"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search */}
              <div className="p-3 border-b bg-white">
                <input
                  type="text"
                  placeholder="Rechercher une université..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-500"
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              </div>

              {/* Options */}
              <div className="max-h-60 overflow-y-auto bg-white">
                {filteredOptions.length === 0 ? (
                  <div className="p-4 text-center text-slate-500 text-sm">
                    {options.length === 0 ? "Sélectionnez d'abord vos universités visées" : "Aucune université trouvée"}
                  </div>
                ) : (
                  filteredOptions.map((option) => (
                    <div
                      key={option.id}
                      onClick={(e) => handleToggleOption(option.id, e)}
                      className={`px-4 py-3 cursor-pointer hover:bg-blue-50 flex items-center transition-colors ${
                        selected.includes(option.id) ? "bg-blue-50 text-blue-700" : ""
                      }`}
                    >
                      <div className="mr-3 text-lg">{option.logo}</div>
                      <span className="flex-1">{option.name}</span>
                      {selected.includes(option.id) && (
                        <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </>,
          document.body,
        )}

      {/* Selected Items */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedOptions.map((option) => (
            <Badge key={option.id} variant="secondary" className="bg-blue-100 text-blue-700 pr-1">
              {option.logo} {option.name}
              <button
                type="button"
                onClick={(e) => removeOption(option.id, e)}
                className="ml-2 hover:bg-blue-200 rounded-full p-1"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
