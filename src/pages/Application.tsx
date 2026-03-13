import React from 'react';
import SidebarLayout from '@/components/layout/SidebarLayout';
import ApplicationForm from '@/components/application/ApplicationForm';

const Application: React.FC = () => {
  return (
    <SidebarLayout>
      <div className="min-h-screen bg-[#faf6f0] px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto min-w-0">
          <ApplicationForm />
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Application;
