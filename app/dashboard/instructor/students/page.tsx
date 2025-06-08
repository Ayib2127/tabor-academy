import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const mockStudents = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', enrolled: '2024-05-01', status: 'Active', progress: 80 },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', enrolled: '2024-04-15', status: 'Completed', progress: 100 },
  { id: 3, name: 'Charlie Lee', email: 'charlie@example.com', enrolled: '2024-05-10', status: 'Active', progress: 45 },
];

export default function StudentManagementPage() {
  const [search, setSearch] = useState('');
  const filtered = mockStudents.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Student Management</h1>
      <Card className="p-6 mb-6">
        <Input
          placeholder="Search students by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mb-4"
        />
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-brand-orange-100 text-brand-orange-700">
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Enrollment Date</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Progress</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(student => (
                <tr key={student.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 font-medium">{student.name}</td>
                  <td className="py-2 px-4">{student.email}</td>
                  <td className="py-2 px-4">{student.enrolled}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>{student.status}</span>
                  </td>
                  <td className="py-2 px-4">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-brand-orange-500 h-2 rounded-full" style={{ width: `${student.progress}%` }} />
                    </div>
                    <span className="ml-2 text-sm">{student.progress}%</span>
                  </td>
                  <td className="py-2 px-4 space-x-2">
                    <Button size="sm" variant="outline">View</Button>
                    <Button size="sm" variant="outline">Message</Button>
                    <Button size="sm" variant="destructive">Remove</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
} 