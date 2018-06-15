import React from 'react';

const SourceInput = props => {
    const {className, onChange, value, name, sources, examStatusError, data = 0} = props;
  return (
      <div>
            <span style={{color:"red"}} >{examStatusError}</span>
            <select className={className} onChange={onChange} value={value} name={name} data-id={data}>
              <option value="">--Select--</option>
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
