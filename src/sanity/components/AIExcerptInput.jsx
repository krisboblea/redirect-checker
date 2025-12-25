import { AIFieldGenerator } from './AIFieldGenerator'

export function AIExcerptInput(props) {
  return (
    <AIFieldGenerator
      fieldName="excerpt"
      value={props.value}
      onChange={props.onChange}
    >
      {props.renderDefault(props)}
    </AIFieldGenerator>
  )
}
