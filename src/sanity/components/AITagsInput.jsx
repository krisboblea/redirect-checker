import { AIFieldGenerator } from './AIFieldGenerator'

export function AITagsInput(props) {
  return (
    <AIFieldGenerator
      fieldName="tags"
      value={props.value}
      onChange={props.onChange}
    >
      {props.renderDefault(props)}
    </AIFieldGenerator>
  )
}
