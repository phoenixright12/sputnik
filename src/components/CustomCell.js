import { Cell, Section, Radio } from "@telegram-apps/telegram-ui";

export default function CustomCell(props) {
  return (
    <Section header={props.header}>
      <Cell
        className=""
        before={
          <Radio
            name={props.name}
            value={props.firstvalue}
            checked={props.value === props.firstvalue}
            onChange={() => props.setValue(props.firstvalue)} // Исправлено
          />
        }
      >
        {props.firstdescription}
      </Cell>
      <Cell
        className=""
        before={
          <Radio
            name={props.name}
            value={props.secondvalue}
            checked={props.value === props.secondvalue}
            onChange={() => props.setValue(props.secondvalue)} // Исправлено
          />
        }
      >
        {props.seconddescription}
      </Cell>
    </Section>
  );
}
