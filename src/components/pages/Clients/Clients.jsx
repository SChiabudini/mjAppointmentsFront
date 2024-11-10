import React from 'react';
import PersonClient from './PersonClient/PersonClient.jsx';
import CompanyClient from './CompanyClient/CompanyClient.jsx';

const Clients = () => {
  
  return (
    <div>
      <div>
        <PersonClient />
      </div>
      <div>
        <CompanyClient />
      </div>      
    </div>
  )
}

export default Clients;