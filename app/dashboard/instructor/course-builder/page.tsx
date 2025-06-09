"use client"

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUpload } from '@/components/ui/file-upload';
import { SiteHeader } from '@/components/site-header';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { DndContext, closestCorners, useSensor, useSensors, PointerSensor, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { supabase } from '@/lib/supabase/client';

interface Category {
    id: string;
    name: string;
}

interface Lesson {
    id: string;
    title: string;
    description?: string;
    video_url?: string | null;
    position: number;
    is_published: boolean;
    course_id: string;
}

export default function CourseBuilderPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
    const [categoryId, setCategoryId] = useState('');
    const [tags, setTags] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
    const [promoVideoUrl, setPromoVideoUrl] = useState<string>('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);

    const [currentStep, setCurrentStep] = useState(1);
    const [createdCourseId, setCreatedCourseId] = useState<string | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [newLessonTitle, setNewLessonTitle] = useState('');
    const [newLessonVideoUrl, setNewLessonVideoUrl] = useState('');
    const [loading, setLoading] = useState(false); // Used for fetching lessons
    const [error, setError] = useState<string | null>(null); // Used for fetching lessons

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Enable drag on long press, 8px distance
            },
        })
    );

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoadingCategories(true);
                const response = await fetch('/api/categories');
                if (!response.ok) {
                    throw new Error('Failed to fetch categories.');
                }
                const data = await response.json();
                setCategories(data);
            } catch (err: any) {
                console.error('Error fetching categories:', err);
                toast.error(err.message || 'Failed to load categories');
            } finally {
                setIsLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        async function fetchLessons() {
            if (currentStep === 2 && createdCourseId) {
                setLoading(true);
                setError(null);
                try {
                    const { data, error: lessonsError } = await supabase
                        .from('lessons')
                        .select('*')
                        .eq('course_id', createdCourseId)
                        .order('position', { ascending: true });

                    if (lessonsError) {
                        throw new Error(lessonsError.message);
                    }
                    setLessons(data || []);
                } catch (err: any) {
                    console.error('Error fetching lessons:', err);
                    setError(err.message || 'Failed to fetch lessons.');
                    toast.error(err.message || 'Failed to fetch lessons.');
                } finally {
                    setLoading(false);
                }
            }
        }
        fetchLessons();
    }, [currentStep, createdCourseId]);


    const handleCreateCourse = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Basic validation
        if (!title.trim()) {
            toast.error('Course title is required');
            return;
        }

        if (!description.trim()) {
            toast.error('Course description is required');
            return;
        }

        if (!categoryId) {
            toast.error('Please select a category');
            return;
        }

        setIsSubmitting(true);

        try {
            const courseData = {
                title: title.trim(),
                description: description.trim(),
                price: price || 0,
                level,
                category_id: categoryId,
                tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
                thumbnail_url: thumbnailUrl || null,
                promo_video_url: promoVideoUrl || null
            };

            console.log('Creating course with data:', courseData);

            const response = await fetch('/api/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(courseData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || `HTTP ${response.status}: Failed to create course`);
            }

            toast.success('Course created successfully! Now, let\'s add your curriculum.');
            setCreatedCourseId(result.id);
            setCurrentStep(2); // Move to the next step

        } catch (err: any) {
            console.error('Error creating course:', err);
            toast.error(err.message || 'Failed to create course. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePreviousStep = () => {
        setCurrentStep(prev => Math.max(1, prev - 1));
    };

    const handleAddLesson = async () => {
        if (!newLessonTitle.trim() || !createdCourseId) {
            toast.error('Lesson title and a created course are required.');
            return;
        }

        setIsSubmitting(true);
        try {
            const newPosition = lessons.length > 0 ? Math.max(...lessons.map(l => l.position)) + 1 : 1;

            const lessonData = {
                title: newLessonTitle.trim(),
                description: '',
                video_url: newLessonVideoUrl.trim() || null,
                position: newPosition,
                is_published: false,
                course_id: createdCourseId,
            };

            const response = await fetch('/api/lessons', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(lessonData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || `HTTP ${response.status}: Failed to add lesson`);
            }

            toast.success('Lesson added successfully!');
            setLessons(prev => [...prev, { ...lessonData, id: result.id }]);
            setNewLessonTitle('');
            setNewLessonVideoUrl('');

        } catch (err: any) {
            console.error('Error adding lesson:', err);
            toast.error(err.message || 'Failed to add lesson. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setLessons((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over?.id);

                const reorderedLessons = arrayMove(items, oldIndex, newIndex);

                // Update positions for all affected lessons locally immediately
                const lessonsWithNewPositions = reorderedLessons.map((lesson, index) => ({
                    ...lesson,
                    position: index + 1, // Assign new position based on array index
                }));

                // No API call here, it will be done on handleSaveCurriculum
                return lessonsWithNewPositions;
            });
        }
    };

    const handleSaveCurriculum = async () => {
        if (!createdCourseId || lessons.length === 0) {
            toast.error('No lessons to save or course not created yet.');
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/lessons/reorder`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ lessons: lessons.map(l => ({ id: l.id, position: l.position })) }),
            });

            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult.error || `HTTP ${response.status}: Failed to save curriculum.`);
            }

            toast.success('Curriculum saved successfully!');
            router.push(`/dashboard/instructor/courses/${createdCourseId}`);

        } catch (err: any) {
            console.error('Error saving curriculum:', err);
            toast.error(err.message || 'Failed to save curriculum. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            
            <main className="flex-1 py-8">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Navigation */}
                    <div className="mb-8">
                        <Link 
                            href={currentStep === 1 ? "/dashboard/instructor" : "#"} 
                            onClick={currentStep === 2 ? handlePreviousStep : undefined}
                            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {currentStep === 1 ? "Back to Dashboard" : "Back to Course Details"}
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tighter gradient-text mb-2">
                            {currentStep === 1 ? "Create a New Course" : "Organize Your Curriculum"}
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            {currentStep === 1
                                ? "Start with a great title and description. You can add lessons and other details after creation."
                                : "Add and reorder your course lessons. This will define the structure of your course."
                            }
                        </p>
                    </div>

                    {currentStep === 1 && (
                        <Card className="card-hover gradient-border w-full">
                            <CardHeader>
                                <CardTitle className="text-xl">Course Foundation</CardTitle>
                                <CardDescription>
                                    Fill out the essential details for your new course. All fields marked with * are required.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleCreateCourse} className="space-y-6">
                                    {/* Course Title */}
                                    <div>
                                        <Label htmlFor="title" className="text-base font-medium">
                                            Course Title *
                                        </Label>
                                        <Input
                                            id="title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="e.g., Introduction to Digital Marketing"
                                            required
                                            className="mt-1"
                                        />
                                        <p className="text-sm text-muted-foreground mt-1">
                                            A catchy and descriptive title for your course.
                                        </p>
                                    </div>

                                    {/* Course Description */}
                                    <div>
                                        <Label htmlFor="description" className="text-base font-medium">
                                            Course Description *
                                        </Label>
                                        <Textarea
                                            id="description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="A brief summary of your course content, what students will learn, and why they should enroll."
                                            required
                                            rows={4}
                                            className="mt-1"
                                        />
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Describe what students will learn and why they should take this course.
                                        </p>
                                    </div>

                                    {/* Category and Level */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="category" className="text-base font-medium">
                                                Category *
                                            </Label>
                                            <Select 
                                                onValueChange={setCategoryId} 
                                                value={categoryId}
                                                disabled={isLoadingCategories}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder={
                                                        isLoadingCategories ? "Loading categories..." : "Select a category"
                                                    } />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((category) => (
                                                        <SelectItem key={category.id} value={category.id}>
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Help students find your course by choosing a category.
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <Label htmlFor="level" className="text-base font-medium">
                                                Skill Level *
                                            </Label>
                                            <Select 
                                                onValueChange={(value) => setLevel(value as typeof level)} 
                                                value={level}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Select a level" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="beginner">Beginner</SelectItem>
                                                    <SelectItem value="intermediate">Intermediate</SelectItem>
                                                    <SelectItem value="advanced">Advanced</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                What skill level is required for this course?
                                            </p>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <div>
                                        <Label htmlFor="tags" className="text-base font-medium">
                                            Tags (Optional)
                                        </Label>
                                        <Input
                                            id="tags"
                                            value={tags}
                                            onChange={(e) => setTags(e.target.value)}
                                            placeholder="e.g., marketing, online business, social media (comma-separated)"
                                            className="mt-1"
                                        />
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Add keywords to help students find your course in search results.
                                        </p>
                                    </div>

                                    {/* Thumbnail and Promo Video Uploads */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="thumbnail" className="text-base font-medium">
                                                Course Thumbnail (Image)
                                            </Label>
                                            <FileUpload
                                                id="thumbnail"
                                                onUrlChange={(url) => setThumbnailUrl(url)}
                                                existingUrl={thumbnailUrl}
                                                fileType="image"
                                            />
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Upload an eye-catching image for your course. (Max 5MB)
                                            </p>
                                        </div>
                                        <div>
                                            <Label htmlFor="promo-video" className="text-base font-medium">
                                                Promotional Video (Optional)
                                            </Label>
                                            <FileUpload
                                                id="promo-video"
                                                onUrlChange={(url) => setPromoVideoUrl(url)}
                                                existingUrl={promoVideoUrl}
                                                fileType="video"
                                            />
                                            <p className="text-sm text-muted-foreground mt-1">
                                                A short video to introduce your course. (Max 50MB)
                                            </p>
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full bg-gradient-to-r from-brand-orange-600 to-brand-orange-500" disabled={isSubmitting}>
                                        {isSubmitting ? 'Creating Course...' : 'Create Course & Next Step'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {currentStep === 2 && (
                        <Card className="card-hover gradient-border w-full">
                            <CardHeader>
                                <CardTitle className="text-xl">Curriculum Organizer</CardTitle>
                                <CardDescription>
                                    Add lessons and organize them by dragging and dropping.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Add New Lesson Form */}
                                <div className="p-4 border rounded-md">
                                    <h4 className="font-semibold mb-3">Add New Lesson</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            placeholder="Lesson Title"
                                            value={newLessonTitle}
                                            onChange={(e) => setNewLessonTitle(e.target.value)}
                                        />
                                        <Input
                                            placeholder="Video URL (Optional)"
                                            value={newLessonVideoUrl}
                                            onChange={(e) => setNewLessonVideoUrl(e.target.value)}
                                        />
                                    </div>
                                    <Button onClick={handleAddLesson} disabled={isSubmitting} className="mt-4 w-full">
                                        {isSubmitting ? 'Adding Lesson...' : 'Add Lesson'}
                                    </Button>
                                </div>

                                {/* Lessons List */}
                                <h4 className="font-semibold mt-6 mb-3">Your Lessons</h4>
                                {loading ? (
                                    <p>Loading lessons...</p>
                                ) : error ? (
                                    <p className="text-red-500">Error: {error}</p>
                                ) : lessons.length === 0 ? (
                                    <p>No lessons added yet. Add your first lesson above!</p>
                                ) : (
                                    <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCorners}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <SortableContext
                                            items={lessons.map(lesson => lesson.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            <div className="space-y-3">
                                                {lessons.map((lesson) => (
                                                    <SortableLessonItem key={lesson.id} lesson={lesson} />
                                                ))}
                                            </div>
                                        </SortableContext>
                                    </DndContext>
                                )}

                                {/* Navigation Buttons for Curriculum Step */}
                                <div className="flex justify-between mt-6">
                                    <Button variant="outline" onClick={handlePreviousStep}>
                                        Previous Step
                                    </Button>
                                    <Button type="button" className="bg-gradient-to-r from-brand-orange-600 to-brand-orange-500" onClick={handleSaveCurriculum} disabled={isSubmitting}>
                                        {isSubmitting ? 'Saving...' : 'Save Curriculum & Finish'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
}

// Separate component for sortable lesson item
interface SortableLessonItemProps {
    lesson: Lesson;
}

function SortableLessonItem({ lesson }: SortableLessonItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: lesson.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="flex items-center justify-between p-4 border rounded-md shadow-sm bg-background cursor-grab"
        >
            <span>{lesson.position}. {lesson.title}</span>
            {/* Add more details or action buttons for each lesson if needed */}
        </div>
    );
}