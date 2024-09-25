import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { Container } from './Container';
import {
  FieldErrors,
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
  Controller,
} from 'react-hook-form';
import { formSchema, FormSchema, formSchemaWithDefaults } from './formSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddCircleRounded, DeleteForeverRounded } from '@mui/icons-material';
import { useEffect } from 'react';

export function App() {
  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm<FormSchema>({
    mode: 'all',
    resolver: zodResolver(formSchema),
    defaultValues: formSchemaWithDefaults,
  });

  const { fields, replace, remove, append } = useFieldArray({
    control,
    name: 'languages',
  });

  // получение ошибок полей формы в зависимости от значения полей формы
  const fullErrors: FieldErrors<
    Extract<FormSchema, { hasWorkExperience: true }>
  > &
    FieldErrors<Extract<FormSchema, { educationLevel: 'noFormalEducation' }>> &
    FieldErrors<Extract<FormSchema, { educationLevel: 'highSchoolDiploma' }>> &
    FieldErrors<Extract<FormSchema, { educationLevel: 'bachelorsDegree' }>> &
    FieldErrors<Extract<FormSchema, { knowsOtherLanguages: true }>> = errors;

  // получение значения поля hasWorkExperience
  const hasWorkExperience = useWatch({
    control,
    name: 'hasWorkExperience',
  });

  // получение значения поля knowsOtherLanguages
  const knowsOtherLanguages = useWatch({
    control,
    name: 'knowsOtherLanguages',
  });

  // получение значения поля educationLevel
  const educationLevel = useWatch({
    control,
    name: 'educationLevel',
  });

  useEffect(() => {
    if (hasWorkExperience) {
      replace([{ name: '' }]);
    }
  }, [hasWorkExperience, replace]);

  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <Container>
      <TextField
        {...register('firstName')}
        helperText={fullErrors.firstName?.message}
        error={!!fullErrors.firstName}
        label="Full Name"
      />
      <FormControlLabel
        {...register('hasWorkExperience')}
        label="Work Experience?"
        control={<Checkbox />}
      />
      {hasWorkExperience && (
        <TextField
          {...register('companyName')}
          label="Company Name"
          helperText={fullErrors.companyName?.message}
          error={!!fullErrors.companyName}
        />
      )}
      <FormControlLabel
        {...register('knowsOtherLanguages')}
        label="Know Other Languages?"
        control={<Checkbox />}
      />
      {knowsOtherLanguages && (
        <>
          {fields.map((field, index) => (
            <Box sx={{ display: 'flex' }} key={field.id}>
              <TextField
                key={field.id}
                sx={{ width: '100%' }}
                {...register(`languages.${index}.name`)}
                label="Languages"
                helperText={fullErrors.languages?.[index]?.name?.message}
                error={!!fullErrors.languages?.[index]?.name}
              />
              <IconButton
                sx={{ height: 'fit-content' }}
                disabled={fields.length === 1}
                onClick={() => remove(index)}
                color="error">
                <DeleteForeverRounded />
              </IconButton>
            </Box>
          ))}
          <IconButton
            sx={{ width: 'fit-content' }}
            color="success"
            onClick={() => append({ name: '' })}>
            <AddCircleRounded />
          </IconButton>
        </>
      )}
      <FormControl>
        <FormLabel>Education Level</FormLabel>
        <Controller
          control={control}
          name="educationLevel"
          render={({ field }) => (
            <RadioGroup {...field}>
              <FormControlLabel
                value="noFormalEducation"
                control={<Radio />}
                label="No Formal Education"
              />
              <FormControlLabel
                value="highSchoolDiploma"
                control={<Radio />}
                label="High School Diploma"
              />
              <FormControlLabel
                value="bachelorsDegree"
                control={<Radio />}
                label="Bachelors Degree"
              />
            </RadioGroup>
          )}
        />
      </FormControl>

      {educationLevel === 'highSchoolDiploma' && (
        <TextField
          {...register('schoolName')}
          label="High School Name"
          helperText={fullErrors.schoolName?.message}
          error={!!fullErrors.schoolName?.message}
        />
      )}
      {educationLevel === 'bachelorsDegree' && (
        <TextField
          {...register('universityName')}
          label="University Name"
          helperText={fullErrors.universityName?.message}
          error={!!fullErrors.universityName?.message}
        />
      )}
      <Button variant="contained" onClick={handleSubmit(onSubmit)}>
        Submit
      </Button>
    </Container>
  );
}
