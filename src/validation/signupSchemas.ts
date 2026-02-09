import { z } from 'zod';

/**
 * Zod Validation Schemas for SignupMultiStep Form
 * 
 * This file contains all validation schemas using Zod for type-safe,
 * composable validation with excellent error messages.
 */

// ============================================================================
// STEP 1: Registration Schema
// ============================================================================

export const step1Schema = z.object({
    firstName: z
        .string()
        .min(1, 'First name is required')
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name must be less than 50 characters')
        .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),

    lastName: z
        .string()
        .min(1, 'Last name is required')
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name must be less than 50 characters')
        .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),

    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address')
        .toLowerCase()
        .trim(),

    password: z
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/, 'Password contains invalid characters'),

    confirmPassword: z
        .string()
        .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

// ============================================================================
// STEP 2: Company Info Schemas (by work type)
// ============================================================================

// Common fields for all work types
const commonStep2Fields = {
    address: z
        .string()
        .min(1, 'Address is required')
        .min(5, 'Please enter a complete address')
        .max(200, 'Address is too long'),

    phone: z
        .string()
        .min(1, 'Phone number is required')
        .regex(/^\+1\d{10}$/, 'Phone must be in US format: +1 followed by 10 digits (e.g., +15551234567)'),

    role: z
        .string()
        .min(1, 'Role is required'),
};

// Subcontractor Schema
export const subcontractorSchema = z.object({
    workType: z.literal('subcontractor'),

    companyName: z
        .string()
        .min(1, 'Company name is required')
        .min(2, 'Company name must be at least 2 characters')
        .max(100, 'Company name is too long'),

    companySize: z
        .string()
        .min(1, 'Company size is required'),

    yearsInBusiness: z
        .number()
        .min(0, 'Years in business cannot be negative')
        .max(200, 'Please enter a valid number of years')
        .or(z.string().min(1, 'Years in business is required').transform(Number)),

    serviceArea: z
        .string()
        .min(1, 'Service area is required')
        .min(2, 'Please enter a valid service area')
        .max(100, 'Service area is too long'),

    ...commonStep2Fields,
});

// General Contractor Schema
export const generalContractorSchema = z.object({
    workType: z.literal('general-contractor'),

    companyName: z
        .string()
        .min(1, 'Company name is required')
        .min(2, 'Company name must be at least 2 characters')
        .max(100, 'Company name is too long'),

    companySize: z
        .string()
        .min(1, 'Company size is required'),

    yearsInBusiness: z
        .number()
        .min(0, 'Years in business cannot be negative')
        .max(200, 'Please enter a valid number of years')
        .or(z.string().min(1, 'Years in business is required').transform(Number)),

    projectSizeRange: z
        .string()
        .min(1, 'Project size range is required'),

    ...commonStep2Fields,
});

// Supplier Schema
export const supplierSchema = z.object({
    workType: z.literal('supplier'),

    companyName: z
        .string()
        .min(1, 'Company name is required')
        .min(2, 'Company name must be at least 2 characters')
        .max(100, 'Company name is too long'),

    companySize: z
        .string()
        .min(1, 'Company size is required'),

    yearsInBusiness: z
        .number()
        .min(0, 'Years in business cannot be negative')
        .max(200, 'Please enter a valid number of years')
        .or(z.string().min(1, 'Years in business is required').transform(Number)),

    businessType: z
        .string()
        .min(1, 'Business type is required'),

    deliveryRadius: z
        .number()
        .min(1, 'Delivery radius must be at least 1 mile')
        .max(10000, 'Please enter a valid delivery radius')
        .or(z.string().min(1, 'Delivery radius is required').transform(Number)),

    minOrderValue: z
        .string()
        .min(1, 'Minimum order value is required')
        .regex(/^\$?\d+(\.\d{2})?$/, 'Please enter a valid dollar amount'),

    offerCreditTerms: z.boolean().optional(),

    ...commonStep2Fields,
});

// Client Schema
export const clientSchema = z.object({
    workType: z.literal('client'),

    projectType: z
        .string()
        .min(1, 'Project type is required'),

    budget: z
        .string()
        .min(1, 'Budget range is required'),

    timeline: z
        .string()
        .min(1, 'Timeline is required'),

    financingStatus: z
        .string()
        .min(1, 'Financing status is required'),

    propertySize: z
        .string()
        .optional(),

    companyName: z
        .string()
        .optional(),

    ...commonStep2Fields,
});

// Combined Step 2 Schema (discriminated union based on workType)
export const step2Schema = z.discriminatedUnion('workType', [
    subcontractorSchema,
    generalContractorSchema,
    supplierSchema,
    clientSchema,
]);

// ============================================================================
// STEP 3: Trades Schema
// ============================================================================

export const step3Schema = z.object({
    trades: z
        .array(z.string())
        .min(1, 'Please select at least one trade')
        .optional()
        .or(z.array(z.string()).length(0)), // Allow empty for clients
});

// ============================================================================
// STEP 4: Goals Schema
// ============================================================================

export const step4Schema = z.object({
    goals: z
        .array(z.string())
        .min(1, 'Please select at least one goal')
        .optional()
        .or(z.array(z.string()).length(0)), // Allow empty for clients
});

// ============================================================================
// Complete Form Schema (all steps combined)
// ============================================================================

// Note: We can't directly merge step1Schema (which uses refine) with other schemas
// Instead, we'll create a base schema without the password confirmation check
const step1BaseSchema = z.object({
    firstName: z
        .string()
        .min(1, 'First name is required')
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name must be less than 50 characters')
        .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),

    lastName: z
        .string()
        .min(1, 'Last name is required')
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name must be less than 50 characters')
        .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),

    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address')
        .toLowerCase()
        .trim(),

    password: z
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/, 'Password contains invalid characters'),

    confirmPassword: z
        .string()
        .min(1, 'Please confirm your password'),
});

// For complete form validation, we can create a union of all possible combinations
export const completeSignupSchema = z.union([
    step1BaseSchema.merge(subcontractorSchema).merge(step3Schema).merge(step4Schema),
    step1BaseSchema.merge(generalContractorSchema).merge(step3Schema).merge(step4Schema),
    step1BaseSchema.merge(supplierSchema).merge(step3Schema).merge(step4Schema),
    step1BaseSchema.merge(clientSchema).merge(step3Schema).merge(step4Schema),
]).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

// ============================================================================
// Type Exports (TypeScript types inferred from schemas)
// ============================================================================

export type Step1FormData = z.infer<typeof step1Schema>;
export type SubcontractorFormData = z.infer<typeof subcontractorSchema>;
export type GeneralContractorFormData = z.infer<typeof generalContractorSchema>;
export type SupplierFormData = z.infer<typeof supplierSchema>;
export type ClientFormData = z.infer<typeof clientSchema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3FormData = z.infer<typeof step3Schema>;
export type Step4FormData = z.infer<typeof step4Schema>;
export type CompleteSignupFormData = z.infer<typeof completeSignupSchema>;

// ============================================================================
// Validation Helper Functions
// ============================================================================

/**
 * Validates a single field and returns the error message if invalid
 */
export const validateSingleField = (
    schema: z.ZodSchema,
    fieldName: string,
    value: any
): string | undefined => {
    try {
        // Create a partial schema for just this field
        const fieldSchema = (schema as any).shape[fieldName];
        if (!fieldSchema) return undefined;

        fieldSchema.parse(value);
        return undefined;
    } catch (error) {
        if (error instanceof z.ZodError) {
            return error.errors[0]?.message;
        }
        return undefined;
    }
};

/**
 * Validates an entire step and returns all errors
 */
export const validateStep = (
    schema: z.ZodSchema,
    data: any
): Record<string, string> => {
    try {
        schema.parse(data);
        return {};
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors: Record<string, string> = {};
            error.errors.forEach((err) => {
                const path = err.path.join('.');
                errors[path] = err.message;
            });
            return errors;
        }
        return {};
    }
};

/**
 * Safe parse that returns both success status and data/errors
 */
export const safeValidate = <T>(schema: z.ZodSchema<T>, data: any) => {
    return schema.safeParse(data);
};
