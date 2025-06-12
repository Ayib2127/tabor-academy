"use client";

import { FC } from 'react';
import { CourseCreationData } from '@/lib/validations/course';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CourseSummaryProps {
  courseData: CourseCreationData;
}

const CourseSummary: FC<CourseSummaryProps> = ({ courseData }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-500">Title</h3>
            <p className="text-lg">{courseData.title}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-500">Description</h3>
            <p className="text-gray-700">{courseData.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-500">Category</h3>
              <p>{courseData.category}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-500">Level</h3>
              <p>{courseData.level}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-500">Price</h3>
              <p>${courseData.price}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Curriculum</CardTitle>
        </CardHeader>
        <CardContent>
          {courseData.modules.map((module, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <h3 className="font-medium mb-2">{module.title}</h3>
              <ul className="space-y-2">
                {module.lessons.map((lesson, lessonIndex) => (
                  <li key={lessonIndex} className="text-gray-600">
                    {lesson.title}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseSummary; 