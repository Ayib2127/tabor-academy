"use client"

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

export default function CourseBuilderPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreateCourse = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, price, level }),
            });

            const newCourse = await response.json();

            if (!response.ok) {
                throw new Error(newCourse.error || 'Failed to create course.');
            }

            toast.success('Course created successfully! Redirecting to the editor...');

            // Redirect to the new course's editor page
            router.push(`/dashboard/instructor/courses/${newCourse.id}`);

        } catch (err: any) {
            toast.error(err.message);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto py-8 max-w-3xl">
            <h1 className="text-3xl font-bold mb-6">Create a New Course</h1>
            <p className="text-muted-foreground mb-8">
                Start with a great title and description. You can add lessons and other details after creation.
            </p>

            <Card>
                <CardHeader>
                    <CardTitle>Course Foundation</CardTitle>
                    <CardDescription>Fill out the essential details for your new course.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreateCourse} className="space-y-6">
                        <div>
                            <Label htmlFor="title" className="text-lg">Course Title</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Introduction to Digital Marketing"
                                required
                            />
                            <p className="text-sm text-muted-foreground mt-1">What will students learn in your course?</p>
                        </div>

                        <div>
                            <Label htmlFor="description">Course Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="A brief summary of your course content..."
                                required
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Label htmlFor="level">Level</Label>
                                <select
                                    id="level"
                                    value={level}
                                    onChange={(e) => setLevel(e.target.value as typeof level)}
                                    className="w-full p-2 border rounded-md"
                                >
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                            <div className="flex-1">
                                <Label htmlFor="price">Price ($)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                                    min="0"
                                />
                            </div>
                        </div>

                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating Course...' : 'Create Course and Continue'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
