import { Select } from "antd";
import { useState } from "react";

export default function DropdownParameter(props: {
	onChange: (value: string)=> void,
	values: string[],
	initValue?: string,
}): React.ReactElement {

	const [value, setValue] = useState(props.values[0])
	if (props.initValue) {
		setValue(props.initValue)
	}
	return (
		<Select value={value} options={props.values.map(value => ({label: value, value}))} onChange={(v:string) => (setValue(v), props.onChange(v))}></Select>
	)
	/*
	return (
	<select value={value} onChange={e => (setValue(e.target.value), props.onChange(e.target.value))}>
		{props.values.map((val, i) => (
			<option key={i} value={val} >{val}</option>
		))}
	</select>
	);
	*/
}
