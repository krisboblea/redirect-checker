import { AIFieldGenerator } from './AIFieldGenerator'

export function AIFAQsInput(props) {
  return (
    <AIFieldGenerator
      fieldName="faqs"
      value={props.value}
      onChange={props.onChange}
    >
      {props.renderDefault(props)}
    </AIFieldGenerator>
  )
}
