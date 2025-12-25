import { StringInput } from 'sanity'
import { AIFieldGenerator } from './AIFieldGenerator'

export function AITitleInput(props) {
  return (
    <AIFieldGenerator
      fieldName="title"
      value={props.value}
      onChange={props.onChange}
    >
      <div style={{ flex: 1 }}>
        <StringInput {...props} />
      </div>
    </AIFieldGenerator>
  )
}
