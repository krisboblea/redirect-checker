import { AIFieldGenerator } from './AIFieldGenerator'

export function AITitleInput(props) {
  return (
    <AIFieldGenerator
      fieldName="title"
      value={props.value}
      onChange={props.onChange}
    >
      {props.renderDefault(props)}
    </AIFieldGenerator>
  )
}
