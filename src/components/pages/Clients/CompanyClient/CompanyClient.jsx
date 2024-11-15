import React from 'react';
import NewCompanyClient from './NewCompanyClient/NewCompanyClient.jsx';
import CompanyClientsTable from './CompanyClientsTable/CompanyClientsTable.jsx';

const CompanyClient = () => {

  return(
    <div className='page'>
      <NewCompanyClient />
      <CompanyClientsTable />
    </div>
  )
}

export default CompanyClient;