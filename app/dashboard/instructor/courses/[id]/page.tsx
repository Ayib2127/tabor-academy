"use client"

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { CourseStructure } from '@/components/instructor/course-builder/CourseStructure';
import { SiteHeader } from "@/components/site-header";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Lesson {
    id: number;
    title: string;
}

interface Module {
    id: number;
    title: string;
    lessons: Lesson[];
}

export default function CourseEditorPage() {
    const { id: courseId } = useParams<{ id: string }>();
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddModuleInput, setShowAddModuleInput] = useState(false);
    const [newModuleTitle, setNewModuleTitle] = useState('');
    const supabase = createClientComponentClient();

    const fetchCourseModules = useCallback(async () => {
        if (!courseId) return;

        try {
            setLoading(true);
            const response = await fetch(`/api/courses/${courseId}/modules`, {
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch course modules.');
            }
            const data: Module[] = await response.json();
            setModules(data);
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    useEffect(() => {
        fetchCourseModules();
    }, [fetchCourseModules]);

    const handleAddModule = async (title: string) => {
        if (!title.trim()) {
            toast.error('Module title cannot be empty.');
            return;
        }
        try {
            // Simulate API call for adding a module
            const response = await fetch(`/api/courses/${courseId}/modules`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title }),
                credentials: 'include',
            });
            const newModule = await response.json();
            if (!response.ok) {
                throw new Error(newModule.error || 'Failed to add module.');
            }
            setModules(prev => [...prev, newModule]);
            setNewModuleTitle('');
            setShowAddModuleInput(false);
            toast.success('Module added successfully!');
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleDeleteModule = async (moduleId: number) => {
        try {
            // Simulate API call for deleting a module
            const response = await fetch(`/api/courses/${courseId}/modules/${moduleId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to delete module.');
            }
            setModules(prev => prev.filter(mod => mod.id !== moduleId));
            toast.success('Module deleted successfully!');
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleAddLesson = async (moduleId: number) => {
        const lessonTitle = prompt('Enter lesson title:'); // For simplicity, using prompt
        if (!lessonTitle?.trim()) {
            if (lessonTitle !== null) toast.error('Lesson title cannot be empty.');
            return;
        }

        try {
            // Simulate API call for adding a lesson
            const response = await fetch(`/api/courses/${courseId}/modules/${moduleId}/lessons`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: lessonTitle }),
                credentials: 'include',
            });
            const newLesson = await response.json();
            if (!response.ok) {
                throw new Error(newLesson.error || 'Failed to add lesson.');
            }
            setModules(prev =>
                prev.map(mod =>
                    mod.id === moduleId
                        ? { ...mod, lessons: [...mod.lessons, newLesson] }
                        : mod
                )
            );
            toast.success('Lesson added successfully!');
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleDeleteLesson = async (moduleId: number, lessonId: number) => {
        try {
            // Simulate API call for deleting a lesson
            const response = await fetch(`/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to delete lesson.');
            }
            setModules(prev =>
                prev.map(mod =>
                    mod.id === moduleId
                        ? { ...mod, lessons: mod.lessons.filter(lesson => lesson.id !== lessonId) }
                        : mod
                )
            );
            toast.success('Lesson deleted successfully!');
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleReorderModules = async (reorderedModules: Module[]) => {
        setModules(reorderedModules); // Optimistic update
        try {
            // Simulate API call to update module order
            const response = await fetch(`/api/courses/${courseId}/modules/reorder`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ moduleIds: reorderedModules.map(m => m.id) }),
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to reorder modules.');
            }
            toast.success('Modules reordered successfully!');
        } catch (err: any) {
            toast.error(err.message);
            // Revert on error if necessary, or refetch
            fetchCourseModules();
        }
    };

    const handleReorderLessons = async (moduleId: number, reorderedLessons: Lesson[]) => {
        setModules(prev =>
            prev.map(mod =>
                mod.id === moduleId
                    ? { ...mod, lessons: reorderedLessons }
                    : mod
            )
        ); // Optimistic update

        try {
            // Simulate API call to update lesson order within a module
            const response = await fetch(`/api/courses/${courseId}/modules/${moduleId}/lessons/reorder`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lessonIds: reorderedLessons.map(l => l.id) }),
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to reorder lessons.');
            }
            toast.success('Lessons reordered successfully!');
        } catch (err: any) {
            toast.error(err.message);
            // Revert on error if necessary, or refetch
            fetchCourseModules();
        }
    };

    if (loading) {
        return (
            <>
                <SiteHeader />
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <SiteHeader />
                <div className="text-red-500 p-4">Error: {error}</div>
            </>
        );
    }

    return (
        <>
            <SiteHeader />
            <div className="container mx-auto py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Edit Course: {courseId}</h1>
                    <Link href={`/dashboard/instructor/courses/${courseId}/preview`} passHref>
                        <Button variant="outline">
                            Preview Course
                        </Button>
                    </Link>
                </div>
                <CourseStructure
                    modules={modules}
                    onModulesChange={setModules}
                    onAddModule={handleAddModule}
                    onDeleteModule={handleDeleteModule}
                    onAddLesson={handleAddLesson}
                    onDeleteLesson={handleDeleteLesson}
                    showAddModuleInput={showAddModuleInput}
                    newModuleTitle={newModuleTitle}
                    onNewModuleTitleChange={(title) => {
                        setNewModuleTitle(title);
                        setShowAddModuleInput(true); // Show input when typing
                    }}
                    onCancelAddModule={() => {
                        setNewModuleTitle('');
                        setShowAddModuleInput(false);
                    }}
                    onReorderModules={handleReorderModules}
                    onReorderLessons={handleReorderLessons}
                />
            </div>
        </>
    );
}