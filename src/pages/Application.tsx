import React from 'react';
import SidebarLayout from '@/components/layout/SidebarLayout';
import ApplicationForm from '@/components/application/ApplicationForm';

const Application: React.FC = () => {
  return (
    <SidebarLayout>
      <div 
        className="min-h-screen p-6 md:p-8 lg:p-10"
        style={{
          backgroundImage: 'url(/CFF.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="relative z-10 py-4">
          <ApplicationForm />
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Application;
