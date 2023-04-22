// a component that provides a interface to matrix

import * as React from 'react';
import * as model from '../services/modelServices';

export default function ModelMatrix() {
  const [matrix, setMatrix] = React.useState(model.getMatrix());

  React.useEffect(() => {
    model.subscribe(setMatrix);
  }, []);

  return (
    <div>
      <h1>Model Matrix</h1>
      <table>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={i}>
              {row.map((col, j) => (
                <td key={j}>{col}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}