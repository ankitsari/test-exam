import React from 'react';

const SourceInput = props => {
  const {className, onChange, value, name, sources} = props;
  return (
    <select className={className} onChange={onChange} value={value} name={name}>
      <option value="">--Select--</option>
      {
        sources && sources.length && sources.map((source) => (
          <option key={source.id} value={source.id.toString()}>{source.name}</option>
        ))
      }
    </select>
  )
}
export default SourceInput;
