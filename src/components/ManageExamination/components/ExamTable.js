import React from 'react';

const ExamTable = props => {
  const {examsList, sort, handleModal, removeExam} = props;
  return (
    <div className='row col-sm-8 offset-sm-2 col-md-8 offset-md-2 col-xs-12'>
      <table className="table table-hover">
        <thead>
        <tr className='text-center'>
          <th><a onClick={() => sort("testTitle")}>Test Title</a></th>
          <th>Action</th>
        </tr>
        </thead>
        <tbody>
        {
          examsList && examsList.length > 0 && examsList.map((exam, i) => {
            return (
              <tr key={i}>
                <td className='text-center'>{exam.testTitle}</td>
                <td className='text-center'>
                  <button className="btn btn-danger btn-sm mr-1 " onClick={() => removeExam(exam.testId)}>Delete</button>
                  <button className="btn btn-blue btn-sm " onClick={() => handleModal(exam)}>Edit</button>
                </td>
              </tr>
            )
          })
        }

        {
          examsList && examsList.length === 0 &&
          <tr>
            <td colSpan={3} className="text-center">
              No Records Found!
            </td>
          </tr>
        }
        </tbody>
      </table>
    </div>
  )
}
export default ExamTable