import { z } from 'zod';

// создание объединенного типа что бы в зависимости от значения поля hasWorkExperience отображать или не отображать поле companyName
const workExperienceSchema = z.discriminatedUnion('hasWorkExperience', [
  z.object({
    hasWorkExperience: z.literal(true),
    companyName: z.string().min(1, 'Company name is required'),
  }),
  z.object({
    hasWorkExperience: z.literal(false),
  }),
]);

// создание объединенного типа что бы в зависимости от значения поля educationLevel отображать или не отображать поля highSchoolDiploma и universityName
const educationSchema = z.discriminatedUnion('educationLevel', [
  z.object({
    educationLevel: z.literal('noFormalEducation'),
  }),
  z.object({
    educationLevel: z.literal('highSchoolDiploma'),
    schoolName: z.string().min(1),
  }),
  z.object({
    educationLevel: z.literal('bachelorsDegree'),
    universityName: z.string().min(1),
  }),
]);

// создание объединенного типа что бы в зависимости от значения поля knowsOtherLanguages отображать или не отображать поля languages
const languageKnowledgeSchema = z.discriminatedUnion('knowsOtherLanguages', [
  z.object({
    knowsOtherLanguages: z.literal(true),
    languages: z.array(
      z.object({
        name: z.string().min(1, 'Language is required'),
      }),
    ),
  }),
  z.object({
    knowsOtherLanguages: z.literal(false),
  }),
]);

// создание схемы формы
const formSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
  })
  .and(workExperienceSchema)
  .and(languageKnowledgeSchema)
  .and(educationSchema);

type FormSchema = z.infer<typeof formSchema>;

// инициализация полей
const formSchemaWithDefaults: FormSchema = {
  firstName: '',
  hasWorkExperience: false,
  knowsOtherLanguages: false,
  educationLevel: 'noFormalEducation',
};

export { formSchema, formSchemaWithDefaults, type FormSchema };
