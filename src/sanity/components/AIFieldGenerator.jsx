import { useState, useCallback } from 'react'
import { Button, Stack, Inline, Text } from '@sanity/ui'
import { SparklesIcon } from '@sanity/icons'
import { useFormValue } from 'sanity'

export function AIFieldGenerator({
  fieldName,
  children,
  onChange,
  value
}) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)

  // Get the content field value from the document
  const content = useFormValue(['content'])
  const locale = useFormValue(['locale']) || 'en'

  const handleGenerate = useCallback(async () => {
    if (!content || content.length === 0) {
      setError('Please add content first before generating this field')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-field', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          field: fieldName,
          content,
          locale,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate field')
      }

      const data = await response.json()

      // Call the onChange handler with the generated value
      onChange(data.value)

    } catch (err) {
      console.error('Error generating field:', err)
      setError(err.message || 'Failed to generate field')
    } finally {
      setIsGenerating(false)
    }
  }, [content, locale, fieldName, onChange])

  return (
    <Stack space={2}>
      <Inline space={2}>
        {children}
        <Button
          icon={SparklesIcon}
          text={isGenerating ? 'Generating...' : 'AI Generate'}
          tone="primary"
          mode="ghost"
          fontSize={1}
          padding={2}
          onClick={handleGenerate}
          disabled={isGenerating || !content || content.length === 0}
        />
      </Inline>
      {error && (
        <Text size={1} style={{ color: 'red' }}>
          {error}
        </Text>
      )}
    </Stack>
  )
}
