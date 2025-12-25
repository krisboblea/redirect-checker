import { ArrayInput } from 'sanity'
import { AIFieldGenerator } from './AIFieldGenerator'

export function AIFAQsInput(props) {
  return (
    <AIFieldGenerator
      fieldName="faqs"
      value={props.value}
      onChange={props.onChange}
    >
      <div style={{ flex: 1 }}>
        <ArrayInput {...props} />
      </div>
    </AIFieldGenerator>
  )
}
