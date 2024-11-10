import React from 'react';
import PersonClient from './PersonClient/PersonClient.jsx';
import CompanyClient from './CompanyClient/CompanyClient.jsx';

const Clients = () => {
  return (
    <div>
      <PersonClient />
      <CompanyClient />
    </div>
  )
}

export default Clients;