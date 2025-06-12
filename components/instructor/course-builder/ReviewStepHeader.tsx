"use client";

import { FC } from 'react';

interface ReviewStepHeaderProps {
  title: string;
  description: string;
}

const ReviewStepHeader: FC<ReviewStepHeaderProps> = ({ title, description }) => {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default ReviewStepHeader; 