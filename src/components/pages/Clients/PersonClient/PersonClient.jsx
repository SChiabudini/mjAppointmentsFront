import React from 'react';
import NewPersonClient from './NewPersonClient/NewPersonClient.jsx';
import PersonClientsTable from './PersonClientsTable/PersonClientsTable.jsx';

const PersonClient = () => {

  return(
    <div className='page'>
      <NewPersonClient />
      <PersonClientsTable />
    </div>
  )
}

export default PersonClient;