import { useState, useCallback } from 'react'
import {
  Box,
  Button,
  Card,
  Flex,
  Stack,
  Text,
  Spinner,
  Heading,
  Badge,
} from '@sanity/ui'
import { SparklesIcon, CheckmarkIcon } from '@sanity/icons'
import { useDocumentOperation } from 'sanity'

export function AIFieldSuggestionsAction(props) {
  const { draft, id } = props
  const { patch } = useDocumentOperation(id, 'post')
  const [isOpen, setIsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [suggestions, setSuggestions] = useState(null)
  const [error, setError] = useState(null)
  const [appliedFields, setAppliedFields] = useState({})

  const handleGenerate = useCallback(async () => {
    if (!draft?.content || draft.content.length === 0) {
      setError('Please add content first before generating suggestions')
      return
    }

    setIsGenerating(true)
    setError(null)
    setSuggestions(null)
    setAppliedFields({})

    try {
      // Generate all fields
      const fields = ['title', 'excerpt', 'tags', 'faqs']
      const results = {}

      for (const field of fields) {
        const response = await fetch('/api/generate-field', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            field,
            content: draft.content,
            locale: draft?.locale || 'en',
          }),
        })

        if (response.ok) {
          const data = await response.json()
          results[field] = data.value
        }
      }

      setSuggestions(results)
    } catch (err) {
      console.error('Error generating suggestions:', err)
      setError(err.message || 'Failed to generate suggestions')
    } finally {
      setIsGenerating(false)
    }
  }, [draft])

  const handleApplyField = useCallback((fieldName, value) => {
    let formattedValue = value

    // Format FAQs with required Sanity fields
    if (fieldName === 'faqs' && Array.isArray(value)) {
      formattedValue = value.map((faq) => ({
        _type: 'object',
        _key: Math.random().toString(36).substring(2, 11),
        question: faq.question || '',
        answer: faq.answer || '',
      }))
    }

    // Apply the patch
    patch.execute([{ set: { [fieldName]: formattedValue } }])

    // Mark as applied
    setAppliedFields(prev => ({ ...prev, [fieldName]: true }))
  }, [patch])

  return {
    label: 'AI Field Suggestions',
    icon: SparklesIcon,
    onHandle: () => setIsOpen(true),
    dialog: isOpen && {
      type: 'dialog',
      onClose: () => {
        setIsOpen(false)
        setError(null)
        setSuggestions(null)
        setAppliedFields({})
      },
      header: 'AI Field Suggestions',
      content: (
        <Card padding={4}>
          <Stack space={4}>
            <Text size={1} muted>
              Generate suggestions for title, excerpt, tags, and FAQs based on your content.
              Click on any suggestion to apply it to your document.
            </Text>

            {!suggestions && !isGenerating && (
              <Button
                text="Generate Suggestions"
                tone="primary"
                icon={SparklesIcon}
                onClick={handleGenerate}
                disabled={!draft?.content || draft.content.length === 0}
              />
            )}

            {isGenerating && (
              <Card padding={4} tone="primary">
                <Flex align="center" gap={3}>
                  <Spinner />
                  <Text>Generating suggestions...</Text>
                </Flex>
              </Card>
            )}

            {error && (
              <Card tone="critical" padding={3} radius={2}>
                <Text size={1}>{error}</Text>
              </Card>
            )}

            {suggestions && (
              <Stack space={4}>
                {/* Title Suggestion */}
                {suggestions.title && (
                  <Card padding={3} border radius={2}>
                    <Stack space={3}>
                      <Flex justify="space-between" align="center">
                        <Heading size={1}>Title</Heading>
                        {appliedFields.title ? (
                          <Badge tone="positive" icon={CheckmarkIcon}>Applied</Badge>
                        ) : (
                          <Button
                            text="Apply"
                            tone="primary"
                            mode="ghost"
                            fontSize={1}
                            onClick={() => handleApplyField('title', suggestions.title)}
                          />
                        )}
                      </Flex>
                      <Text size={1} weight="semibold">{suggestions.title}</Text>
                      {draft?.title && draft.title !== suggestions.title && (
                        <Text size={1} muted>Current: {draft.title}</Text>
                      )}
                    </Stack>
                  </Card>
                )}

                {/* Excerpt Suggestion */}
                {suggestions.excerpt && (
                  <Card padding={3} border radius={2}>
                    <Stack space={3}>
                      <Flex justify="space-between" align="center">
                        <Heading size={1}>Excerpt</Heading>
                        {appliedFields.excerpt ? (
                          <Badge tone="positive" icon={CheckmarkIcon}>Applied</Badge>
                        ) : (
                          <Button
                            text="Apply"
                            tone="primary"
                            mode="ghost"
                            fontSize={1}
                            onClick={() => handleApplyField('excerpt', suggestions.excerpt)}
                          />
                        )}
                      </Flex>
                      <Text size={1}>{suggestions.excerpt}</Text>
                      {draft?.excerpt && draft.excerpt !== suggestions.excerpt && (
                        <Text size={1} muted>Current: {draft.excerpt}</Text>
                      )}
                    </Stack>
                  </Card>
                )}

                {/* Tags Suggestion */}
                {suggestions.tags && suggestions.tags.length > 0 && (
                  <Card padding={3} border radius={2}>
                    <Stack space={3}>
                      <Flex justify="space-between" align="center">
                        <Heading size={1}>Tags</Heading>
                        {appliedFields.tags ? (
                          <Badge tone="positive" icon={CheckmarkIcon}>Applied</Badge>
                        ) : (
                          <Button
                            text="Apply"
                            tone="primary"
                            mode="ghost"
                            fontSize={1}
                            onClick={() => handleApplyField('tags', suggestions.tags)}
                          />
                        )}
                      </Flex>
                      <Flex gap={2} wrap="wrap">
                        {suggestions.tags.map((tag, i) => (
                          <Badge key={i} tone="primary">{tag}</Badge>
                        ))}
                      </Flex>
                      {draft?.tags && draft.tags.length > 0 && (
                        <Box>
                          <Text size={1} muted>Current: </Text>
                          <Flex gap={2} wrap="wrap" marginTop={2}>
                            {draft.tags.map((tag, i) => (
                              <Badge key={i} mode="outline">{tag}</Badge>
                            ))}
                          </Flex>
                        </Box>
                      )}
                    </Stack>
                  </Card>
                )}

                {/* FAQs Suggestion */}
                {suggestions.faqs && suggestions.faqs.length > 0 && (
                  <Card padding={3} border radius={2}>
                    <Stack space={3}>
                      <Flex justify="space-between" align="center">
                        <Heading size={1}>FAQs ({suggestions.faqs.length})</Heading>
                        {appliedFields.faqs ? (
                          <Badge tone="positive" icon={CheckmarkIcon}>Applied</Badge>
                        ) : (
                          <Button
                            text="Apply"
                            tone="primary"
                            mode="ghost"
                            fontSize={1}
                            onClick={() => handleApplyField('faqs', suggestions.faqs)}
                          />
                        )}
                      </Flex>
                      <Stack space={2}>
                        {suggestions.faqs.map((faq, i) => (
                          <Card key={i} padding={2} tone="transparent" border>
                            <Stack space={2}>
                              <Text size={1} weight="semibold">{faq.question}</Text>
                              <Text size={1} muted>{faq.answer}</Text>
                            </Stack>
                          </Card>
                        ))}
                      </Stack>
                    </Stack>
                  </Card>
                )}

                <Button
                  text="Generate New Suggestions"
                  mode="ghost"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                />
              </Stack>
            )}
          </Stack>
        </Card>
      ),
    },
  }
}

export const aiFieldSuggestionsPlugin = () => {
  return {
    name: 'ai-field-suggestions',
    document: {
      actions: (prev, context) => {
        const { schemaType, draft } = context

        // Only add to post documents
        if (schemaType !== 'post') {
          return prev
        }

        // Show first if content exists, otherwise add at end
        const hasContent = draft?.content && draft.content.length > 0

        if (hasContent) {
          // Content exists - put AI Field Suggestions at beginning
          return [AIFieldSuggestionsAction, ...prev]
        } else {
          // Content is empty - add at end (Generate with AI will be first)
          return [...prev, AIFieldSuggestionsAction]
        }
      },
    },
  }
}
