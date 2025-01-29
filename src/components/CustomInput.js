import { Input } from "@telegram-apps/telegram-ui";

export default function CustomInput(props) {
  return (
    <Input
      placeholder={props.placeholder}
      value={""}
      // onChange={(e) => console.log(e.target.value)}
    />
  );
}
