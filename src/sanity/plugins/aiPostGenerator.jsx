import { useState, useCallback } from 'react'
import {
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Stack,
  Text,
  TextArea,
  Spinner,
  Label,
  Heading,
  Badge,
} from '@sanity/ui'
import { SparklesIcon, DocumentTextIcon } from '@sanity/icons'
import { useDocumentOperation } from 'sanity'

export function AIPostGeneratorAction(props) {
  const { draft, id, onComplete } = props
  const { patch } = useDocumentOperation(id, 'post')
  const [isOpen, setIsOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPost, setGeneratedPost] = useState(null)
  const [error, setError] = useState(null)

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt')
      return
    }

    setIsGenerating(true)
    setError(null)
    setGeneratedPost(null)

    try {
      const response = await fetch('/api/generate-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          locale: draft?.locale || 'en'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate post')
      }

      const data = await response.json()

      // Store the generated post for preview
      setGeneratedPost(data)

    } catch (err) {
      console.error('Error generating post:', err)
      setError(err.message || 'Failed to generate post content')
    } finally {
      setIsGenerating(false)
    }
  }, [prompt, draft])

  const handleInsertPost = useCallback(() => {
    if (!generatedPost) return

    // Build patch object for all generated fields
    const patchData = {}

    if (generatedPost.title) {
      patchData.title = generatedPost.title
    }

    if (generatedPost.excerpt) {
      patchData.excerpt = generatedPost.excerpt
    }

    if (generatedPost.tags && generatedPost.tags.length > 0) {
      patchData.tags = generatedPost.tags
    }

    if (generatedPost.content) {
      patchData.content = generatedPost.content
    }

    if (generatedPost.faqs && generatedPost.faqs.length > 0) {
      patchData.faqs = generatedPost.faqs
    }

    // Execute the patch operation
    patch.execute([{ set: patchData }])

    // Close and reset
    onComplete()
    setIsOpen(false)
    setPrompt('')
    setGeneratedPost(null)
  }, [generatedPost, patch, onComplete])

  return {
    label: 'Generate with AI',
    icon: SparklesIcon,
    onHandle: () => setIsOpen(true),
    dialog: isOpen && {
      type: 'dialog',
      onClose: () => {
        setIsOpen(false)
        setError(null)
      },
      header: 'Generate Blog Post with AI',
      content: (
        <Card padding={4}>
          <Stack space={4}>
            {!generatedPost ? (
              <>
                <Text size={1} muted>
                  Describe the blog post you want to create. AI will generate the title,
                  excerpt, tags, content, and FAQs based on your prompt.
                </Text>

                <Stack space={3}>
                  <Label size={1}>Prompt</Label>
                  <TextArea
                    placeholder="Example: Write a blog post about 'The benefits of URL shortening for social media marketing'. Include tips for tracking clicks and improving engagement."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={6}
                    disabled={isGenerating}
                  />
                </Stack>

                {error && (
                  <Card tone="critical" padding={3} radius={2}>
                    <Text size={1}>{error}</Text>
                  </Card>
                )}

                {isGenerating && (
                  <Card padding={4} tone="primary">
                    <Flex align="center" gap={3}>
                      <Spinner />
                      <Text>Generating complete blog post...</Text>
                    </Flex>
                  </Card>
                )}

                <Flex gap={3} justify="flex-end">
                  <Button
                    text="Cancel"
                    mode="ghost"
                    onClick={() => {
                      setIsOpen(false)
                      setError(null)
                      setPrompt('')
                    }}
                    disabled={isGenerating}
                  />
                  <Button
                    text="Generate"
                    tone="primary"
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    icon={SparklesIcon}
                  />
                </Flex>
              </>
            ) : (
              <>
                <Text size={1} muted>
                  Review the generated content below. Click "Insert Post" to add it to your document.
                </Text>

                <Stack space={4}>
                  {/* Title Preview */}
                  {generatedPost.title && (
                    <Card padding={3} border radius={2}>
                      <Stack space={2}>
                        <Heading size={1}>Title</Heading>
                        <Text size={1} weight="semibold">{generatedPost.title}</Text>
                      </Stack>
                    </Card>
                  )}

                  {/* Excerpt Preview */}
                  {generatedPost.excerpt && (
                    <Card padding={3} border radius={2}>
                      <Stack space={2}>
                        <Heading size={1}>Excerpt</Heading>
                        <Text size={1}>{generatedPost.excerpt}</Text>
                      </Stack>
                    </Card>
                  )}

                  {/* Tags Preview */}
                  {generatedPost.tags && generatedPost.tags.length > 0 && (
                    <Card padding={3} border radius={2}>
                      <Stack space={2}>
                        <Heading size={1}>Tags</Heading>
                        <Flex gap={2} wrap="wrap">
                          {generatedPost.tags.map((tag, i) => (
                            <Badge key={i} tone="primary">{tag}</Badge>
                          ))}
                        </Flex>
                      </Stack>
                    </Card>
                  )}

                  {/* Content Preview */}
                  {generatedPost.content && (
                    <Card padding={3} border radius={2}>
                      <Stack space={2}>
                        <Heading size={1}>Content ({generatedPost.content.length} blocks)</Heading>
                        <Text size={1} muted>
                          {generatedPost.content.filter(b => b._type === 'block').length} paragraphs/headings
                        </Text>
                      </Stack>
                    </Card>
                  )}

                  {/* FAQs Preview */}
                  {generatedPost.faqs && generatedPost.faqs.length > 0 && (
                    <Card padding={3} border radius={2}>
                      <Stack space={3}>
                        <Heading size={1}>FAQs ({generatedPost.faqs.length})</Heading>
                        <Stack space={2}>
                          {generatedPost.faqs.map((faq, i) => (
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
                </Stack>

                <Card tone="caution" padding={3} radius={2}>
                  <Text size={1}>
                    ⚠️ This will replace all existing content in this document.
                  </Text>
                </Card>

                <Flex gap={3} justify="space-between">
                  <Button
                    text="Generate New"
                    mode="ghost"
                    onClick={() => setGeneratedPost(null)}
                  />
                  <Flex gap={3}>
                    <Button
                      text="Cancel"
                      mode="ghost"
                      onClick={() => {
                        setIsOpen(false)
                        setError(null)
                        setPrompt('')
                        setGeneratedPost(null)
                      }}
                    />
                    <Button
                      text="Insert Post"
                      tone="primary"
                      icon={DocumentTextIcon}
                      onClick={handleInsertPost}
                    />
                  </Flex>
                </Flex>
              </>
            )}
          </Stack>
        </Card>
      ),
    },
  }
}

export const aiPostGeneratorPlugin = () => {
  return {
    name: 'ai-post-generator',
    document: {
      actions: (prev, { schemaType }) => {
        // Only add to post documents
        if (schemaType !== 'post') {
          return prev
        }

        return [AIPostGeneratorAction, ...prev]
      },
    },
  }
}
