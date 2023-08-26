import { Button, Col, Row } from "antd";
import { useState } from "react";

export default function ChoiceParameter(props: {
	onChange: (value: string)=> void,
	values: string[],
	initValue?: string,
}): React.ReactElement {

	const [value, setValue] = useState(props.values[0])
	if (props.initValue) {
		setValue(props.initValue)
	}
	// split values into rows of 3
	const rows: string[][] = []
	for (let i=0; i<props.values.length; i+=3) {
		rows.push(props.values.slice(i*3, i*3+3))
	}

	return (
	<div>
		{rows.map((row, i) => (<Row key={`row-${i}`}>{row.map((val, i) => (<Col key={`col-${i}`}>
			<Button data-value={val} onClick={() => {setValue(val), props.onChange(val)}} type={val === value ? 'primary' : 'default'}>{val}</Button>
		</Col>))}</Row>))}
	</div>
	);
}
