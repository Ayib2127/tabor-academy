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

interface Category {
    id: string;
    name: string;
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

            toast.success('Course created successfully! Redirecting to the course editor...');

            // Redirect to the course editor or dashboard
            setTimeout(() => {
                router.push(`/dashboard/instructor/courses/${result.id}`);
            }, 1000);

        } catch (err: any) {
            console.error('Error creating course:', err);
            toast.error(err.message || 'Failed to create course. Please try again.');
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
                            href="/dashboard/instructor" 
                            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tighter gradient-text mb-2">
                            Create a New Course
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Start with a great title and description. You can add lessons and other details after creation.
                        </p>
                    </div>

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
                                        placeholder="e.g., SEO, Social Media, Startups"
                                        className="mt-1"
                                    />
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Add comma-separated tags to improve discoverability.
                                    </p>
                                </div>

                                {/* Price */}
                                <div>
                                    <Label htmlFor="price" className="text-base font-medium">
                                        Price (USD)
                                    </Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        className="mt-1"
                                    />
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Set a price for your course. Enter 0 for a free course.
                                    </p>
                                </div>

                                {/* Course Thumbnail */}
                                <div>
                                    <Label htmlFor="thumbnail" className="text-base font-medium">
                                        Course Thumbnail (Optional)
                                    </Label>
                                    <FileUpload 
                                        id="thumbnail"
                                        endpoint="/api/upload"
                                        onUrlChange={(url) => setThumbnailUrl(url)}
                                        className="mt-1"
                                    />
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Upload an eye-catching image for your course. (Max 5MB)
                                    </p>
                                </div>

                                {/* Promotional Video */}
                                <div>
                                    <Label htmlFor="promoVideo" className="text-base font-medium">
                                        Promotional Video (Optional)
                                    </Label>
                                    <FileUpload 
                                        id="promoVideo"
                                        endpoint="/api/upload"
                                        onUrlChange={(url) => setPromoVideoUrl(url)}
                                        className="mt-1"
                                    />
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Add a short video to introduce your course. (Max 20MB)
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <div className="flex gap-4 pt-6">
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={() => router.back()}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        disabled={isSubmitting || isLoadingCategories}
                                        className="bg-gradient-to-r from-brand-orange-600 to-brand-orange-500 hover:from-brand-orange-700 hover:to-brand-orange-600"
                                    >
                                        {isSubmitting ? 'Creating Course...' : 'Create Course and Continue'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Help Section */}
                    <Card className="mt-8 bg-blue-50 border-blue-200">
                        <CardContent className="pt-6">
                            <h3 className="font-semibold text-blue-900 mb-2">💡 Course Creation Tips</h3>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• Choose a clear, descriptive title that tells students exactly what they'll learn</li>
                                <li>• Write a compelling description that highlights the value and outcomes</li>
                                <li>• Select the most relevant category to help students discover your course</li>
                                <li>• Use specific tags that students might search for</li>
                                <li>• A good thumbnail can significantly increase enrollment rates</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}