import React from 'react';
import {Link} from 'react-router-dom';
import SourceInput from '../../Common/SourceInput'

const SessionTable = props => {
  const {filterList, sort, examStatusList, selectedList, onChange, onDelete} = props;
  return (
    <div className="flex-row mt-3">
      <table className="table table-hover">
        <thead>
        <tr>
          <th />
          <th><a onClick={() => sort("name")}>Name</a></th>
          <th><a onClick={() => sort("dateCreated")}>Created At</a></th>
          <th><a onClick={() => sort("timeStampTestStart")}>Test Start</a></th>
          <th><a onClick={() => sort("timeStampTestEnd")}>Test End</a></th>
          <th><a onClick={() => sort("timeStampTimeTaken")}>Time Taken</a></th>
          <th><a onClick={() => sort("source")}>Source</a></th>
          <th><a onClick={() => sort("notes")}>Notes</a></th>
          <th><a onClick={() => sort("examStatus")}><b>Status</b></a></th>
          <th><b>Action</b></th>
        </tr>
        </thead>
        <tbody>

        {
          filterList && filterList.length > 0 && filterList.map((exam, i) => {
            const checked = selectedList.indexOf(exam.id) !== -1
            return (
              <tr key={i}>
                <td>
                  <input className="chkUpdateRecords" name="chkUpdateRecords" id={exam.id} type="checkbox" checked={checked || false} onChange={onChange}/>
                </td>
                <td>{exam.name}</td>
                <td>{exam.dateCreated}</td>
                <td>{exam.testStart}</td>
                <td>{exam.testEnd}</td>
                <td>{exam.timetaken}</td>
                <td>{exam.source}</td>
                <td className="notes">{exam.notes}</td>
                <td>
                  <SourceInput className="form-control select-input"
                               value={exam.examStatus}
                               onChange={(e) => onChange(e, exam)}
                               sources={examStatusList}
                               name="status"
                  />
                </td>
                <td>
                  <Link to={{pathname: `/session/view/${exam.id}`, state: {testId: exam.id}}} className="btn btn-blue mr-1">View</Link>
                  <button className="btn btn-danger btn-sm mr-1" onClick={() => onDelete(exam.id)}>Delete</button>
                  <Link to={{pathname: `/session/edit/${exam.id}`, state: {testId: exam.id}}} className="btn btn-blue btn-sm">Edit</Link>
                </td>
              </tr>
            )
          })
        }
        {
          filterList && filterList.length === 0 &&
          <tr>
            <td colSpan={9} className="text-center">
              No Records Found!
            </td>
          </tr>
        }
        </tbody>
      </table>

    </div>
  )
}
export default SessionTable