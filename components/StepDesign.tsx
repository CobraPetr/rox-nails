'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useBookingStore } from '@/store/booking'
import { ImageUploader } from './ImageUploader'
import { Upload, X } from 'lucide-react'

interface StepDesignProps {
  onNext: () => void
  onBack: () => void
}

export function StepDesign({ onNext, onBack }: StepDesignProps) {
  const { draft, setDesignText, addImage, removeImage, isValid } = useBookingStore()
  const [showImageUpload, setShowImageUpload] = useState(false)

  const handleImageUpload = (image: { url: string; name?: string }) => {
    addImage(image)
    setShowImageUpload(false)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-script text-gray-600">Design</h1>
        <h2 className="text-xl font-bold text-primary">
          Zeig mir welche<br />
          Nägel du willst,
        </h2>
      </div>

      <div className="space-y-6">
        {/* Image Upload Section */}
        <div className="space-y-4">
          <Card 
            className="cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setShowImageUpload(true)}
          >
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <div className="text-gray-600">
                  <p className="font-medium">Bild hochladen</p>
                  <p className="text-sm">Zeig mir dein Wunschdesign</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Uploaded Images */}
          {draft.designImages.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {draft.designImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image.url}
                    alt={image.name || `Design ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="text-center">
          <span className="text-gray-400 text-sm">oder</span>
        </div>

        {/* Text Input */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-primary">
            schreib es mir.
          </h3>
          <Textarea
            placeholder="Bsp. dunkel blauer French"
            value={draft.designText || ''}
            onChange={(e) => setDesignText(e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Zurück
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!isValid(2)}
          className="bg-primary hover:bg-primary/90"
        >
          Weiter
        </Button>
      </div>

      {/* Image Upload Modal */}
      {showImageUpload && (
        <ImageUploader
          onUpload={handleImageUpload}
          onClose={() => setShowImageUpload(false)}
        />
      )}
    </div>
  )
}
