import { Slider } from "antd";
import { useState } from "react";

export default function SliderParameter(props: {
	onChange: (value: number)=> void,
	lowerBound: number,
	upperBound: number,
	initValue?: number,
}): React.ReactElement {

	const [value, setValue] = useState(props.lowerBound)
	if (props.initValue) {
		setValue(props.initValue)
	}

	return (
	<>
		<Slider min={props.lowerBound} max={props.upperBound} defaultValue={value} keyboard={false} tooltip={{open: false}} onChange={(val) => {setValue(val), props.onChange(val)}} />
	</>
	);
}
