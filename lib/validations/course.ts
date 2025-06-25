import { z } from 'zod';

export const lessonSchema = z.object({
  title: z.string().min(1, 'Lesson title is required').max(100),
  type: z.enum(['video', 'text', 'quiz']),
  duration: z.number().optional(),
  order: z.number(),
});

export const moduleSchema = z.object({
  title: z.string().min(1, 'Module title is required').max(100),
  description: z.string().optional(),
  lessons: z.array(lessonSchema),
  order: z.number(),
});

export const courseCreationSchema = z.object({
  deliveryType: z.enum(['self_paced','cohort']),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  registrationDeadline: z.string().optional(),
  title: z.string().min(1, 'Course title is required').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  price: z.number().min(0, 'Price must be 0 or greater'),
  thumbnailUrl: z.string().url('Invalid thumbnail URL').optional(),
  promoVideoUrl: z.string().url('Invalid promo video URL').optional(),
  modules: z.array(moduleSchema).min(1, 'At least one module is required'),
});

export type CourseCreationData = z.infer<typeof courseCreationSchema>; 