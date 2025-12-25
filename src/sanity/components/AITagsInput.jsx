import { ArrayOfPrimitivesInput } from 'sanity'
import { AIFieldGenerator } from './AIFieldGenerator'

export function AITagsInput(props) {
  return (
    <AIFieldGenerator
      fieldName="tags"
      value={props.value}
      onChange={props.onChange}
    >
      <div style={{ flex: 1 }}>
        <ArrayOfPrimitivesInput {...props} />
      </div>
    </AIFieldGenerator>
  )
}
