import { TextArea } from 'sanity'
import { AIFieldGenerator } from './AIFieldGenerator'

export function AIExcerptInput(props) {
  return (
    <AIFieldGenerator
      fieldName="excerpt"
      value={props.value}
      onChange={props.onChange}
    >
      <div style={{ flex: 1 }}>
        <TextArea {...props} rows={3} />
      </div>
    </AIFieldGenerator>
  )
}
