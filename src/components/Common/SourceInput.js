import React from 'react';

const SourceInput = props => {
  const {className, onChange, value, name, sources, examStatusError, data = 0} = props;
  return (
      <div>
            <select className={className} onChange={onChange} value={value} name={name} data-id={data}>
              {name !== "status" ? <option value="0">--Select--</option> : null}
              {
                sources && sources.length && sources.map((source) => (
                  <option key={source.id} data-id={data} value={source.id.toString()}>{source.name}</option>
                ))
              }
            </select>
      </div>
  )
}
export default SourceInput;
