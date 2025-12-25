import { useState, useCallback } from 'react'
import { Button, Stack, Inline, Text } from '@sanity/ui'
import { SparklesIcon } from '@sanity/icons'
import { useFormValue, set, unset } from 'sanity'

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

  // Debug props
  console.log(`AIFieldGenerator for ${fieldName}:`, { onChange: typeof onChange, value })

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

      // Validate response
      if (!data || data.value === null || data.value === undefined) {
        throw new Error('No value returned from AI')
      }

      // Format the value based on field type
      let formattedValue = data.value

      // For FAQs, add required Sanity fields
      if (fieldName === 'faqs') {
        if (!Array.isArray(formattedValue)) {
          throw new Error('FAQs must be an array')
        }
        formattedValue = formattedValue.map((faq) => ({
          _type: 'object',
          _key: Math.random().toString(36).substring(2, 11),
          question: faq.question || '',
          answer: faq.answer || '',
        }))
      }

      // For tags, ensure it's an array
      if (fieldName === 'tags') {
        if (!Array.isArray(formattedValue)) {
          throw new Error('Tags must be an array')
        }
        // Ensure each tag is a string
        formattedValue = formattedValue.filter(tag => typeof tag === 'string' && tag.trim())
      }

      // Call the onChange handler with a patch
      console.log('Calling onChange with:', formattedValue)

      if (typeof onChange === 'function') {
        // Use Sanity's set patch for proper updates
        onChange(set(formattedValue))
      } else {
        throw new Error('onChange is not a function')
      }

    } catch (err) {
      console.error('Error generating field:', err)
      console.error('Full error:', err)
      setError(err.message || 'Failed to generate field')
    } finally {
      setIsGenerating(false)
    }
  }, [content, locale, fieldName, onChange])

  return (
    <Stack space={2}>
      <Inline space={2} style={{ justifyContent: 'flex-end' }}>
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
      {children}
      {error && (
        <Text size={1} style={{ color: 'red' }}>
          {error}
        </Text>
      )}
    </Stack>
  )
}
